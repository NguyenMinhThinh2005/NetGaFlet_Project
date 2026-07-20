import React, { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  getWatchHistory,
  saveWatchProgress,
} from '../lib/dbServices';
import { getMovieDetails } from '../lib/movieApi';

interface AppState {
  watchlist: string[]; // movie slugs
  favoritesList: any[]; // full movie details for saved items
  watchHistory: any[];
  selectedMood: string;
  selectedGenres: string[];
  notifications: boolean;
}

type AppAction =
  | { type: 'SET_WATCHLIST'; payload: string[] }
  | { type: 'SET_FAVORITES_LIST'; payload: any[] }
  | { type: 'SET_HISTORY'; payload: any[] }
  | { type: 'TOGGLE_WATCHLIST_STATE'; payload: string }
  | { type: 'ADD_TO_HISTORY_STATE'; payload: any }
  | { type: 'SET_MOOD'; payload: string }
  | { type: 'SET_GENRES'; payload: string[] }
  | { type: 'CLEAR_HISTORY_STATE' };

const AppContext = createContext<{
  watchlist: string[];
  favoritesList: any[];
  watchHistory: any[];
  selectedMood: string;
  selectedGenres: string[];
  notifications: boolean;
  toggleWatchlist: (movie: any) => Promise<void>;
  removeFromWatchlist: (id: string) => Promise<void>;
  setMood: (mood: string) => void;
  setGenres: (genres: string[]) => void;
  addToHistory: (
    movieSlug: string,
    movieName: string,
    episodeName: string,
    durationWatched: number,
    totalDuration: number
  ) => Promise<void>;
  clearHistory: () => void;
  isInWatchlist: (id: string) => boolean;
  loadUserData: () => Promise<void>;
} | null>(null);

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_WATCHLIST':
      return { ...state, watchlist: action.payload };
    case 'SET_FAVORITES_LIST':
      return { ...state, favoritesList: action.payload };
    case 'SET_HISTORY':
      return { ...state, watchHistory: action.payload };
    case 'TOGGLE_WATCHLIST_STATE': {
      const id = action.payload;
      const exists = state.watchlist.includes(id);
      return {
        ...state,
        watchlist: exists
          ? state.watchlist.filter(w => w !== id)
          : [...state.watchlist, id],
      };
    }
    case 'ADD_TO_HISTORY_STATE':
      return {
        ...state,
        watchHistory: [
          action.payload,
          ...state.watchHistory.filter(h => h.movieId !== action.payload.movieId),
        ],
      };
    case 'CLEAR_HISTORY_STATE':
      return { ...state, watchHistory: [] };
    case 'SET_MOOD':
      return { ...state, selectedMood: action.payload };
    case 'SET_GENRES':
      return { ...state, selectedGenres: action.payload };
    default:
      return state;
  }
};

export function AppProvider({ children }: { children: ReactNode }) {
  const { activeProfile } = useAuth();

  const [state, dispatch] = useReducer(appReducer, {
    watchlist: [],
    favoritesList: [],
    watchHistory: [],
    selectedMood: 'Mind = Blown',
    selectedGenres: ['Action', 'Comedy', 'Sci-Fi', 'Thriller'],
    notifications: true,
  });

  const loadUserData = useCallback(async () => {
    if (!activeProfile?.id) {
      dispatch({ type: 'SET_WATCHLIST', payload: [] });
      dispatch({ type: 'SET_FAVORITES_LIST', payload: [] });
      dispatch({ type: 'SET_HISTORY', payload: [] });
      return;
    }

    try {
      // Fetch watchlist
      const { data: favs } = await getFavorites(activeProfile.id);
      if (favs) {
        dispatch({ type: 'SET_WATCHLIST', payload: favs.map((f: any) => f.movie_slug) });
        dispatch({
          type: 'SET_FAVORITES_LIST',
          payload: favs.map((f: any) => ({
            id: f.movie_slug,
            title: f.movie_name,
            thumbUrl: f.movie_thumb,
            posterGradient: 'linear-gradient(135deg, #0d0d1a 0%, #1a1a3e 40%, #0f2060 80%)',
          })),
        });
      }

      // Fetch watch history
      const { data: hist } = await getWatchHistory(activeProfile.id);
      if (hist) {
        const mappedHist = await Promise.all(
          hist.map(async (h: any) => {
            let thumbUrl = null;
            try {
              const res = await getMovieDetails(h.movie_slug);
              if (res && res.movie) {
                thumbUrl = res.movie.thumb_url || res.movie.poster_url;
              }
            } catch (err) {
              console.error('Lỗi lấy ảnh thu nhỏ cho lịch sử:', h.movie_slug, err);
            }
            return {
              movieId: h.movie_slug,
              title: h.movie_name,
              watchedAt: h.updated_at,
              progress: h.total_duration > 0 ? h.duration_watched / h.total_duration : 0,
              duration: `${Math.round(h.total_duration / 60)}m`,
              gradient: 'linear-gradient(135deg, #0a0a14 0%, #1a1a3e 50%, #0f3060 100%)',
              thumbUrl: thumbUrl,
            };
          })
        );
        dispatch({ type: 'SET_HISTORY', payload: mappedHist });
      }
    } catch (err) {
      console.error('Error fetching watchlist/history from Supabase:', err);
    }
  }, [activeProfile?.id]);

  // Load watchlist and history when profile changes
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const toggleWatchlist = async (movie: any) => {
    if (!activeProfile?.id || !movie?.id) return;
    const isFav = state.watchlist.includes(movie.id);

    try {
      if (isFav) {
        const { error } = await removeFromFavorites(activeProfile.id, movie.id);
        if (!error) {
          await loadUserData();
        }
      } else {
        const { error } = await addToFavorites(
          activeProfile.id,
          movie.id,
          movie.title || movie.name || 'Unknown Movie',
          movie.thumbUrl || movie.thumb_url || movie.posterGradient || ''
        );
        if (!error) {
          await loadUserData();
        }
      }
    } catch (err) {
      console.error('Error in toggleWatchlist:', err);
    }
  };

  const removeFromWatchlist = async (movieSlug: string) => {
    if (!activeProfile?.id) return;
    try {
      const { error } = await removeFromFavorites(activeProfile.id, movieSlug);
      if (!error) {
        await loadUserData();
      }
    } catch (err) {
      console.error('Error in removeFromWatchlist:', err);
    }
  };

  const setMood = (mood: string) => dispatch({ type: 'SET_MOOD', payload: mood });
  const setGenres = (genres: string[]) => dispatch({ type: 'SET_GENRES', payload: genres });

  const addToHistory = async (
    movieSlug: string,
    movieName: string,
    episodeName: string,
    durationWatched: number,
    totalDuration: number
  ) => {
    if (!activeProfile?.id) return;
    try {
      const { error } = await saveWatchProgress(
        activeProfile.id,
        movieSlug,
        movieName,
        episodeName,
        durationWatched,
        totalDuration
      );

      if (!error) {
        // Sync local history state
        await loadUserData();
      }
    } catch (err) {
      console.error('Error saving watch history progress:', err);
    }
  };

  const clearHistory = () => {
    dispatch({ type: 'CLEAR_HISTORY_STATE' });
  };

  const isInWatchlist = (id: string) => state.watchlist.includes(id);

  return (
    <AppContext.Provider
      value={{
        ...state,
        toggleWatchlist,
        removeFromWatchlist,
        setMood,
        setGenres,
        addToHistory,
        clearHistory,
        isInWatchlist,
        loadUserData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
};

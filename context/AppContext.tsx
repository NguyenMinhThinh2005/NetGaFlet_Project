import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { mockMovies } from '../data/mockMovies';
import { mockUser } from '../data/mockUser';

interface AppState {
  watchlist: string[];
  watchHistory: typeof mockUser.watchHistory;
  selectedMood: string;
  selectedGenres: string[];
  notifications: boolean;
}

type AppAction =
  | { type: 'TOGGLE_WATCHLIST'; payload: string }
  | { type: 'REMOVE_FROM_WATCHLIST'; payload: string }
  | { type: 'SET_MOOD'; payload: string }
  | { type: 'SET_GENRES'; payload: string[] }
  | { type: 'ADD_TO_HISTORY'; payload: any }
  | { type: 'CLEAR_HISTORY' };

const AppContext = createContext<{
  watchlist: string[];
  watchHistory: typeof mockUser.watchHistory;
  selectedMood: string;
  selectedGenres: string[];
  notifications: boolean;
  toggleWatchlist: (id: string) => void;
  removeFromWatchlist: (id: string) => void;
  setMood: (mood: string) => void;
  setGenres: (genres: string[]) => void;
  addToHistory: (item: any) => void;
  clearHistory: () => void;
  isInWatchlist: (id: string) => boolean;
} | null>(null);

const initialWatchlist = mockMovies.filter(m => m.inWatchlist).map(m => m.id);

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'TOGGLE_WATCHLIST': {
      const id = action.payload;
      const exists = state.watchlist.includes(id);
      return {
        ...state,
        watchlist: exists
          ? state.watchlist.filter(w => w !== id)
          : [...state.watchlist, id],
      };
    }
    case 'REMOVE_FROM_WATCHLIST':
      return { ...state, watchlist: state.watchlist.filter(w => w !== action.payload) };
    case 'SET_MOOD':
      return { ...state, selectedMood: action.payload };
    case 'SET_GENRES':
      return { ...state, selectedGenres: action.payload };
    case 'ADD_TO_HISTORY':
      return {
        ...state,
        watchHistory: [
          action.payload,
          ...state.watchHistory.filter(h => h.movieId !== action.payload.movieId),
        ],
      };
    case 'CLEAR_HISTORY':
      return { ...state, watchHistory: [] };
    default:
      return state;
  }
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, {
    watchlist: initialWatchlist,
    watchHistory: mockUser.watchHistory,
    selectedMood: 'Mind = Blown',
    selectedGenres: ['Action', 'Comedy', 'Sci-Fi', 'Thriller'],
    notifications: true,
  });

  const toggleWatchlist = (id: string) => dispatch({ type: 'TOGGLE_WATCHLIST', payload: id });
  const removeFromWatchlist = (id: string) => dispatch({ type: 'REMOVE_FROM_WATCHLIST', payload: id });
  const setMood = (mood: string) => dispatch({ type: 'SET_MOOD', payload: mood });
  const setGenres = (genres: string[]) => dispatch({ type: 'SET_GENRES', payload: genres });
  const addToHistory = (item: any) => dispatch({ type: 'ADD_TO_HISTORY', payload: item });
  const clearHistory = () => dispatch({ type: 'CLEAR_HISTORY' });

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

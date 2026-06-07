import { createContext, useContext, useReducer } from 'react';
import { mockMovies } from '../data/mockMovies';
import { mockUser } from '../data/mockUser';

const AppContext = createContext(null);

const initialWatchlist = mockMovies.filter(m => m.inWatchlist).map(m => m.id);

const appReducer = (state, action) => {
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
        watchHistory: [action.payload, ...state.watchHistory.filter(h => h.movieId !== action.payload.movieId)],
      };
    case 'CLEAR_HISTORY':
      return { ...state, watchHistory: [] };
    default:
      return state;
  }
};

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, {
    watchlist: initialWatchlist,
    watchHistory: mockUser.watchHistory,
    selectedMood: 'Mind = Blown',
    selectedGenres: ['Action', 'Comedy', 'Sci-Fi', 'Thriller'],
    notifications: true,
  });

  const toggleWatchlist = (id) => dispatch({ type: 'TOGGLE_WATCHLIST', payload: id });
  const removeFromWatchlist = (id) => dispatch({ type: 'REMOVE_FROM_WATCHLIST', payload: id });
  const setMood = (mood) => dispatch({ type: 'SET_MOOD', payload: mood });
  const setGenres = (genres) => dispatch({ type: 'SET_GENRES', payload: genres });
  const addToHistory = (item) => dispatch({ type: 'ADD_TO_HISTORY', payload: item });
  const clearHistory = () => dispatch({ type: 'CLEAR_HISTORY' });

  const isInWatchlist = (id) => state.watchlist.includes(id);

  return (
    <AppContext.Provider value={{
      ...state,
      toggleWatchlist,
      removeFromWatchlist,
      setMood,
      setGenres,
      addToHistory,
      clearHistory,
      isInWatchlist,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
};

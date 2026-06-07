import { createContext, useContext, useReducer } from 'react';
import { mockUser } from '../data/mockUser';

const AuthContext = createContext(null);

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isLoggedIn: true, user: action.payload || mockUser, hasOnboarded: true };
    case 'LOGOUT':
      return { ...state, isLoggedIn: false, user: null };
    case 'SET_ONBOARDED':
      return { ...state, hasOnboarded: true };
    default:
      return state;
  }
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, {
    isLoggedIn: false,
    user: null,
    hasOnboarded: false,
  });

  const login = (email, password) => {
    if (email && password) {
      dispatch({ type: 'LOGIN', payload: mockUser });
      return true;
    }
    return false;
  };

  const logout = () => dispatch({ type: 'LOGOUT' });
  const setOnboarded = () => dispatch({ type: 'SET_ONBOARDED' });

  return (
    <AuthContext.Provider value={{ ...state, login, logout, setOnboarded }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};

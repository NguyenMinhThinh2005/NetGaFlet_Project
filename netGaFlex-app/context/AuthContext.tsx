import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { getUserProfiles } from '../lib/dbServices';

export interface UserStats {
  watched: number;
  watchlist: number;
  avgRating: number;
  totalHoursWatched: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatarUrl: string | null;
  memberType: string;
  joinYear: number;
  stats: UserStats;
  preferredGenres: string[];
  subtitleLanguage: string;
  notificationsEnabled: boolean;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserProfile | null;
  activeProfile: any | null;
  loading: boolean;
  hasOnboarded: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  setOnboarded: () => void;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function getInitials(name: string): string {
  if (!name) return 'U';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [activeProfile, setActiveProfile] = useState<any>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  // Helper: wait for a given number of milliseconds
  const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

  // Sync session and fetch profile
  const syncSession = async (currentSession: any) => {
    setSession(currentSession);
    if (currentSession?.user) {
      try {
        // Fetch profiles for the user
        const { data: profiles } = await getUserProfiles(currentSession.user.id);

        let resolvedProfiles = profiles;

        // If no profile yet, the handle_new_user DB trigger may still be running.
        // Wait once and retry before giving up.
        if (!resolvedProfiles || resolvedProfiles.length === 0) {
          await wait(1500);
          const { data: retryProfiles } = await getUserProfiles(currentSession.user.id);
          resolvedProfiles = retryProfiles;
        }

        if (resolvedProfiles && resolvedProfiles.length > 0) {
          const profile = resolvedProfiles[0];
          setActiveProfile(profile);

          // Get stats from DB
          const { count: watchlistCount } = await supabase
            .from('favorites')
            .select('*', { count: 'exact', head: true })
            .eq('profile_id', profile.id);

          const { count: watchedCount } = await supabase
            .from('watch_history')
            .select('*', { count: 'exact', head: true })
            .eq('profile_id', profile.id);

          const name = profile.name || currentSession.user.user_metadata?.full_name || 'User';

          setUser({
            id: profile.id,
            name,
            email: currentSession.user.email || '',
            initials: getInitials(name),
            avatarUrl: profile.avatar_url,
            memberType: 'Premium Member',
            joinYear: new Date(currentSession.user.created_at).getFullYear() || 2026,
            stats: {
              watched: watchedCount || 0,
              watchlist: watchlistCount || 0,
              avgRating: 4.5,
              totalHoursWatched: Math.round((watchedCount || 0) * 1.8),
            },
            preferredGenres: ['Action', 'Sci-Fi', 'Thriller', 'Comedy'],
            subtitleLanguage: 'English',
            notificationsEnabled: true,
          });
        }
      } catch (err) {
        console.error('Lỗi khi tải profile từ Supabase:', err);
      }
    } else {
      setActiveProfile(null);
      setUser(null);
    }
  };

  useEffect(() => {
    // Initial check
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      syncSession(initialSession).finally(() => setLoading(false));
    });

    // Listen to auth state changes.
    // IMPORTANT: setLoading(false) is in a finally block so it always fires,
    // even if syncSession throws or navigation unmounts the component.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setLoading(true);
      try {
        await syncSession(newSession);
      } catch (err) {
        console.error('onAuthStateChange syncSession error:', err);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Lỗi đăng nhập' };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Lỗi đăng ký' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const setOnboarded = () => setHasOnboarded(true);

  const refreshUserProfile = async () => {
    if (session) {
      await syncSession(session);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!user,
        user,
        activeProfile,
        loading,
        hasOnboarded,
        login,
        signUp,
        logout,
        setOnboarded,
        refreshUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};

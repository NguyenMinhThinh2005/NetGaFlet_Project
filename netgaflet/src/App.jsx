import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import MobileFrame from './components/layout/MobileFrame';

// Screens
import SplashScreen from './screens/SplashScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import GenreSetupScreen from './screens/GenreSetupScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import SearchScreen from './screens/SearchScreen';
import MoodPickerScreen from './screens/MoodPickerScreen';
import ChatbotScreen from './screens/ChatbotScreen';
import WatchlistScreen from './screens/WatchlistScreen';
import MovieDetailScreen from './screens/MovieDetailScreen';
import VideoPlayerScreen from './screens/VideoPlayerScreen';
import NextEpisodeScreen from './screens/NextEpisodeScreen';
import RoastResultScreen from './screens/RoastResultScreen';
import ShakeSurpriseScreen from './screens/ShakeSurpriseScreen';
import ErrorStateScreen from './screens/ErrorStateScreen';
import SettingsScreen from './screens/SettingsScreen';
import WatchHistoryScreen from './screens/WatchHistoryScreen';
import EpisodeListScreen from './screens/EpisodeListScreen';

function AuthGuard({ children }) {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) return <Navigate to="/signin" replace />;
  return children;
}

function GuestGuard({ children }) {
  const { isLoggedIn } = useAuth();
  if (isLoggedIn) return <Navigate to="/home" replace />;
  return children;
}

function AppRoutes() {
  return (
    <MobileFrame>
      <Routes>
        {/* Splash */}
        <Route path="/" element={<SplashScreen />} />

        {/* Onboarding / Auth */}
        <Route path="/onboarding" element={<GuestGuard><OnboardingScreen /></GuestGuard>} />
        <Route path="/genre-setup" element={<GenreSetupScreen />} />
        <Route path="/signin" element={<GuestGuard><SignInScreen /></GuestGuard>} />
        <Route path="/signup" element={<GuestGuard><SignUpScreen /></GuestGuard>} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />

        {/* Main app — protected */}
        <Route path="/home" element={<AuthGuard><HomeScreen /></AuthGuard>} />
        <Route path="/search" element={<AuthGuard><SearchScreen /></AuthGuard>} />
        <Route path="/profile" element={<AuthGuard><ProfileScreen /></AuthGuard>} />

        {/* Movie / Series */}
        <Route path="/movie/:id" element={<AuthGuard><MovieDetailScreen /></AuthGuard>} />
        <Route path="/movie/:id/play" element={<AuthGuard><VideoPlayerScreen /></AuthGuard>} />
        <Route path="/movie/:id/next" element={<AuthGuard><NextEpisodeScreen /></AuthGuard>} />
        <Route path="/series/:id/episodes" element={<AuthGuard><EpisodeListScreen /></AuthGuard>} />

        {/* Features */}
        <Route path="/chatbot" element={<AuthGuard><ChatbotScreen /></AuthGuard>} />
        <Route path="/watchlist" element={<AuthGuard><WatchlistScreen /></AuthGuard>} />
        <Route path="/watch-history" element={<AuthGuard><WatchHistoryScreen /></AuthGuard>} />
        <Route path="/mood-picker" element={<AuthGuard><MoodPickerScreen /></AuthGuard>} />
        <Route path="/roast-result" element={<AuthGuard><RoastResultScreen /></AuthGuard>} />
        <Route path="/shake-surprise" element={<AuthGuard><ShakeSurpriseScreen /></AuthGuard>} />
        <Route path="/settings" element={<AuthGuard><SettingsScreen /></AuthGuard>} />
        <Route path="/error" element={<ErrorStateScreen />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MobileFrame>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

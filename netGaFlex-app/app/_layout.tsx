import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

import { AuthProvider, useAuth } from '../context/AuthContext';
import { AppProvider } from '../context/AppContext';

function AuthListener() {
  const { isLoggedIn, hasOnboarded, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'signin' || segments[0] === 'signup' || segments[0] === 'onboarding' || segments[0] === 'forgot-password' || !segments[0];

    if (!isLoggedIn && !inAuthGroup) {
      if (hasOnboarded) {
        router.replace('/signin');
      } else {
        router.replace('/onboarding');
      }
    } else if (isLoggedIn && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isLoggedIn, hasOnboarded, loading, segments]);

  return null;
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <AppProvider>
        <ThemeProvider value={DarkTheme}>
          <AuthListener />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="genre-setup" />
            <Stack.Screen name="signin" />
            <Stack.Screen name="signup" />
            <Stack.Screen name="forgot-password" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="watchlist" />
            <Stack.Screen name="watch-history" />
            <Stack.Screen name="mood-picker" />
            <Stack.Screen name="roast-result" />
            <Stack.Screen name="shake-surprise" />
            <Stack.Screen name="settings" />
            <Stack.Screen name="error" />
            <Stack.Screen name="movie/[id]" />
            <Stack.Screen name="movie/[id]/play" />
            <Stack.Screen name="movie/[id]/next" />
            <Stack.Screen name="series/[id]/episodes" />
          </Stack>
        </ThemeProvider>
      </AppProvider>
    </AuthProvider>
  );
}


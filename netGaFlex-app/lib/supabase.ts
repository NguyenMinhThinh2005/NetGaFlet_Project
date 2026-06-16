import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Các biến môi trường bắt đầu bằng EXPO_PUBLIC_ sẽ tự động được Expo load ở cả môi trường dev và production
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase URL hoặc Anon Key chưa được cấu hình trong file .env. Vui lòng kiểm tra lại.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Tắt tính năng detect session qua URL trên mobile (trừ khi dùng Deep Linking)
  },
});

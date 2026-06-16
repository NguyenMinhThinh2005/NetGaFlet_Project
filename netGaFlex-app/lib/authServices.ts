import { supabase } from './supabase';

/**
 * Đăng ký tài khoản mới bằng Email và Mật khẩu
 * Khi đăng ký thành công, trigger `on_auth_user_created` trên Supabase 
 * sẽ tự động tạo một profile mặc định trong bảng `profiles`.
 */
export async function signUpWithEmail(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName, // Được trigger handle_new_user sử dụng làm tên profile
      },
    },
  });
  return { data, error };
}

/**
 * Đăng nhập bằng Email và Mật khẩu
 */
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

/**
 * Đăng xuất tài khoản
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Lấy thông tin user hiện tại đang đăng nhập
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

/**
 * Theo dõi trạng thái đăng nhập thay đổi (Sign in, Sign out, Token refreshed)
 * Dùng ở cấp độ Component root (ví dụ: app/_layout.tsx) để chuyển hướng màn hình Auth/Home
 */
export function onAuthStateChange(callback: (session: any) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  return subscription; // Gọi subscription.unsubscribe() khi component unmount
}

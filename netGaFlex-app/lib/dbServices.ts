import { supabase } from './supabase';

// =========================================================================
// 1. QUẢN LÝ HỒ SƠ NGƯỜI DÙNG (PROFILES)
// =========================================================================

/**
 * Lấy danh sách hồ sơ (profiles) của người dùng hiện tại
 */
export async function getUserProfiles(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId);
  return { data, error };
}

/**
 * Tạo thêm hồ sơ mới (Tối đa 5 profile giống Netflix)
 */
export async function createProfile(userId: string, name: string, avatarUrl?: string) {
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      {
        user_id: userId,
        name,
        avatar_url: avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${name}-${Date.now()}`,
      },
    ])
    .select()
    .single();
  return { data, error };
}

// =========================================================================
// 2. DANH SÁCH YÊU THÍCH (FAVORITES / MY LIST)
// =========================================================================

/**
 * Lấy danh sách phim yêu thích của một profile cụ thể
 */
export async function getFavorites(profileId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false });
  return { data, error };
}

/**
 * Thêm phim vào danh sách yêu thích
 */
export async function addToFavorites(
  profileId: string,
  movieSlug: string,
  movieName: string,
  movieThumb: string
) {
  const { data, error } = await supabase
    .from('favorites')
    .insert([
      {
        profile_id: profileId,
        movie_slug: movieSlug,
        movie_name: movieName,
        movie_thumb: movieThumb,
      },
    ])
    .select()
    .single();
  return { data, error };
}

/**
 * Xóa phim khỏi danh sách yêu thích
 */
export async function removeFromFavorites(profileId: string, movieSlug: string) {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('profile_id', profileId)
    .eq('movie_slug', movieSlug);
  return { error };
}

/**
 * Kiểm tra xem phim đã nằm trong danh sách yêu thích chưa
 */
export async function checkIfFavorite(profileId: string, movieSlug: string) {
  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('profile_id', profileId)
    .eq('movie_slug', movieSlug)
    .maybeSingle();
  return { isFavorite: !!data, error };
}

// =========================================================================
// 3. LỊCH SỬ XEM PHIM (WATCH HISTORY / CONTINUE WATCHING)
// =========================================================================

/**
 * Lấy danh sách lịch sử xem phim của một profile (dùng cho mục Tiếp tục xem)
 */
export async function getWatchHistory(profileId: string) {
  const { data, error } = await supabase
    .from('watch_history')
    .select('*')
    .eq('profile_id', profileId)
    .order('updated_at', { ascending: false });
  return { data, error };
}

/**
 * Cập nhật tiến độ xem phim (Nếu chưa có thì thêm mới, đã có thì cập nhật)
 */
export async function saveWatchProgress(
  profileId: string,
  movieSlug: string,
  movieName: string,
  episodeName: string,
  durationWatched: number,
  totalDuration: number
) {
  const { data, error } = await supabase
    .from('watch_history')
    .upsert(
      {
        profile_id: profileId,
        movie_slug: movieSlug,
        movie_name: movieName,
        episode_name: episodeName,
        duration_watched: durationWatched,
        total_duration: totalDuration,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'profile_id,movie_slug', // Trùng profile_id và movie_slug sẽ update thay vì insert
      }
    )
    .select()
    .single();
  return { data, error };
}

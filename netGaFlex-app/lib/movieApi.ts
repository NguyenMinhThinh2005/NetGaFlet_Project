// =========================================================================
// OPHIM API SERVICE WRAPPER
// Chứa toàn bộ các hàm gọi API lấy danh sách, thông tin và link stream phim từ OPhim
// =========================================================================

const BASE_URL = 'https://ophim1.com';
const API_V1_URL = 'https://ophim1.com/v1/api';

/**
 * Helper để gọi các request GET
 */
async function fetchGet(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Lỗi HTTP! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Lỗi gọi API OPhim tại URL: ${url}`, error);
    return null;
  }
}

// =========================================================================
// 1. PHIM TRANG CHỦ & PHIM MỚI CẬP NHẬT
// =========================================================================

/**
 * Lấy dữ liệu phim trang chủ (Phim hot, banner, phim đề cử...)
 * Endpoint: https://ophim1.com/v1/api/home
 */
export async function getHomeData() {
  const url = `${API_V1_URL}/home`;
  const data = await fetchGet(url);

  if (data && data.status === 'success') {
    return {
      success: true,
      data: data.data || null, // Chứa các danh sách phim được phân loại cho trang chủ
      pathImage: data.data?.APP_DOMAIN_CDN_IMAGE || 'https://img.ophim.tv/uploads/images/',
    };
  }
  return { success: false, data: null, pathImage: '' };
}

/**
 * Lấy danh sách phim mới cập nhật (phân trang)
 * Endpoint: https://ophim1.com/danh-sach/phim-moi-cap-nhat?page={page}
 */
export async function getNewUpdatedMovies(page: number = 1) {
  const url = `${BASE_URL}/danh-sach/phim-moi-cap-nhat?page=${page}`;
  const data = await fetchGet(url);

  if (data && data.status) {
    return {
      movies: data.items || [],
      pathImage: data.pathImage || 'https://img.ophim.tv/uploads/images/',
      pagination: data.pagination || null,
    };
  }
  return { movies: [], pathImage: '', pagination: null };
}

// =========================================================================
// 2. CHI TIẾT BỘ PHIM & TẬP PHIM (Có link stream m3u8)
// =========================================================================
export async function getMovieDetails(slug: string) {
  const url = `${BASE_URL}/phim/${slug}`;
  const data = await fetchGet(url);

  if (data && data.status) {
    return {
      movie: data.movie || null,         // Chi tiết phim (Tên, nội dung, đạo diễn, diễn viên, ảnh)
      episodes: data.episodes || [],     // Mảng danh sách tập phim & link stream m3u8
    };
  }
  return { movie: null, episodes: [] };
}

// =========================================================================
// 3. TÌM KIẾM PHIM (Theo từ khóa)
// =========================================================================
export async function searchMovies(keyword: string, limit: number = 10) {
  const encodedKeyword = encodeURIComponent(keyword);
  const url = `${API_V1_URL}/tim-kiem?keyword=${encodedKeyword}&limit=${limit}`;
  const data = await fetchGet(url);

  if (data && data.status === 'success') {
    return {
      movies: data.data.items || [],
      pathImage: data.data.APP_DOMAIN_CDN_IMAGE || 'https://img.ophim.tv/uploads/images/',
      pagination: data.data.params.pagination || null,
    };
  }
  return { movies: [], pathImage: '', pagination: null };
}

// =========================================================================
// 4. DANH SÁCH THỂ LOẠI & QUỐC GIA
// =========================================================================

// Lấy danh sách tất cả các Thể loại phim
export async function getGenresList() {
  const url = `${API_V1_URL}/the-loai`;
  const data = await fetchGet(url);
  return data && data.status === 'success' ? data.data.items || [] : [];
}

// Lấy danh sách tất cả các Quốc gia phim
export async function getCountriesList() {
  const url = `${API_V1_URL}/quoc-gia`;
  const data = await fetchGet(url);
  return data && data.status === 'success' ? data.data.items || [] : [];
}

// =========================================================================
// 5. LỌC PHIM (Theo loại phim, thể loại, hoặc quốc gia)
// =========================================================================

/**
 * Lọc phim theo loại danh sách (phim-bo, phim-le, hoat-hinh, tv-shows)
 */
export async function getMoviesByType(type: 'phim-bo' | 'phim-le' | 'hoat-hinh' | 'tv-shows', page: number = 1) {
  const url = `${API_V1_URL}/danh-sach/${type}?page=${page}`;
  const data = await fetchGet(url);

  if (data && data.status === 'success') {
    return {
      movies: data.data.items || [],
      pathImage: data.data.APP_DOMAIN_CDN_IMAGE || 'https://img.ophim.tv/uploads/images/',
      pagination: data.data.params.pagination || null,
    };
  }
  return { movies: [], pathImage: '', pagination: null };
}

/**
 * Lọc phim theo thể loại (Ví dụ: hanh-dong, tinh-cam...)
 */
export async function getMoviesByGenre(genreSlug: string, page: number = 1) {
  const url = `${API_V1_URL}/the-loai/${genreSlug}?page=${page}`;
  const data = await fetchGet(url);

  if (data && data.status === 'success') {
    return {
      movies: data.data.items || [],
      pathImage: data.data.APP_DOMAIN_CDN_IMAGE || 'https://img.ophim.tv/uploads/images/',
      pagination: data.data.params.pagination || null,
    };
  }
  return { movies: [], pathImage: '', pagination: null };
}

/**
 * Lọc phim theo quốc gia (Ví dụ: trung-quoc, han-quoc...)
 */
export async function getMoviesByCountry(countrySlug: string, page: number = 1) {
  const url = `${API_V1_URL}/quoc-gia/${countrySlug}?page=${page}`;
  const data = await fetchGet(url);

  if (data && data.status === 'success') {
    return {
      movies: data.data.items || [],
      pathImage: data.data.APP_DOMAIN_CDN_IMAGE || 'https://img.ophim.tv/uploads/images/',
      pagination: data.data.params.pagination || null,
    };
  }
  return { movies: [], pathImage: '', pagination: null };
}

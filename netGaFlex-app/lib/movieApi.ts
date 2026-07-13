// =========================================================================
// OPHIM API SERVICE WRAPPER (BỘ BỌC DỊCH VỤ API OPHIM)
// Chứa toàn bộ các hàm gọi API lấy danh sách, thông tin và link stream phim từ OPhim
// Tích hợp bộ lọc phim người lớn/18+ để làm sạch nội dung hiển thị trong app
// TODO(Architecture): Đảm bảo toàn bộ dữ liệu phim (danh sách, chi tiết, stream) 
// BẮT BUỘC phải được gọi trực tiếp thông qua Movie API (REST API). 
// TUYỆT ĐỐI KHÔNG sử dụng Local Storage để cache file media hay thực hiện chức năng Download.
// =========================================================================

// Cấu hình URL cơ sở cho các tài nguyên chung (như trang chi tiết phim, danh sách phim mới)
const BASE_URL = 'https://ophim1.com';
// Cấu hình URL cơ sở phiên bản v1 cho các API lọc, tìm kiếm, thể loại, quốc gia
const API_V1_URL = 'https://ophim1.com/v1/api';

/**
 * Hàm kiểm tra và lọc bỏ phim 18+ dựa vào thể loại, slug và tiêu đề
 * @param movie Đối tượng phim nhận được từ API OPhim
 */
function isAdultMovie(movie: any): boolean {
  if (!movie) return false;

  // 1. Kiểm tra mảng category từ API OPhim (mỗi phần tử có slug và name)
  if (movie.category && Array.isArray(movie.category)) {
    const hasAdultGenre = movie.category.some((cat: any) => 
      cat.slug === 'phim-18' || 
      cat.name === 'Phim 18+' || 
      cat.slug?.toLowerCase().includes('18-plus')
    );
    if (hasAdultGenre) return true;
  }

  // 2. Kiểm tra mảng genres dạng chuỗi (dùng cho map UI)
  if (movie.genres && Array.isArray(movie.genres)) {
    const hasAdultGenre = movie.genres.some((g: string) => 
      g === 'Phim 18+' || 
      g === '18+' || 
      g?.toLowerCase().includes('phim-18')
    );
    if (hasAdultGenre) return true;
  }

  // 3. Kiểm tra từ khóa nhạy cảm trong slug và tiêu đề phim (để bắt phim 18+ chưa gán đúng category)
  const adultKeywords = ['phim-18', '18-plus', 'hentai', 'adult', 'erotic', 'sex', 'khieu-dam', 'sex-toy', 'loan-luan', 'uncensored', '18s'];
  const slug = movie.slug || '';
  const name = (movie.name || '').toLowerCase();
  const originName = (movie.origin_name || '').toLowerCase();

  // Kiểm tra nếu slug chứa từ khóa nhạy cảm
  const matchSlug = adultKeywords.some(kw => slug.includes(kw));
  if (matchSlug) return true;

  // Kiểm tra nếu tên tiếng Việt hoặc tên gốc tiếng Anh chứa từ khóa nhạy cảm
  const matchName = ['18+', 'phim 18', 'hentai', 'adult', 'erotic', 'phim18', 'cảnh nóng', 'phim người lớn'].some(kw => 
    name.includes(kw) || originName.includes(kw)
  );
  if (matchName) return true;

  return false;
}

/**
 * Helper để gọi các request GET và xử lý lỗi mạng/HTTP tập trung
 * @param url Đường dẫn API cần fetch dữ liệu
 */
async function fetchGet(url: string) {
  try {
    // Thực hiện gọi mạng bằng hàm fetch tích hợp sẵn của JavaScript
    const response = await fetch(url);
    
    // Nếu phản hồi HTTP không thành công (status không nằm trong khoảng 200-299)
    if (!response.ok) {
      // Trường hợp không tìm thấy tài nguyên (lỗi 404), trả về null thay vì ném lỗi
      if (response.status === 404) {
        return null;
      }
      // Ném ra ngoại lệ nếu gặp các mã lỗi HTTP khác (ví dụ: 500, 403, 400)
      throw new Error(`Lỗi HTTP! Status: ${response.status}`);
    }
    // Chuyển đổi dữ liệu thô nhận được từ API thành định dạng JSON và trả về
    return await response.json();
  } catch (error) {
    // Ghi nhận cảnh báo ra console nếu xảy ra lỗi trong quá trình kết nối hoặc phân tích JSON
    console.warn(`Lỗi gọi API OPhim tại URL: ${url}`, error);
    // Trả về null để đảm bảo ứng dụng không bị crash và luồng gọi có thể xử lý fallback
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
  // Đường dẫn API lấy thông tin trang chủ của OPhim
  const url = `${API_V1_URL}/home`;
  // Gọi hàm helper fetchGet để thực hiện request
  const data = await fetchGet(url);

  // Kiểm tra nếu dữ liệu tồn tại và thuộc tính status trả về giá trị 'success'
  if (data && data.status === 'success') {
    // Lấy danh sách phim gốc
    const items = data.data?.items || [];
    // Lọc bỏ tất cả phim người lớn/18+
    const filteredItems = items.filter((m: any) => !isAdultMovie(m));

    return {
      // Đánh dấu request thành công
      success: true,
      // Trả về dữ liệu gốc nhưng đã thay thế items bằng danh sách đã được lọc sạch
      data: {
        ...data.data,
        items: filteredItems,
      }, 
      // Lấy domain CDN chứa ảnh phim từ API hoặc gán giá trị fallback mặc định
      pathImage: data.data?.APP_DOMAIN_CDN_IMAGE || 'https://img.ophim.live/uploads/movies/',
    };
  }
  // Trả về cấu trúc mặc định báo thất bại nếu dữ liệu không đúng cấu trúc mong muốn
  return { success: false, data: null, pathImage: '' };
}

/**
 * Lấy danh sách phim mới cập nhật (hỗ trợ phân trang)
 * Endpoint: https://ophim1.com/danh-sach/phim-moi-cap-nhat?page={page}
 * @param page Số trang cần lấy, mặc định là trang 1
 */
export async function getNewUpdatedMovies(page: number = 1) {
  // Đường dẫn API lấy danh sách phim mới cập nhật theo số trang truyền vào
  const url = `${BASE_URL}/danh-sach/phim-moi-cap-nhat?page=${page}`;
  // Gọi hàm helper fetchGet để thực hiện request
  const data = await fetchGet(url);

  // Kiểm tra xem dữ liệu phản hồi có tồn tại và có chứa trường status không
  if (data && data.status) {
    const movies = data.items || [];
    // Lọc bỏ tất cả phim người lớn/18+ trước khi trả về UI
    const filteredMovies = movies.filter((m: any) => !isAdultMovie(m));

    return {
      // Trả về danh sách phim đã lọc sạch
      movies: filteredMovies,
      // Trả về đường dẫn CDN ảnh từ trường pathImage hoặc gán fallback mặc định
      pathImage: data.pathImage || 'https://img.ophim.live/uploads/movies/',
      // Trả về thông tin phân trang (tổng số bản ghi, số bản ghi trên trang, v.v.)
      pagination: data.pagination || null,
    };
  }
  // Trả về giá trị mặc định nếu gọi API không thành công
  return { movies: [], pathImage: '', pagination: null };
}

// =========================================================================
// 2. CHI TIẾT BỘ PHIM & TẬP PHIM (Có link stream m3u8)
// =========================================================================

/**
 * Lấy thông tin chi tiết một bộ phim và các tập phim của nó dựa trên slug
 * Endpoint: https://ophim1.com/phim/{slug}
 * @param slug Chiêu định danh duy nhất của phim (ví dụ: 'one-piece')
 */
export async function getMovieDetails(slug: string) {
  // Ghép đường dẫn API lấy chi tiết phim dựa vào slug phim tương ứng
  const url = `${BASE_URL}/phim/${slug}`;
  // Thực hiện request GET tới API OPhim bằng helper fetchGet
  const data = await fetchGet(url);

  // Nếu dữ liệu hợp lệ và API trả về trạng thái thành công
  if (data && data.status) {
    // Kiểm tra bảo vệ nếu bộ phim này thuộc thể loại phim người lớn/18+
    if (isAdultMovie(data.movie)) {
      console.warn(`Đã chặn truy cập chi tiết phim 18+ (slug: ${slug})`);
      // Trả về rỗng để chặn hiển thị ở trang chi tiết phim
      return { movie: null, episodes: [] };
    }

    return {
      // Trả về đối tượng movie chứa thông tin chi tiết (tên, mô tả, năm, đạo diễn, diễn viên, ảnh)
      movie: data.movie || null,         
      // Trả về mảng episodes chứa danh sách các tập phim, mỗi tập gồm tên tập và các link stream
      episodes: data.episodes || [],     
    };
  }
  // Trả về cấu trúc mặc định rỗng nếu phim không tồn tại hoặc lỗi
  return { movie: null, episodes: [] };
}

// =========================================================================
// 3. TÌM KIẾM PHIM (Theo từ khóa)
// =========================================================================

/**
 * Tìm kiếm phim theo từ khóa nhập vào từ ô tìm kiếm
 * Endpoint: https://ophim1.com/v1/api/tim-kiem?keyword={encodedKeyword}&limit={limit}
 * @param keyword Từ khóa tìm kiếm nhập từ client
 * @param limit Số lượng kết quả giới hạn trả về tối đa, mặc định là 30
 */
export async function searchMovies(keyword: string, limit: number = 30) {
  // Mã hóa từ khóa sang định dạng URI để đảm bảo không bị lỗi ký tự đặc biệt hoặc tiếng Việt có dấu
  const encodedKeyword = encodeURIComponent(keyword);
  // Xây dựng đường dẫn API tìm kiếm phim kèm từ khóa mã hóa và giới hạn số lượng
  const url = `${API_V1_URL}/tim-kiem?keyword=${encodedKeyword}&limit=${limit}`;
  // Thực hiện gọi API
  const data = await fetchGet(url);

  // Kiểm tra nếu API trả về kết quả thành công
  if (data && data.status === 'success') {
    const movies = data.data.items || [];
    // Lọc bỏ tất cả phim người lớn/18+ khỏi kết quả tìm kiếm của người dùng
    const filteredMovies = movies.filter((m: any) => !isAdultMovie(m));

    return {
      // Trả về danh sách kết quả phim tìm được sau khi đã lọc sạch
      movies: filteredMovies,
      // Domain CDN ảnh đi kèm trong data.APP_DOMAIN_CDN_IMAGE
      pathImage: data.data.APP_DOMAIN_CDN_IMAGE || 'https://img.ophim.live/uploads/movies/',
      // Thông tin phân trang tìm kiếm
      pagination: data.data.params.pagination || null,
    };
  }
  // Fallback mặc định khi tìm kiếm thất bại hoặc không có kết quả
  return { movies: [], pathImage: '', pagination: null };
}

// =========================================================================
// 4. DANH SÁCH THỂ LOẠI & QUỐC GIA
// =========================================================================

/**
 * Lấy danh sách tất cả các Thể loại phim hiện có trên hệ thống OPhim
 * Endpoint: https://ophim1.com/v1/api/the-loai
 */
export async function getGenresList() {
  // Xây dựng đường dẫn API thể loại phim
  const url = `${API_V1_URL}/the-loai`;
  // Thực hiện request GET
  const data = await fetchGet(url);
  const items = data && data.status === 'success' ? data.data.items || [] : [];
  
  // Lọc bỏ hoàn toàn thể loại "Phim 18+" ra khỏi danh sách thể loại hiển thị trên ứng dụng
  return items.filter((genre: any) => genre.slug !== 'phim-18' && genre.name !== 'Phim 18+');
}

/**
 * Lấy danh sách tất cả các Quốc gia phim hiện có trên hệ thống OPhim
 * Endpoint: https://ophim1.com/v1/api/quoc-gia
 */
export async function getCountriesList() {
  // Xây dựng đường dẫn API quốc gia
  const url = `${API_V1_URL}/quoc-gia`;
  // Thực hiện request GET
  const data = await fetchGet(url);
  // Trả về mảng danh sách quốc gia (items) nếu thành công, ngược lại trả về mảng rỗng
  return data && data.status === 'success' ? data.data.items || [] : [];
}

// =========================================================================
// 5. LỌC PHIM (Theo loại phim, thể loại, hoặc quốc gia)
// =========================================================================

/**
 * Lọc phim theo loại danh sách (phim-bo, phim-le, hoat-hinh, tv-shows)
 * Endpoint: https://ophim1.com/v1/api/danh-sach/{type}?page={page}
 * @param type Loại phim cần lọc
 * @param page Số trang cần lấy
 */
export async function getMoviesByType(type: 'phim-bo' | 'phim-le' | 'hoat-hinh' | 'tv-shows', page: number = 1) {
  // Xây dựng đường dẫn API lọc phim theo loại danh mục cụ thể và số trang
  const url = `${API_V1_URL}/danh-sach/${type}?page=${page}`;
  // Thực hiện gọi API
  const data = await fetchGet(url);

  // Kiểm tra kết quả phản hồi của API
  if (data && data.status === 'success') {
    const movies = data.data.items || [];
    // Lọc bỏ tất cả phim người lớn/18+
    const filteredMovies = movies.filter((m: any) => !isAdultMovie(m));

    return {
      // Trả về mảng danh sách phim
      movies: filteredMovies,
      // CDN ảnh đi kèm
      pathImage: data.data.APP_DOMAIN_CDN_IMAGE || 'https://img.ophim.live/uploads/movies/',
      // Phân trang
      pagination: data.data.params.pagination || null,
    };
  }
  // Trả về giá trị mặc định nếu lọc thất bại
  return { movies: [], pathImage: '', pagination: null };
}

/**
 * Lọc phim theo thể loại dựa vào slug của thể loại đó
 * Endpoint: https://ophim1.com/v1/api/the-loai/{genreSlug}?page={page}
 * @param genreSlug Slug định danh thể loại (ví dụ: 'hanh-dong')
 * @param page Số trang cần lấy
 */
export async function getMoviesByGenre(genreSlug: string, page: number = 1) {
  // Chặn tuyệt đối nếu người dùng cố ý gọi API thể loại phim-18
  if (genreSlug === 'phim-18') {
    return { movies: [], pathImage: '', pagination: null };
  }

  // Xây dựng đường dẫn API lọc phim theo slug thể loại và phân trang
  const url = `${API_V1_URL}/the-loai/${genreSlug}?page=${page}`;
  // Gọi API thông qua helper fetchGet
  const data = await fetchGet(url);

  // Xử lý dữ liệu trả về nếu thành công
  if (data && data.status === 'success') {
    const movies = data.data.items || [];
    // Lọc sạch phim 18+ phòng trường hợp có phim dán nhãn sai hoặc sót
    const filteredMovies = movies.filter((m: any) => !isAdultMovie(m));

    return {
      // Danh sách phim thuộc thể loại này
      movies: filteredMovies,
      // Đường dẫn CDN hình ảnh
      pathImage: data.data.APP_DOMAIN_CDN_IMAGE || 'https://img.ophim.live/uploads/movies/',
      // Thông tin phân trang
      pagination: data.data.params.pagination || null,
    };
  }
  // Giá trị mặc định
  return { movies: [], pathImage: '', pagination: null };
}

/**
 * Lọc phim theo quốc gia dựa vào slug của quốc gia đó
 * Endpoint: https://ophim1.com/v1/api/quoc-gia/{countrySlug}?page={page}
 * @param countrySlug Slug định danh quốc gia (ví dụ: 'trung-quoc')
 * @param page Số trang cần lấy
 */
export async function getMoviesByCountry(countrySlug: string, page: number = 1) {
  // Xây dựng đường dẫn API lọc phim theo slug quốc gia và phân trang
  const url = `${API_V1_URL}/quoc-gia/${countrySlug}?page=${page}`;
  // Gọi API thông qua helper fetchGet
  const data = await fetchGet(url);

  // Xử lý kết quả trả về từ API
  if (data && data.status === 'success') {
    const movies = data.data.items || [];
    // Lọc sạch phim người lớn/18+
    const filteredMovies = movies.filter((m: any) => !isAdultMovie(m));

    return {
      // Mảng chứa các bộ phim thuộc quốc gia này
      movies: filteredMovies,
      // Đường dẫn CDN hình ảnh phim
      pathImage: data.data.APP_DOMAIN_CDN_IMAGE || 'https://img.ophim.live/uploads/movies/',
      // Thông tin phân trang đi kèm
      pagination: data.data.params.pagination || null,
    };
  }
  // Mặc định trả về rỗng nếu có lỗi xảy ra
  return { movies: [], pathImage: '', pagination: null };
}

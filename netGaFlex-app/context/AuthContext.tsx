import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// Import đối tượng cấu hình Supabase đã được khởi tạo để gọi các dịch vụ Auth và Database
import { supabase } from '../lib/supabase';
// Import dịch vụ cơ sở dữ liệu để lấy danh sách hồ sơ người dùng
import { getUserProfiles } from '../lib/dbServices';

// Định nghĩa Interface cấu trúc số liệu thống kê hoạt động của người dùng
export interface UserStats {
  watched: number;          // Số lượng phim người dùng đã xem hoàn thành hoặc đang xem
  watchlist: number;        // Số lượng phim có trong danh sách yêu thích
  avgRating: number;        // Điểm đánh giá trung bình của người dùng
  totalHoursWatched: number;// Tổng số giờ xem phim tích lũy
}

// Định nghĩa Interface cấu trúc hồ sơ chi tiết của người dùng
export interface UserProfile {
  id: string;               // Định danh duy nhất của hồ sơ (profile id từ bảng profiles)
  name: string;             // Tên hiển thị của hồ sơ
  email: string;            // Địa chỉ email của tài khoản
  initials: string;         // Hai chữ cái viết tắt đại diện cho tên (dùng làm avatar chữ)
  avatarUrl: string | null; // Đường dẫn ảnh đại diện (avatar) của hồ sơ
  memberType: string;       // Gói thành viên (Premium, Standard, Free)
  joinYear: number;         // Năm tham gia ứng dụng
  stats: UserStats;         // Thống kê tương tác của người dùng
  preferredGenres: string[];// Các thể loại phim yêu thích
  subtitleLanguage: string; // Ngôn ngữ phụ đề mặc định chọn lựa
  notificationsEnabled: boolean; // Cài đặt bật/tắt nhận thông báo từ ứng dụng
}

// Định nghĩa Interface cho kiểu dữ liệu mà AuthContext cung cấp cho toàn bộ cây component
interface AuthContextType {
  isLoggedIn: boolean;      // Trạng thái đã đăng nhập hay chưa (true/false)
  user: UserProfile | null; // Hồ sơ người dùng hiện tại, null nếu chưa đăng nhập
  activeProfile: any | null;// Bản ghi profile Supabase đang hoạt động
  loading: boolean;         // Trạng thái đang tải phiên làm việc ban đầu
  hasOnboarded: boolean;    // Trạng thái đã xem qua hướng dẫn onboarding hay chưa
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>; // Hàm đăng nhập tài khoản
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>; // Hàm đăng ký tài khoản mới
  logout: () => Promise<void>; // Hàm đăng xuất tài khoản
  setOnboarded: () => void; // Hàm đánh dấu người dùng đã hoàn thành onboarding
  refreshUserProfile: () => Promise<void>; // Hàm tải lại thông tin hồ sơ để đồng bộ dữ liệu mới nhất
}

// Khởi tạo AuthContext với giá trị mặc định ban đầu là null
const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Hàm trợ giúp sinh các chữ cái viết tắt từ Tên đầy đủ của người dùng
 * Ví dụ: "Nguyen Van A" -> "NA", "Alex" -> "AL"
 */
function getInitials(name: string): string {
  // Nếu tên bị rỗng hoặc không hợp lệ, trả về chữ cái mặc định 'U' (User)
  if (!name) return 'U';
  // Tách tên thành mảng các từ dựa vào khoảng trắng
  const parts = name.split(' ');
  // Nếu tên gồm từ 2 từ trở lên
  if (parts.length >= 2) {
    // Ghép chữ cái đầu của từ đầu tiên và chữ cái đầu của từ thứ hai, viết hoa lên
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  // Nếu chỉ có 1 từ duy nhất, lấy 2 chữ cái đầu tiên và viết hoa
  return name.slice(0, 2).toUpperCase();
}

// Nhà cung cấp AuthProvider bao bọc toàn bộ ứng dụng để phân phối Auth State
export function AuthProvider({ children }: { children: ReactNode }) {
  // State lưu session thô nhận được từ Supabase Auth
  const [session, setSession] = useState<any>(null);
  // State lưu bản ghi hồ sơ đang chọn từ bảng public.profiles trong DB
  const [activeProfile, setActiveProfile] = useState<any>(null);
  // State lưu thông tin UserProfile đã qua xử lý chuẩn hóa để hiển thị lên UI
  const [user, setUser] = useState<UserProfile | null>(null);
  // State kiểm soát màn hình chờ tải thông tin đăng nhập lúc khởi chạy ứng dụng
  const [loading, setLoading] = useState(true);
  // State lưu trạng thái đã trải qua Onboarding chưa (có thể lưu cục bộ trên thiết bị)
  const [hasOnboarded, setHasOnboarded] = useState(false);

  /**
   * Hàm đồng bộ phiên làm việc (session) và truy vấn dữ liệu hồ sơ (profile) tương ứng từ database
   */
  const syncSession = async (currentSession: any) => {
    // Lưu session thô nhận được vào state
    setSession(currentSession);
    
    // Nếu phiên đăng nhập hiện tại tồn tại và có thông tin user hợp lệ
    if (currentSession?.user) {
      try {
        // Thực hiện truy vấn danh sách các profile liên kết với user_id này từ bảng profiles của Supabase
        const { data: profiles, error } = await getUserProfiles(currentSession.user.id);
        
        // Nếu tìm thấy danh sách hồ sơ và danh sách này không rỗng
        if (profiles && profiles.length > 0) {
          // Lấy hồ sơ đầu tiên làm hồ sơ hoạt động mặc định
          const profile = profiles[0];
          setActiveProfile(profile);

          // Truy vấn tổng số lượng phim yêu thích từ bảng favorites thuộc về profile này
          const { count: watchlistCount } = await supabase
            .from('favorites')
            .select('*', { count: 'exact', head: true }) // Chỉ lấy số lượng count, không lấy dữ liệu thô để tối ưu tốc độ
            .eq('profile_id', profile.id);

          // Truy vấn tổng số phim đã lưu lịch sử xem từ bảng watch_history thuộc về profile này
          const { count: watchedCount } = await supabase
            .from('watch_history')
            .select('*', { count: 'exact', head: true })
            .eq('profile_id', profile.id);

          // Ưu tiên lấy tên từ bảng profile, nếu không có lấy từ metadata social login, cuối cùng dùng fallback 'User'
          const name = profile.name || currentSession.user.user_metadata?.full_name || 'User';
          
          // Tạo đối tượng hồ sơ người dùng đã chuẩn hóa đầy đủ thông tin để lưu vào state user
          setUser({
            id: profile.id, // ID của profile
            name, // Tên hiển thị
            email: currentSession.user.email || '', // Email đăng ký tài khoản
            initials: getInitials(name), // Chữ viết tắt đại diện
            avatarUrl: profile.avatar_url, // Link ảnh đại diện
            memberType: 'Premium Member', // Loại gói dịch vụ (giả lập mặc định)
            joinYear: new Date(currentSession.user.created_at).getFullYear() || 2026, // Năm đăng ký tài khoản
            stats: {
              watched: watchedCount || 0, // Số tập/phim đã xem
              watchlist: watchlistCount || 0, // Số phim yêu thích
              avgRating: 4.5, // Điểm đánh giá trung bình giả lập
              totalHoursWatched: Math.round((watchedCount || 0) * 1.8), // Tính tổng thời gian xem phim giả lập (1.8h mỗi phim)
            },
            preferredGenres: ['Action', 'Sci-Fi', 'Thriller', 'Comedy'], // Thể loại yêu thích giả lập
            subtitleLanguage: 'English', // Ngôn ngữ phụ đề
            notificationsEnabled: true, // Bật thông báo
          });
        } else {
          // Nếu không tìm thấy profile, có thể do hàm trigger SQL `handle_new_user` đang chạy ngầm chưa chèn kịp
          // Tiến hành hẹn giờ chạy lại hàm syncSession sau 1.5 giây để thử lấy lại dữ liệu
          setTimeout(async () => {
            const { data: retryProfiles } = await getUserProfiles(currentSession.user.id);
            if (retryProfiles && retryProfiles.length > 0) {
              syncSession(currentSession);
            }
          }, 1500);
        }
      } catch (err) {
        // Ghi lại lỗi ra log nếu có sự cố khi truy vấn hoặc đồng bộ
        console.error('Lỗi khi tải profile từ Supabase:', err);
      }
    } else {
      // Nếu session không tồn tại (đã logout hoặc token hết hạn), xóa sạch các trạng thái cục bộ
      setActiveProfile(null);
      setUser(null);
    }
  };

  // Hiệu ứng useEffect chạy một lần duy nhất khi khởi động ứng dụng
  useEffect(() => {
    // 1. Thực hiện lấy session hiện tại đang lưu trong bộ nhớ máy (nếu có) khi vừa mở app
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      // Đồng bộ thông tin session và sau đó tắt trạng thái loading của Splash Screen
      syncSession(initialSession).finally(() => setLoading(false));
    });

    // 2. Đăng ký lắng nghe sự thay đổi trạng thái Auth của Supabase (ví dụ: đăng nhập, đăng xuất, gia hạn token)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setLoading(true); // Bật trạng thái loading khi đang đồng bộ phiên mới
      await syncSession(newSession); // Đồng bộ lại dữ liệu phiên làm việc mới
      setLoading(false); // Hoàn thành đồng bộ, tắt loading
    });

    // Hủy đăng ký lắng nghe sự kiện Auth khi AuthProvider bị unmount để tránh rò rỉ bộ nhớ
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Hàm đăng nhập tài khoản bằng email và mật khẩu sử dụng Supabase Auth
   */
  const login = async (email: string, password: string) => {
    try {
      // Gọi API đăng nhập của Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      // Nếu có lỗi trả về từ Supabase (ví dụ sai mật khẩu, tài khoản không tồn tại)
      if (error) {
        return { success: false, error: error.message };
      }
      // Đăng nhập thành công
      return { success: true };
    } catch (err: any) {
      // Bắt lỗi hệ thống hoặc lỗi kết nối mạng đột ngột
      return { success: false, error: err.message || 'Lỗi đăng nhập' };
    }
  };

  /**
   * Hàm đăng ký tài khoản mới bằng email, mật khẩu và truyền thêm Tên đầy đủ
   */
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      // Gọi API đăng ký tài khoản của Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Lưu thêm các thông tin siêu dữ liệu (metadata) của người dùng (tên đầy đủ)
          data: {
            full_name: fullName,
          },
        },
      });
      // Nếu có lỗi đăng ký từ Supabase (ví dụ định dạng email sai, mật khẩu quá ngắn, trùng email)
      if (error) {
        return { success: false, error: error.message };
      }
      // Đăng ký thành công
      return { success: true };
    } catch (err: any) {
      // Bắt lỗi ngoại lệ khác
      return { success: false, error: err.message || 'Lỗi đăng ký' };
    }
  };

  /**
   * Hàm đăng xuất tài khoản hiện tại ra khỏi hệ thống
   */
  const logout = async () => {
    // Gọi lệnh signOut của Supabase Auth để hủy phiên trên máy chủ và xóa token cục bộ
    await supabase.auth.signOut();
  };

  /**
   * Hàm đánh dấu người dùng đã đọc và bỏ qua màn hình Onboarding hướng dẫn
   */
  const setOnboarded = () => setHasOnboarded(true);

  /**
   * Hàm tải lại thông tin User profile để cập nhật lại các chỉ số thống kê (sau khi xem xong phim hoặc thêm watchlist)
   */
  const refreshUserProfile = async () => {
    // Nếu đang có session hợp lệ
    if (session) {
      // Thực hiện đồng bộ lại session hiện tại để lấy dữ liệu mới từ Database
      await syncSession(session);
    }
  };

  return (
    // Cung cấp các giá trị trạng thái và hàm thao tác Auth xuống cho các component con bên dưới sử dụng
    <AuthContext.Provider
      value={{
        isLoggedIn: !!user, // Chuyển đổi đối tượng user sang kiểu boolean (true nếu user khác null)
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

/**
 * Custom Hook useAuth giúp các component con dễ dàng truy cập nhanh các thông tin Auth của ứng dụng
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  // Nếu gọi hook bên ngoài AuthProvider, ném lỗi cảnh báo nhà phát triển cấu hình sai cấu trúc
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};

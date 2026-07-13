import React, { useState, useEffect, useRef } from 'react';
// Import các component cơ bản và Platform (phân biệt nền tảng chạy app) từ React Native
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
// Import hooks useLocalSearchParams và useRouter để đọc tham số URL và điều hướng trang
import { useLocalSearchParams, useRouter } from 'expo-router';
// Import component vẽ nền chuyển màu gradient
import { LinearGradient } from 'expo-linear-gradient';
// Import thư viện quản lý hướng xoay màn hình (Landscape/Portrait) trên thiết bị di động
import * as ScreenOrientation from 'expo-screen-orientation';
// Import StatusBar để điều khiển hiển thị ẩn/hiện thanh thông báo hệ thống
import { StatusBar } from 'expo-status-bar';
// Import WebView để hiển thị iframe/embed trình phát video từ API ngoài
import { WebView } from 'react-native-webview';
// Import cấu hình theme màu và typography
import Theme from '../../../constants/Theme';
// Import hàm helper lấy dữ liệu phim giả lập
import { getMovieById } from '../../../data/mockMovies';
// Import hook useApp để lưu và tải lịch sử xem phim đồng bộ với database
import { useApp } from '../../../context/AppContext';

export default function VideoPlayerScreen() {
  // Trích xuất các tham số từ URL route: id phim, link stream, tên tập phim, tên bộ phim
  const { id, link, episodeName, movieName } = useLocalSearchParams<{
    id: string;
    link?: string;
    episodeName?: string;
    movieName?: string;
  }>();
  // Khởi tạo router điều hướng chuyển màn hình
  const router = useRouter();
  // Lấy danh sách lịch sử xem và hàm addToHistory để đồng bộ tiến độ lên database từ AppContext
  const { watchHistory, addToHistory } = useApp();

  // Khởi tạo thông tin bộ phim thô từ danh sách mock hoặc fallback mặc định nếu rỗng
  const movie = getMovieById(id || '') || {
    id: id || 'movie',
    title: movieName || 'Movie',
    durationMin: 120, // Thời lượng mặc định 120 phút
    type: 'movie',
  };

  // Tính tổng số giây của bộ phim để làm mốc tính tỉ lệ phần trăm progress
  const totalSeconds = (movie.durationMin || 120) * 60;

  // Khởi tạo tiến độ phát video: Tìm bản ghi lịch sử xem phim này từ Supabase watchHistory (nếu có)
  const savedItem = watchHistory.find((h: any) => h.movieId === (id || movie.id));
  // Nếu có lịch sử, tính số giây tương ứng đã xem (tỉ lệ phần trăm nhân tổng số giây), ngược lại bắt đầu từ 0
  const savedSeconds = savedItem ? Math.floor(savedItem.progress * totalSeconds) : 0;

  // State lưu thời gian xem hiện tại (giây), mặc định lấy vị trí cũ hoặc 5% thời lượng nếu bắt đầu mới
  const [currentTime, setCurrentTime] = useState(savedSeconds || Math.floor(totalSeconds * 0.05));
  // Cờ báo hiệu phim đang phát
  const isPlaying = true; 

  // Hiệu ứng useEffect 1: Tự động chạy tiến trình thời gian xem ảo tăng dần mỗi 1 giây
  useEffect(() => {
    // Thiết lập bộ đếm thời gian lặp lại mỗi 1 giây (1000ms)
    const interval = setInterval(() => {
      setCurrentTime(t => {
        // Nếu thời gian xem đạt tới giới hạn tổng số giây của phim (Xem hết phim)
        if (t >= totalSeconds) {
          // Xóa bộ đếm thời gian
          clearInterval(interval);
          // Điều hướng chuyển thẳng sang màn hình đếm ngược chuyển tập tiếp theo
          router.replace(`/movie/${movie.id}/next`);
          // Trả về thời gian tối đa
          return t;
        }
        // Tăng thời gian đã xem lên 1 giây
        return t + 1;
      });
    }, 1000);
    // Dọn dẹp Interval khi đóng màn hình phát
    return () => clearInterval(interval);
  }, [totalSeconds, movie.id]);

  // Hiệu ứng useEffect 2: Định kỳ đồng bộ tiến độ xem phim lên Supabase (mỗi 10 giây một lần)
  useEffect(() => {
    // Hẹn giờ chạy lưu tiến độ xem
    const saveInterval = setInterval(() => {
      // Gọi hàm đồng bộ lưu vào Supabase thông qua AppContext
      addToHistory(
        id || movie.id, // ID/slug phim
        movieName || movie.title, // Tên phim
        episodeName || 'Full', // Tên tập
        currentTime, // Số giây đã xem hiện tại
        totalSeconds // Tổng số giây phim
      );
    }, 10000); // 10 giây mỗi chu kỳ

    // Dọn dẹp bộ đếm lặp lại khi đóng trình phát
    return () => clearInterval(saveInterval);
  }, [currentTime, id, movieName, movie.id, movie.title, episodeName, totalSeconds]);

  // Hiệu ứng useEffect 3: Sử dụng ref để luôn lưu giữ thời gian xem mới nhất của currentTime
  const lastTimeRef = useRef(currentTime);
  useEffect(() => {
    lastTimeRef.current = currentTime;
  }, [currentTime]);

  // Hiệu ứng useEffect 4: Tự động lưu tiến độ xem phim vào Supabase một lần cuối cùng khi người dùng đóng trình phát (unmount screen)
  useEffect(() => {
    // Trả về hàm dọn dẹp chạy khi screen unmount
    return () => {
      addToHistory(
        id || movie.id,
        movieName || movie.title,
        episodeName || 'Full',
        lastTimeRef.current, // Lấy giá trị thời gian xem mới nhất từ ref
        totalSeconds
      );
    };
  }, [id, movieName, movie.id, movie.title, episodeName, totalSeconds]);

  // Hiệu ứng useEffect 5: Tự động xoay ngang màn hình (Landscape) khi mở trình phát, và trả về xoay dọc (Portrait) khi đóng trình phát
  useEffect(() => {
    // Hàm khóa hướng xoay ngang
    async function lockOrientation() {
      try {
        // Gọi thư viện lock hướng xoay ngang (LANDSCAPE) cho thiết bị di động
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      } catch (error) {
        console.warn('Could not lock screen orientation:', error);
      }
    }
    // Thực thi khóa hướng xoay ngang lúc mount
    lockOrientation();
    
    // Trả về hàm dọn dẹp khôi phục lại hướng xoay dọc (PORTRAIT) lúc unmount screen
    return () => {
      async function restoreOrientation() {
        try {
          // Khóa hướng xoay dọc thẳng đứng (PORTRAIT_UP)
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        } catch (error) {
          console.warn('Could not restore screen orientation:', error);
        }
      }
      restoreOrientation();
    };
  }, []);

  // Kiểm tra xem link stream truyền vào có phải là đường dẫn URL hợp lệ hay không
  const isValidUrl = link && (link.startsWith('http://') || link.startsWith('https://'));

  return (
    <View style={styles.outerContainer}>
      {/* Ẩn thanh Status Bar (thanh pin, sóng điện thoại) để hiển thị video tràn màn hình hoàn toàn */}
      <StatusBar hidden={true} />

      {/* Vùng chứa trình phát video chính */}
      <View style={StyleSheet.absoluteFill}>
        {isValidUrl ? (
          // Phân biệt giao diện Web và App di động
          Platform.OS === 'web' ? (
            // Nếu chạy trên Web, render thẻ iframe HTML tiêu chuẩn để nhúng link phát video của OPhim
            <iframe
              src={link}
              style={{ width: '100%', height: '100%', border: 0 }}
              allowFullScreen // Cho phép xem chế độ toàn màn hình
              allow="autoplay; encrypted-media" // Cho phép tự động phát phim
            />
          ) : (
            // Nếu chạy trên điện thoại di động, sử dụng WebView để tải link phát phim
            <WebView
              source={{ uri: link }}
              style={{ flex: 1, backgroundColor: '#000' }}
              javaScriptEnabled={true} // Kích hoạt JavaScript trong WebView
              domStorageEnabled={true} // Bật lưu trữ DOM
              allowsFullscreenVideo={true} // Cho phép phát video toàn màn hình
              mediaPlaybackRequiresUserAction={false} // Tự động phát không cần chạm
            />
          )
        ) : (
          // Giao diện hiển thị lỗi nếu link stream không khả dụng hoặc bị hỏng
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Nguồn phát phim này hiện chưa khả dụng. Vui lòng quay lại chọn tập khác hoặc phim khác!</Text>
          </View>
        )}
      </View>

      {/* Lớp giao diện HUD điều khiển phía trên (Nút Back và Tên phim) */}
      <View style={styles.topOverlayContainer} pointerEvents="box-none">
        {/* Dải gradient đen mờ chuyển sắc từ trên đỉnh xuống giúp nhìn rõ chữ */}
        <LinearGradient
          colors={['rgba(0,0,0,0.85)', 'transparent']}
          style={styles.topOverlayGradient}
          pointerEvents="box-none"
        >
          {/* Nút quay lại màn hình trước dạng viên thuốc nửa trong suốt */}
          <TouchableOpacity
            onPress={() => router.back()} // Quay lại trang trước khi nhấn
            style={styles.backButtonPill} // Lớp CSS nút Back
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          {/* Tên phim và tên tập phim đang phát hiển thị cạnh nút Back */}
          <Text style={styles.movieTitleLabel}>
            {movieName || movie.title} · {episodeName || 'Feature'}
          </Text>
        </LinearGradient>
      </View>
    </View>
  );
}

// Định nghĩa CSS StyleSheet cho trình phát Video Player
const styles = StyleSheet.create({
  outerContainer: {
    flex: 1, // Co giãn chiếm toàn màn hình
    backgroundColor: '#000', // Nền đen tuyệt đối
  },
  topOverlayContainer: {
    position: 'absolute', // Nổi tuyệt đối ở góc đỉnh đầu màn hình
    top: 0,
    left: 0,
    right: 0,
    height: 80, // Chiều cao vùng phủ bóng đen
    zIndex: 999, // Nằm trên cùng của WebView phát video
  },
  topOverlayGradient: {
    flex: 1, // Chiếm trọn vùng phủ
    flexDirection: 'row', // Sắp xếp nút Back và Tiêu đề phim hàng ngang
    alignItems: 'center', // Căn thẳng đứng giữa các phần tử
    paddingHorizontal: 24, // Khoảng đệm trái/phải 24px
    paddingTop: 12, // Khoảng cách đỉnh đầu
  },
  backButtonPill: {
    flexDirection: 'row', // Nút back xếp ngang chữ
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)', // Nền đen mờ trong suốt 65%
    paddingHorizontal: 16, // Khoảng đệm ngang viên thuốc
    paddingVertical: 8, // Khoảng đệm dọc viên thuốc
    borderRadius: 20, // Bo tròn tạo hình viên thuốc
    borderWidth: 1, // Viền mỏng bao quanh
    borderColor: 'rgba(255, 255, 255, 0.2)', // Viền trắng mờ
  },
  backButtonText: {
    color: '#fff', // Chữ màu trắng
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Theme.typography.fontFamily,
  },
  movieTitleLabel: {
    color: '#fff', // Tiêu đề phim chữ trắng sáng
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 16, // Khoảng cách cách nút Back 16px
    textShadowColor: 'rgba(0,0,0,0.8)', // Đổ bóng viền chữ màu đen đậm để dễ nhìn trên nền phim
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    fontFamily: Theme.typography.fontFamily,
  },
  errorContainer: {
    flex: 1, // Chiếm trọn WebView
    backgroundColor: '#050508', // Nền tối
    justifyContent: 'center', // Căn chữ báo lỗi chính giữa ngang
    alignItems: 'center', // Căn chữ báo lỗi chính giữa dọc
  },
  errorText: {
    color: '#fff', // Chữ màu trắng
    fontSize: 16,
    fontFamily: Theme.typography.fontFamily,
  },
});

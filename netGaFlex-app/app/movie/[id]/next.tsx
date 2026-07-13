import React, { useState, useEffect } from 'react';
// Import các component cơ bản và Dimensions (đo kích cỡ màn hình), Platform (phân biệt Web/iOS/Android) từ React Native
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
// Import hooks useLocalSearchParams và useRouter để đọc tham số route và thực hiện điều hướng chuyển trang
import { useLocalSearchParams, useRouter } from 'expo-router';
// Import component LinearGradient để tạo dải màu nền chuyển sắc sống động
import { LinearGradient } from 'expo-linear-gradient';
// Import theme thiết kế chung của hệ thống chứa mã màu và định dạng typography
import Theme from '../../../constants/Theme';
// Import các hàm helper và danh sách dữ liệu phim giả lập
import { getMovieById, mockMovies } from '../../../data/mockMovies';

export default function NextEpisodeScreen() {
  // Đọc tham số id của bộ phim hiện tại truyền từ URL route (ví dụ: /movie/inception/next)
  const { id } = useLocalSearchParams<{ id: string }>();
  // Khởi tạo đối tượng router điều hướng chuyển màn hình
  const router = useRouter();
  // Lấy chi tiết bộ phim từ DB/mock theo ID, nếu không tìm thấy gán bộ phim đầu tiên làm fallback
  const movie = getMovieById(id || '') || mockMovies[0];
  // Khởi tạo state đếm ngược bắt đầu từ 5 giây
  const [countdown, setCountdown] = useState(5);

  // Hiệu ứng chạy khi màn hình được mount để tự động đếm ngược
  useEffect(() => {
    // Thiết lập bộ đếm thời gian chạy lặp lại mỗi 1 giây (1000ms)
    const interval = setInterval(() => {
      // Cập nhật giá trị đếm ngược dựa vào giá trị đếm ngược trước đó (c)
      setCountdown(c => {
        // Nếu bộ đếm ngược đã chạm mốc 1 giây (hoặc nhỏ hơn)
        if (c <= 1) {
          // Xóa bộ đếm lặp lại để giải phóng tài nguyên
          clearInterval(interval);
          // Tự động chuyển hướng thay thế màn hình sang trình phát video của phim này
          router.replace(`/movie/${movie.id}/play`);
          // Trả về 0 giây
          return 0;
        }
        // Giảm chỉ số đếm ngược đi 1 giây
        return c - 1;
      });
    }, 1000);
    // Hủy bỏ Interval khi component bị hủy để tránh tiếp tục chạy nền hoặc chuyển hướng sai lệch
    return () => clearInterval(interval);
  }, [router, movie.id]); // Theo dõi sự thay đổi của router và id phim

  // Lấy chiều rộng và chiều cao hiện tại của màn hình thiết bị
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  
  // Thiết kế giao diện hiển thị ngang (Landscape Mode) khi xem phim trên ứng dụng di động:
  // Nếu là môi trường Web thì để trống (cho phép hiển thị Responsive), nếu là App di động (iOS/Android) 
  // thì áp dụng xoay container đi 90 độ để ép màn hình hiển thị ngang mặc dù hướng thiết bị vẫn thẳng đứng.
  const rotationStyle = Platform.OS === 'web' ? {} : {
    width: screenHeight, // Chiều rộng mới bằng chiều cao thực của thiết bị
    height: screenWidth, // Chiều cao mới bằng chiều rộng thực của thiết bị
    transform: [{ rotate: '90deg' }], // Xoay khung hình 90 độ
  };

  return (
    // Container ngoài cùng màu đen tuyền bao phủ toàn màn hình
    <View style={styles.outerContainer}>
      {/* Khung nội dung chính, áp dụng thêm thuộc tính xoay ngang nếu chạy trên di động */}
      <View style={[styles.container, rotationStyle]}>
        {/* Lớp nền gradient ba dải màu tối từ góc trên xuống góc dưới tạo độ sâu */}
        <LinearGradient
          colors={['#0a0a0f', '#1a1a2e', '#0d0d1a']}
          style={StyleSheet.absoluteFill}
        />
        {/* Lớp phủ mờ màu tối giúp tập trung sự chú ý vào thẻ thông tin chuyển tập */}
        <View style={styles.dimOverlay} />

        {/* Nút quay lại (Back) hiển thị ở góc trên trái */}
        <TouchableOpacity
          onPress={() => router.back()} // Quay lại trang trước đó khi nhấn
          style={styles.backBtn} // Áp dụng style vị trí
          activeOpacity={0.7} // Tạo phản hồi mờ nhẹ khi chạm
        >
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>

        {/* Nhãn văn bản chính ở trung tâm màn hình: "Tiếp theo" */}
        <View style={styles.centerLabel}>
          <Text style={styles.nextText}>Next Up</Text>
        </View>

        {/* Thẻ hiển thị thông tin tập phim tiếp theo ở góc dưới bên phải màn hình */}
        <View style={[styles.nextCard, Theme.glows.card]}>
          {/* Thumbnail giả lập của tập phim tiếp theo */}
          <View style={styles.thumb} />
          
          {/* Vùng thông tin văn bản */}
          <View style={styles.info}>
            {/* Nhãn thẻ phụ: TẬP TIẾP THEO */}
            <Text style={styles.nextTag}>NEXT EPISODE</Text>
            {/* Tên chương, tập phim (giả lập) */}
            <Text style={styles.title} numberOfLines={1}>S1 E4 — The Body</Text>
            {/* Chữ hiển thị số giây đang đếm ngược */}
            <Text style={styles.countdownText}>Starting in {countdown}s</Text>
          </View>

          {/* Vòng tròn hiển thị số giây đếm ngược ở bên phải thẻ */}
          <View style={styles.countdownCircle}>
            <Text style={styles.countdownNumber}>{countdown}</Text>
          </View>
        </View>

        {/* Nút Hủy (Cancel) chuyển tập tự động */}
        <TouchableOpacity
          onPress={() => router.back()} // Quay lại trang trước để hủy chuyển tập tự động
          style={styles.cancelBtn} // Định vị nút cancel
          activeOpacity={0.7}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Định nghĩa CSS StyleSheet cho màn hình đếm ngược chuyển tập
const styles = StyleSheet.create({
  outerContainer: {
    flex: 1, // Kéo dãn chiếm toàn bộ kích cỡ màn hình
    backgroundColor: '#000', // Nền đen tuyệt đối
    alignItems: 'center', // Căn giữa nội dung bên trong theo chiều ngang
    justifyContent: 'center', // Căn giữa nội dung bên trong theo chiều dọc
  },
  container: {
    width: '100%', // Chiều rộng 100%
    height: '100%', // Chiều cao 100%
    position: 'relative', // Sử dụng định vị tương đối để các nút con dùng absolute
    overflow: 'hidden', // Ẩn các phần tử tràn ra ngoài khung
  },
  dimOverlay: {
    position: 'absolute', // Phủ tuyệt đối trên nền gradient
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(8,8,14,0.7)', // Màu đen che phủ mờ với độ trong suốt 70%
  },
  backBtn: {
    position: 'absolute', // Nút back nổi cố định
    top: 16, // Cách mép trên 16 đơn vị
    left: 16, // Cách mép trái 16 đơn vị
    zIndex: 12, // Đảm bảo luôn nằm trên cùng của các lớp giao diện
  },
  backBtnText: {
    color: Theme.colors.textPrimary, // Chữ màu trắng
    fontSize: 14, // Cỡ chữ vừa phải
    fontWeight: '600', // Đậm nét chữ
    fontFamily: Theme.typography.fontFamily, // Phông chữ chung
  },
  centerLabel: {
    position: 'absolute', // Nhãn căn giữa nổi
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center', // Căn giữa ngang
    justifyContent: 'center', // Căn giữa dọc
  },
  nextText: {
    color: Theme.colors.textPrimary, // Văn bản màu trắng
    fontSize: 28, // Cỡ chữ lớn 28
    fontWeight: '600', // Chữ in đậm nét
    textShadowColor: 'rgba(0,0,0,0.8)', // Bóng đổ chữ màu đen đậm
    textShadowOffset: { width: 0, height: 2 }, // Đổ bóng lệch xuống dưới 2px
    textShadowRadius: 16, // Độ nhòe bóng đổ rộng
    fontFamily: Theme.typography.fontFamily, // Phông chữ chung
  },
  nextCard: {
    position: 'absolute', // Thẻ phim nổi ở góc dưới
    bottom: 32, // Cách mép dưới 32px
    right: 24, // Cách mép phải 24px
    backgroundColor: Theme.colors.surfaceElevated, // Màu nền tối nâng tông nổi bật
    borderRadius: Theme.roundness.card, // Bo góc thẻ theo chuẩn chung
    width: 220, // Chiều rộng cố định của thẻ chuyển tập
    padding: 12, // Khoảng đệm bên trong thẻ
    flexDirection: 'row', // Xếp thumbnail, thông tin và vòng đếm theo hàng ngang
    gap: 12, // Khoảng cách giữa các phần tử
    alignItems: 'center', // Căn giữa các phần tử dọc theo thẻ
    zIndex: 10,
    borderWidth: 1, // Đường viền mỏng bao quanh thẻ
    borderColor: 'rgba(255,255,255,0.08)', // Màu viền trắng mờ 8%
  },
  thumb: {
    width: 72, // Chiều rộng thumbnail ảnh tập tiếp theo
    height: 48, // Chiều cao thumbnail ảnh tập tiếp theo
    borderRadius: 8, // Bo góc ảnh
    backgroundColor: '#140820', // Màu nền ảnh xám/tím đậm
  },
  info: {
    flex: 1, // Phần thông tin chiếm toàn bộ khoảng trống còn lại
  },
  nextTag: {
    color: Theme.colors.primary, // Chữ màu đỏ đặc trưng
    fontSize: 8, // Cỡ chữ siêu nhỏ
    fontWeight: '700', // Đậm nét chữ
    letterSpacing: 1, // Khoảng cách giữa các ký tự chữ rộng hơn
    marginBottom: 2, // Khoảng cách tới tên phim bên dưới
    fontFamily: Theme.typography.fontFamily, // Phông chữ chung
  },
  title: {
    color: Theme.colors.textPrimary, // Chữ màu trắng sáng
    fontSize: 11, // Cỡ chữ nhỏ 11
    fontWeight: '600', // Chữ in đậm vừa
    fontFamily: Theme.typography.fontFamily, // Phông chữ chung
  },
  countdownText: {
    color: Theme.colors.textSecondary, // Màu chữ mờ xám nhẹ
    fontSize: 10, // Cỡ chữ 10
    fontFamily: Theme.typography.fontFamily, // Phông chữ chung
  },
  countdownCircle: {
    width: 32, // Đường kính vòng tròn
    height: 32, // Đường kính vòng tròn
    borderRadius: 16, // Bo góc tròn hoàn hảo
    borderWidth: 2, // Độ dày vòng viền tròn
    borderColor: Theme.colors.primary, // Viền màu đỏ rực rỡ đặc trưng
    alignItems: 'center', // Căn số giây vào giữa vòng tròn ngang
    justifyContent: 'center', // Căn số giây vào giữa vòng tròn dọc
  },
  countdownNumber: {
    color: Theme.colors.textPrimary, // Số màu trắng sáng
    fontSize: 14, // Cỡ số 14
    fontWeight: '700', // Số in đậm nét
    fontFamily: Theme.typography.fontFamily, // Phông chữ chung
  },
  cancelBtn: {
    position: 'absolute', // Nút cancel nổi nhỏ bên dưới thẻ
    bottom: 8, // Cách mép dưới cùng 8px
    right: 24, // Cách mép phải 24px (thẳng hàng với thẻ bên trên)
    zIndex: 12,
    padding: 8, // Vùng nhấn đệm
  },
  cancelText: {
    color: Theme.colors.textTertiary, // Chữ màu xám mờ dạng nút tắt
    fontSize: 13, // Cỡ chữ nhỏ 13
    fontFamily: Theme.typography.fontFamily, // Phông chữ chung
  },
});

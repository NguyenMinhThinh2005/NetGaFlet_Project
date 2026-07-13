import React, { useEffect, useRef } from 'react';
// Import các thành phần giao diện cơ bản từ React Native
import { View, Text, StyleSheet, Animated } from 'react-native';
// Import hook useRouter từ expo-router để chuyển tiếp màn hình điều hướng
import { useRouter } from 'expo-router';
// Import hook useAuth để lấy thông tin trạng thái đăng nhập từ AuthContext
import { useAuth } from '../context/AuthContext';
// Import cấu hình theme màu sắc của toàn ứng dụng
import Theme from '../constants/Theme';

export default function SplashScreen() {
  // Lấy đối tượng điều hướng router
  const router = useRouter();
  // Lấy trạng thái đăng nhập và trạng thái hoàn thành giới thiệu (onboarding) từ AuthContext
  const { isLoggedIn, hasOnboarded } = useAuth();
  // Khởi tạo hoạt ảnh mờ dần (fade) với giá trị ban đầu là 0 (ẩn hoàn toàn)
  const fadeAnim = useRef(new Animated.Value(0)).current;
  // Khởi tạo hoạt ảnh xoay (spin) với giá trị xuất phát từ 0
  const spinAnim = useRef(new Animated.Value(0)).current;

  // Hiệu ứng chạy khi mount component để xử lý hoạt ảnh và tự động chuyển hướng màn hình
  useEffect(() => {
    // Chạy hoạt ảnh tăng độ hiển thị (opacity) của text từ 0 lên 1 trong 1000ms
    Animated.timing(fadeAnim, {
      toValue: 1, // Đích đến là hiển thị rõ hoàn toàn
      duration: 1000, // Thời gian chạy hoạt ảnh: 1 giây
      useNativeDriver: true, // Sử dụng Driver gốc của thiết bị để tối ưu hóa hiệu năng GPU
    }).start(); // Bắt đầu hoạt ảnh fade

    // Chạy hoạt ảnh lặp vô tận (loop) cho spinner xoay tròn
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1, // Xoay hết một vòng hoàn chỉnh
        duration: 1200, // Chu kỳ xoay 1 vòng: 1.2 giây
        useNativeDriver: true, // Tối ưu hiệu năng bằng Native Driver
      })
    ).start(); // Bắt đầu vòng lặp hoạt ảnh xoay

    // Thiết lập hẹn giờ tự động chuyển màn hình sau 2.5 giây (2500ms) để hiển thị thương hiệu
    const timer = setTimeout(() => {
      // Nhánh 1: Nếu người dùng đã đăng nhập thành công trước đó
      if (isLoggedIn) {
        // Thay thế (replace) màn hình hiện tại bằng trang chủ (Tabs), tránh quay lại màn hình chào
        router.replace('/(tabs)');
      } 
      // Nhánh 2: Nếu chưa đăng nhập nhưng đã trải qua phần giới thiệu (Onboarding)
      else if (hasOnboarded) {
        // Chuyển hướng người dùng thẳng tới màn hình Đăng nhập (SignIn)
        router.replace('/signin');
      } 
      // Nhánh 3: Trường hợp tải app lần đầu tiên chưa làm gì cả
      else {
        // Chuyển hướng người dùng tới màn hình giới thiệu các tính năng (Onboarding)
        router.replace('/onboarding');
      }
    }, 2500); // 2.5 giây là thời gian chờ tối ưu để trải nghiệm Splash

    // Dọn dẹp bộ hẹn giờ khi component bị hủy để tránh lỗi chuyển hướng sai trạng thái
    return () => clearTimeout(timer);
  }, [isLoggedIn, hasOnboarded]); // Theo dõi sự thay đổi trạng thái đăng nhập và onboarding

  // Nội suy giá trị spinAnim từ khoảng số học [0, 1] sang chuỗi xoay độ ['0deg', '360deg'] để CSS hiểu được
  const spin = spinAnim.interpolate({
    inputRange: [0, 1], // Giá trị đầu vào từ 0 đến 1
    outputRange: ['0deg', '360deg'], // Giá trị đầu ra tương ứng từ 0 đến 360 độ
  });

  return (
    <View style={styles.container}>
      {/* Lớp nền phát sáng đỏ mờ xung quanh tạo phong cách sang trọng, đậm chất rạp phim */}
      <View style={styles.radialBloom} />

      {/* Vùng chứa văn bản thương hiệu hỗ trợ hoạt ảnh mờ/rõ dần */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Tên ứng dụng NetGaFlet màu đỏ rực rỡ */}
        <Text style={styles.title}>NETGAFLET</Text>
        {/* Slogan định vị thương hiệu của app */}
        <Text style={styles.subhead}>Cinema, Elevated.</Text>

        {/* Chạy spinner xoay tròn sử dụng thuộc tính transform rotate liên kết với hoạt ảnh nội suy */}
        <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]} />
      </Animated.View>
    </View>
  );
}

// Định nghĩa CSS StyleSheet cho Splash Screen
const styles = StyleSheet.create({
  container: {
    flex: 1, // Chiếm toàn bộ không gian màn hình
    backgroundColor: Theme.colors.bgBase, // Màu nền đen tuyền
    alignItems: 'center', // Căn giữa tất cả phần tử theo chiều ngang
    justifyContent: 'center', // Căn giữa tất cả phần tử theo chiều dọc
  },
  radialBloom: {
    ...StyleSheet.absoluteFillObject, // Bao phủ tuyệt đối toàn màn hình
    backgroundColor: 'rgba(229,9,20,0.04)', // Lớp nền màu đỏ của hãng với opacity 4%
  },
  content: {
    alignItems: 'center', // Căn giữa các phần tử bên trong theo chiều ngang
    justifyContent: 'center', // Căn giữa các phần tử bên trong theo chiều dọc
  },
  title: {
    color: Theme.colors.primary, // Chữ màu đỏ của hãng
    fontSize: 36, // Kích thước chữ tiêu đề lớn
    fontWeight: '700', // Định dạng chữ in đậm nét
    letterSpacing: 6, // Tạo khoảng cách rộng giữa các ký tự chữ tạo vẻ hiện đại
    textTransform: 'uppercase', // Chuyển đổi toàn bộ sang chữ in hoa
    textShadowColor: 'rgba(229,9,20,0.4)', // Đổ bóng chữ màu đỏ phát sáng
    textShadowOffset: { width: 0, height: 0 }, // Tọa độ đổ bóng tại tâm chữ
    textShadowRadius: 40, // Độ nhòe bóng lớn để tạo hiệu ứng hào quang phát sáng (glow)
    fontFamily: Theme.typography.fontFamily, // Phông chữ hệ thống chung
  },
  subhead: {
    color: Theme.colors.textTertiary, // Màu chữ mờ xám nhẹ
    fontSize: 13, // Kích thước chữ slogan nhỏ nhắn
    fontStyle: 'italic', // Định dạng kiểu chữ nghiêng nghệ thuật
    marginTop: 8, // Khoảng cách so với tiêu đề chính bên trên
    fontFamily: Theme.typography.fontFamily, // Phông chữ hệ thống chung
  },
  spinner: {
    marginTop: 32, // Khoảng cách từ slogan đến spinner xoay
    width: 40, // Chiều rộng vòng xoay
    height: 40, // Chiều cao vòng xoay
    borderRadius: 20, // Bo góc tròn hoàn hảo
    borderWidth: 2, // Độ dày đường viền vòng tròn
    borderColor: 'transparent', // Đường viền gốc trong suốt
    borderTopColor: Theme.colors.primary, // Viền trên màu đỏ nổi bật
    borderRightColor: 'rgba(229,9,20,0.3)', // Viền phải màu đỏ mờ tạo vệt đuôi khi xoay
  },
});

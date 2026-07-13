import React, { useState } from 'react';
// Import các component cơ bản của React Native
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
// Import hook useRouter từ expo-router để thực hiện chuyển hướng màn hình
import { useRouter } from 'expo-router';
// Import cấu hình theme màu sắc chung của ứng dụng
import Theme from '../constants/Theme';
// Import component Input dạng nhãn nổi động khi focus (FloatingInput)
import FloatingInput from '../components/ui/FloatingInput';
// Import hook useAuth để sử dụng tính năng đăng ký tài khoản Supabase
import { useAuth } from '../context/AuthContext';
// Import các hàm helper tính toán độ mạnh mật khẩu hiển thị thanh đánh giá động
import { getPasswordStrength, strengthColor, strengthLabel } from '../utils/helpers';

export default function SignUpScreen() {
  // Lấy đối tượng router dùng để điều hướng trang
  const router = useRouter();
  // Trích xuất hàm đăng ký (signUp) từ AuthContext toàn cục
  const { signUp } = useAuth();
  // State quản lý họ và tên người dùng nhập vào
  const [name, setName] = useState('');
  // State quản lý email đăng ký
  const [email, setEmail] = useState('');
  // State quản lý mật khẩu người dùng nhập vào
  const [password, setPassword] = useState('');
  // State quản lý thông báo lỗi hiển thị cho người dùng nếu có trục trặc xảy ra
  const [error, setError] = useState('');
  // State quản lý trạng thái tải (loading) khi đang kết nối API đăng ký tài khoản của Supabase
  const [loading, setLoading] = useState(false);

  // Tính toán độ mạnh mật khẩu động thời gian thực (trả về điểm số từ 0 đến 3)
  const strength = getPasswordStrength(password);

  // Xử lý tạo tài khoản khi bấm nút Đăng ký
  const handleCreate = async () => {
    // 1. Kiểm tra xác thực phía client: Nếu bất kỳ ô nhập liệu nào bị rỗng
    if (!name || !email || !password) {
      // Thiết lập lỗi thông báo người dùng nhập đầy đủ thông tin
      setError('Please fill in all fields.');
      return;
    }
    
    // Bật cờ loading và xóa sạch thông báo lỗi cũ
    setLoading(true);
    setError('');

    // 2. Gọi hàm signUp từ AuthContext, truyền vào các giá trị: email, mật khẩu, và tên hiển thị
    const res = await signUp(email, password, name);

    // 3. Xử lý kết quả đăng ký trả về
    if (res.success) {
      // Đăng ký thành công, tự động chuyển người dùng tới trang chọn thể loại phim yêu thích (genre-setup)
      router.replace('/genre-setup');
    } else {
      // Đăng ký thất bại, hiển thị thông báo lỗi từ Supabase hoặc dùng lỗi mặc định
      setError(res.error || 'Failed to create account.');
      // Tắt trạng thái loading để cho phép người dùng sửa lại thông tin và thử lại
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Sử dụng ScrollView để tránh che khuất form khi bàn phím ảo đẩy giao diện lên */}
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Tiêu đề trang đăng ký */}
        <View style={styles.header}>
          <Text style={styles.logo}>NETGAFLET</Text>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the cinema elite.</Text>
        </View>

        {/* Khung chứa các trường nhập dữ liệu */}
        <View style={styles.form}>
          {/* Ô nhập họ và tên */}
          <FloatingInput label="Full Name" type="text" value={name} onChange={setName} />
          {/* Ô nhập địa chỉ email */}
          <FloatingInput label="Email Address" type="email" value={email} onChange={setEmail} />
          {/* Ô nhập mật khẩu bảo mật */}
          <FloatingInput label="Password" type="password" value={password} onChange={setPassword} />

          {/* Hiển thị thanh đo mức độ mạnh yếu của mật khẩu nếu độ dài password nhập vào lớn hơn 0 */}
          {password.length > 0 && (
            <View style={styles.strengthContainer}>
              {/* Ba thanh ngang biểu thị mức độ */}
              <View style={styles.strengthBarsRow}>
                {[1, 2, 3].map(i => (
                  <View
                    key={i}
                    style={[
                      styles.strengthBar,
                      {
                        // Tô màu thanh thứ i nếu điểm độ mạnh lớn hơn hoặc bằng i, ngược lại tô màu xám phân cách
                        backgroundColor: i <= strength ? strengthColor(strength) : Theme.colors.divider,
                      },
                    ]}
                  />
                ))}
              </View>
              {/* Vùng văn bản nhãn và cấp độ độ mạnh */}
              <View style={styles.strengthLabelRow}>
                <Text style={styles.strengthText}>Password strength</Text>
                <Text style={[styles.strengthLevelText, { color: strengthColor(strength) }]}>
                  {strengthLabel(strength)}
                </Text>
              </View>
            </View>
          )}

          {/* Hiển thị thông báo lỗi nếu có lỗi từ client-side validation hoặc từ máy chủ Supabase */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Nút bấm Kích hoạt Đăng ký tài khoản */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleCreate} // Gọi hàm đăng ký khi chạm
            disabled={loading} // Vô hiệu hóa nút khi đang gửi request đăng ký
            style={[styles.btn, Theme.glows.red, loading && { opacity: 0.7 }]} // Áp dụng bóng đỏ và độ mờ khi loading
          >
            <Text style={styles.btnText}>
              {/* Thay đổi text nút động theo trạng thái gửi request */}
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </Text>
          </TouchableOpacity>

          {/* Dải phân cách với phần đăng nhập social */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Hàng chứa các nút đăng nhập mạng xã hội (Google / Apple) */}
          <View style={styles.socialRow}>
            {/* Nút Google */}
            <TouchableOpacity onPress={handleCreate} style={styles.socialBtn} activeOpacity={0.8}>
              <Text style={styles.socialBtnText}>G Google</Text>
            </TouchableOpacity>
            {/* Nút Apple */}
            <TouchableOpacity onPress={handleCreate} style={styles.socialBtn} activeOpacity={0.8}>
              <Text style={styles.socialBtnText}>🍎 Apple</Text>
            </TouchableOpacity>
          </View>

          {/* Đường dẫn điều hướng quay lại trang Đăng nhập đối với người đã có tài khoản */}
          <View style={styles.signinRow}>
            <Text style={styles.signinText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/signin')} activeOpacity={0.8}>
              <Text style={styles.signinLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// Định nghĩa CSS Stylesheet cho giao diện Đăng ký tài khoản
const styles = StyleSheet.create({
  container: {
    flex: 1, // Bao phủ toàn màn hình
    backgroundColor: Theme.colors.bgBase, // Màu nền tối base
  },
  scrollContent: {
    paddingHorizontal: 20, // Khoảng cách đệm hai bên form nhập liệu
    paddingBottom: 32, // Khoảng đệm dưới cùng trang để không bị bàn phím che
  },
  header: {
    paddingTop: 80, // Cách mép trên cùng 80 đơn vị (tránh tai thỏ)
    paddingBottom: 36, // Khoảng cách tới vùng form bên dưới
    alignItems: 'center', // Căn giữa nội dung tiêu đề theo chiều ngang
  },
  logo: {
    color: Theme.colors.primary, // Chữ đỏ thương hiệu
    fontSize: 22, // Cỡ chữ logo
    fontWeight: '700', // Đậm nét chữ
    letterSpacing: 4, // Khoảng cách giữa các chữ cái rộng tạo tính nhận diện thương hiệu
    textTransform: 'uppercase', // In hoa toàn bộ logo
    textShadowColor: 'rgba(229,9,20,0.3)', // Đổ bóng hào quang đỏ
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    marginBottom: 8,
    fontFamily: Theme.typography.fontFamily,
  },
  title: {
    color: Theme.colors.textPrimary, // Chữ trắng sáng
    fontSize: 20, // Cỡ chữ 20
    fontWeight: '600', // Đậm nét vừa
    marginBottom: 4,
    fontFamily: Theme.typography.fontFamily,
  },
  subtitle: {
    color: Theme.colors.textSecondary, // Màu chữ xám nhẹ
    fontSize: 14,
    fontFamily: Theme.typography.fontFamily,
  },
  form: {
    gap: 12, // Khoảng cách dọc đều nhau giữa các phần tử nhập liệu
  },
  strengthContainer: {
    marginBottom: 8, // Khoảng cách dưới thanh độ mạnh mật khẩu
  },
  strengthBarsRow: {
    flexDirection: 'row', // Sắp xếp 3 thanh ngang liền kề hàng ngang
    gap: 4, // Khoảng cách giữa mỗi thanh
    marginBottom: 4,
  },
  strengthBar: {
    flex: 1, // Mỗi thanh co giãn chiếm tỉ lệ bằng nhau
    height: 4, // Chiều cao 4 đơn vị
    borderRadius: 2, // Bo tròn cạnh thanh mật khẩu
  },
  strengthLabelRow: {
    flexDirection: 'row', // Sắp xếp hàng ngang
    justifyContent: 'space-between', // Đẩy chữ sang hai góc ngoài cùng trái/phải
  },
  strengthText: {
    color: Theme.colors.textTertiary, // Màu chữ mờ xám đậm
    fontSize: 11, // Cỡ chữ nhỏ 11
    fontFamily: Theme.typography.fontFamily,
  },
  strengthLevelText: {
    fontSize: 11, // Cỡ chữ nhỏ 11
    fontWeight: '600', // In đậm chữ cấp độ
    fontFamily: Theme.typography.fontFamily,
  },
  btn: {
    width: '100%', // Nút đăng ký rộng tối đa chiếm hết form
    height: 56, // Chiều cao nút bấm
    borderRadius: Theme.roundness.button, // Bo góc nút bấm chuẩn
    backgroundColor: Theme.colors.primary, // Màu nền đỏ chính hãng
    alignItems: 'center', // Căn văn bản giữa ngang
    justifyContent: 'center', // Căn văn bản giữa dọc
    marginTop: 4,
  },
  btnText: {
    color: Theme.colors.textPrimary, // Chữ nút bấm màu trắng sáng
    fontSize: 15, // Cỡ chữ 15
    fontWeight: '700', // Định dạng in đậm rất rõ ràng
    letterSpacing: 0.5,
    fontFamily: Theme.typography.fontFamily,
  },
  dividerRow: {
    flexDirection: 'row', // Sắp xếp đường kẻ trái - chữ - đường kẻ phải nằm ngang
    alignItems: 'center', // Căn giữa dọc
    gap: 12, // Khoảng cách
    marginVertical: 12, // Khoảng đệm trên dưới dải phân cách
  },
  dividerLine: {
    flex: 1, // Đường kẻ co giãn tối đa
    height: 1, // Độ dày đường kẻ 1px
    backgroundColor: Theme.colors.divider, // Màu viền mờ của đường phân cách
  },
  dividerText: {
    color: Theme.colors.textTertiary, // Chữ mờ xám đậm
    fontSize: 12,
    fontFamily: Theme.typography.fontFamily,
  },
  socialRow: {
    flexDirection: 'row', // Xếp hai nút mạng xã hội nằm ngang song song
    gap: 12, // Khoảng cách hai nút
  },
  socialBtn: {
    flex: 1, // Mỗi nút chiếm 50% chiều rộng khung
    height: 56, // Chiều cao nút mạng xã hội
    backgroundColor: Theme.colors.surfaceElevated, // Nền tối nâng tông
    borderWidth: 1, // Viền ngoài
    borderColor: Theme.colors.divider, // Màu viền xám mờ
    borderRadius: Theme.roundness.button, // Bo góc
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialBtnText: {
    color: Theme.colors.textPrimary, // Chữ trắng sáng
    fontSize: 14,
    fontFamily: Theme.typography.fontFamily,
  },
  signinRow: {
    flexDirection: 'row', // Xếp nhãn và nút điều hướng nằm ngang
    justifyContent: 'center', // Căn giữa theo chiều ngang
    alignItems: 'center', // Căn giữa theo chiều dọc
    marginTop: 16,
  },
  signinText: {
    color: Theme.colors.textSecondary, // Màu chữ xám nhẹ
    fontSize: 14,
    fontFamily: Theme.typography.fontFamily,
  },
  signinLink: {
    color: Theme.colors.primary, // Link màu đỏ để thu hút sự chú ý
    fontSize: 14,
    fontWeight: '600', // Đậm liên kết điều hướng
    fontFamily: Theme.typography.fontFamily,
  },
  errorText: {
    color: Theme.colors.primary, // Lỗi hiển thị chữ màu đỏ rực
    fontSize: 13,
    textAlign: 'center', // Căn giữa thông báo lỗi
    marginTop: 4,
    fontFamily: Theme.typography.fontFamily,
  },
});

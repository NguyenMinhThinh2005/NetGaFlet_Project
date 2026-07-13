import React, { useState, useEffect, useRef } from 'react';
// Import các component cơ bản và hiệu ứng Animated từ React Native
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image, ActivityIndicator } from 'react-native';
// Import hook useRouter từ expo-router để thực hiện chuyển hướng màn hình
import { useRouter } from 'expo-router';
// Import LinearGradient để vẽ dải màu nền động nếu không tải được ảnh phim
import { LinearGradient } from 'expo-linear-gradient';
// Import hook useSafeAreaInsets để lấy các khoảng đệm tai thỏ an toàn trên điện thoại
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// Import cấu hình màu sắc và định dạng font hệ thống
import Theme from '../constants/Theme';
// Import helper phân tích chuỗi gradient sang mảng màu CSS
import { parseGradient } from '../utils/helpers';
// Import các hàm API của OPhim để gọi dữ liệu phim mới và thông tin tập phim
import { getNewUpdatedMovies, getMovieDetails } from '../lib/movieApi';

export default function ShakeSurpriseScreen() {
  // Đối tượng router dùng để quay lui hoặc chuyển hướng
  const router = useRouter();
  // Lấy khoảng cách an toàn (tránh tai thỏ ở trên đầu màn hình)
  const insets = useSafeAreaInsets();
  // State lưu trữ bộ phim ngẫu nhiên được chọn để làm điều bất ngờ
  const [surpriseMovie, setSurpriseMovie] = useState<any | null>(null);
  // State lưu danh sách đầy đủ các phim mới lấy từ OPhim API để chọn ngẫu nhiên
  const [moviesList, setMoviesList] = useState<any[]>([]);
  // State quản lý hiệu ứng vòng xoay tải dữ liệu (loading)
  const [loading, setLoading] = useState(true);
  // State kiểm soát nút bấm "Xem ngay", khóa nút khi đang gọi link phát phim
  const [watching, setWatching] = useState(false);

  // Tạo giá trị hoạt ảnh dùng cho hiệu ứng nổi lơ lửng (float animation) của Poster phim
  const floatAnim = useRef(new Animated.Value(0)).current;

  // Hàm chọn ngẫu nhiên một bộ phim từ danh sách truyền vào
  const pickRandomMovieFromList = (list: any[]) => {
    // Nếu danh sách rỗng thì dừng không xử lý
    if (!list || list.length === 0) return;
    // Sinh một chỉ số ngẫu nhiên từ 0 đến độ dài danh sách trừ 1
    const randomIdx = Math.floor(Math.random() * list.length);
    // Lấy bộ phim tại vị trí ngẫu nhiên đó
    const item = list[randomIdx];
    
    // Ánh xạ cấu trúc dữ liệu của OPhim API thành cấu trúc UI thống nhất của ứng dụng
    setSurpriseMovie({
      id: item.slug, // Slug phim làm ID định danh
      title: item.name, // Tên phim tiếng Việt
      year: item.year || 2026, // Năm phát hành phim
      duration: item.time || '120m', // Thời lượng phim
      rating: 8.8, // Điểm đánh giá giả lập mặc định
      genres: ['Phim Mới', 'AI Pick'], // Thể loại gán mặc định
      format: '4K UltraHD', // Định dạng chất lượng phim
      posterGradient: 'linear-gradient(135deg, #0d0d1a 0%, #1a1a3e 40%, #0f2060 80%)', // Gradient fallback nền
      thumb_url: item.thumb_url, // Link ảnh nhỏ
      poster_url: item.poster_url, // Link ảnh poster lớn
    });
  };

  // Hàm xử lý khi người dùng nhấn nút "Chọn lại phim khác" (Shuffle Again)
  const handleShuffle = () => {
    // Gọi lại hàm chọn phim ngẫu nhiên từ mảng phim đã lưu trong state moviesList
    pickRandomMovieFromList(moviesList);
  };

  // Hàm xử lý khi bấm nút "Watch Now" (Xem ngay phim được đề xuất)
  const handleWatchNow = async () => {
    // Nếu chưa có phim ngẫu nhiên được chọn, dừng xử lý
    if (!surpriseMovie) return;
    try {
      // Đặt cờ trạng thái đang tải stream phim
      setWatching(true);
      // Gọi OPhim API chi tiết phim để lấy danh sách tập phim và link stream m3u8 tương ứng
      const details = await getMovieDetails(surpriseMovie.id);
      
      // Nếu dữ liệu hợp lệ và phim có ít nhất 1 tập
      if (details && details.episodes && details.episodes.length > 0) {
        // Lấy danh sách server nguồn phát của tập đầu tiên
        const serverData = details.episodes[0].server_data || [];
        // Lấy tập đầu tiên của server đầu tiên
        const firstEp = serverData[0];
        
        // Nếu tập phim tồn tại nguồn phát stream
        if (firstEp) {
          // Điều hướng người dùng thẳng tới màn hình phát video WebView kèm các tham số liên quan
          router.push({
            pathname: `/movie/${surpriseMovie.id}/play` as any,
            params: {
              link: firstEp.link_embed || firstEp.link_m3u8, // Link nhúng Web hoặc file stream m3u8
              episodeName: firstEp.name, // Tên tập phim (ví dụ: "Tập 1", "Full")
              movieName: details.movie?.name || surpriseMovie.title, // Tên phim
            }
          });
          return;
        }
      }
      // Phương án dự phòng (Fallback): Nếu không tìm thấy link phát phim, chuyển hướng sang trang chi tiết phim thông thường
      router.push(`/movie/${surpriseMovie.id}`);
    } catch (e) {
      // Ghi log lỗi nếu gặp sự cố gọi API
      console.error('Error starting play from shake surprise:', e);
      // Quay về trang chi tiết phim dự phòng
      router.push(`/movie/${surpriseMovie.id}`);
    } finally {
      // Giải phóng trạng thái đang tải phát phim
      setWatching(false);
    }
  };

  // Hiệu ứng chạy khi mount màn hình
  useEffect(() => {
    // Hàm tải danh sách phim mới để làm kho dữ liệu rút ngẫu nhiên
    async function loadShakeMovies() {
      try {
        setLoading(true);
        // Gọi API OPhim lấy danh sách phim mới cập nhật trang 1
        const res = await getNewUpdatedMovies(1);
        const list = res?.movies || [];
        // Lưu danh sách phim vào state
        setMoviesList(list);
        // Rút ngẫu nhiên một phim để hiển thị lần đầu tiên vào màn hình
        pickRandomMovieFromList(list);
      } catch (err) {
        console.error('Error fetching shake surprise movies:', err);
      } finally {
        setLoading(false);
      }
    }
    loadShakeMovies();

    // Khởi động hoạt ảnh lặp vô hạn (loop) tạo hiệu ứng poster nổi nhịp nhàng lên xuống
    Animated.loop(
      Animated.sequence([
        // Hoạt ảnh đẩy poster dịch lên trên -8 đơn vị trong 1.5 giây
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 1500,
          useNativeDriver: true, // Chạy bằng Driver gốc để mượt mà
        }),
        // Hoạt ảnh đưa poster trở lại vị trí gốc 0 đơn vị trong 1.5 giây
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start(); // Khởi chạy vòng lặp hoạt ảnh
  }, []);

  // Hiển thị màn hình chờ tải phim ngẫu nhiên lần đầu tiên
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
        <Text style={{ color: '#fff', marginTop: 12, fontFamily: Theme.typography.fontFamily }}>NixAI is choosing...</Text>
      </View>
    );
  }

  // Nếu không tải được phim ngẫu nhiên nào, không hiển thị gì
  if (!surpriseMovie) return null;

  // Phân tích mã màu gradient để làm hình nền cho poster nếu không có ảnh
  const gradient = parseGradient(surpriseMovie.posterGradient);
  
  // Xác định đường dẫn URL ảnh đầy đủ: Ưu tiên ảnh thumbnail hoặc ảnh poster, tự động ghép thêm domain CDN của OPhim nếu là đường dẫn tương đối
  const imageUrl = surpriseMovie.thumb_url ? (surpriseMovie.thumb_url.startsWith('http') ? surpriseMovie.thumb_url : `https://img.ophim.live/uploads/movies/${surpriseMovie.thumb_url}`) : (surpriseMovie.poster_url ? (surpriseMovie.poster_url.startsWith('http') ? surpriseMovie.poster_url : `https://img.ophim.live/uploads/movies/${surpriseMovie.poster_url}`) : null);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Hiệu ứng bóng sáng đỏ lan tỏa (bloom) bao quanh nền tối tạo thẩm mỹ rạp phim */}
      <View style={styles.bloom} pointerEvents="none" />

      {/* Nút quay lại màn hình trước */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      {/* Phần tiêu đề thông báo */}
      <View style={styles.header}>
        <Text style={styles.tagline}>🎲 TONIGHT'S PICK</Text>
        <Text style={styles.subtitle}>NixAI chose this for you.</Text>
      </View>

      {/* Vùng hiển thị Poster phim ở trung tâm */}
      <View style={styles.posterArea}>
        {/* Animated.View áp dụng hoạt ảnh nổi dịch chuyển theo trục Y */}
        <Animated.View
          style={[
            styles.poster,
            Theme.glows.redStrong, // Bóng sáng đỏ mạnh bao quanh khung poster
            { transform: [{ translateY: floatAnim }] }, // Kết nối giá trị hoạt ảnh floatAnim vào translateY
          ]}
        >
          {/* Nếu có ảnh thì hiển thị ảnh poster phim */}
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
            />
          ) : (
            // Nếu không tải được ảnh poster, vẽ lớp nền gradient chuyển màu huyền bí
            <LinearGradient
              colors={gradient.colors}
              locations={gradient.locations}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          )}

          {/* Hiển thị tiêu đề text dự phòng đè lên poster nếu không tải được ảnh */}
          {!imageUrl && (
            <Text style={styles.posterTitle} numberOfLines={2}>
              {surpriseMovie.title}
            </Text>
          )}
          {!imageUrl && <Text style={styles.posterYear}>{surpriseMovie.year}</Text>}
        </Animated.View>

        {/* Thông tin mô tả ngắn của bộ phim bên dưới Poster */}
        <View style={styles.movieInfo}>
          <Text style={styles.movieTitle} numberOfLines={2}>{surpriseMovie.title}</Text>
          {/* Hàng chứa các huy hiệu thể loại (badges) */}
          <View style={styles.badgeRow}>
            {surpriseMovie.genres.map((g: string) => (
              <View key={g} style={styles.genrePill}>
                <Text style={styles.genrePillText}>{g}</Text>
              </View>
            ))}
          </View>
          {/* Thông tin metadata: Điểm đánh giá, thời lượng và định dạng phát */}
          <Text style={styles.movieMeta}>
            ⭐ {surpriseMovie.rating}  ·  {surpriseMovie.duration}  ·  {surpriseMovie.format}
          </Text>
        </View>
      </View>

      {/* Vùng chứa các nút điều khiển chính dưới đáy màn hình */}
      <View style={styles.footer}>
        {/* Nút bấm xem phim ngay lập tức */}
        <TouchableOpacity
          onPress={handleWatchNow} // Thực thi gọi link stream
          style={[styles.watchBtn, Theme.glows.red]} // Hiệu ứng sáng đỏ bao quanh nút đỏ
          activeOpacity={0.85}
          disabled={watching} // Khóa nút khi đang tải link
        >
          {watching ? (
            // Hiển thị chỉ báo chờ nếu đang load API m3u8
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.watchText}>▶ Watch Now</Text>
          )}
        </TouchableOpacity>

        {/* Hàng chứa các nút phụ phụ gồm xem Chi tiết và Chọn ngẫu nhiên phim khác */}
        <View style={styles.secondaryRow}>
          {/* Nút xem chi tiết phim */}
          <TouchableOpacity
            onPress={() => router.push(`/movie/${surpriseMovie.id}`)} // Chuyển tới trang chi tiết phim
            style={styles.btn}
            activeOpacity={0.8}
          >
            <Text style={styles.btnText}>ℹ️ Details</Text>
          </TouchableOpacity>

          {/* Nút rút ngẫu nhiên lại bộ phim khác */}
          <TouchableOpacity
            onPress={handleShuffle} // Lắc lại
            style={styles.btn}
            activeOpacity={0.8}
          >
            <Text style={styles.btnText}>🎲 Shuffle Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// Định nghĩa CSS Stylesheet cho giao diện Đề xuất ngẫu nhiên
const styles = StyleSheet.create({
  container: {
    flex: 1, // Kéo dãn giao diện chiếm toàn màn hình
    backgroundColor: Theme.colors.bgBase, // Nền tối đặc trưng
  },
  bloom: {
    position: 'absolute', // Lớp phủ phát sáng tuyệt đối
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(229,9,20,0.06)', // Bóng sáng đỏ nhẹ lan tỏa 6%
  },
  backBtn: {
    paddingHorizontal: 20, // Khoảng đệm ngang nút Back
    paddingVertical: 12, // Khoảng đệm dọc nút Back
    alignSelf: 'flex-start', // Căn sát lề trái màn hình
    zIndex: 10, // Nằm trên lớp bóng sáng
  },
  backText: {
    color: Theme.colors.textPrimary, // Chữ màu trắng
    fontSize: 22, // Cỡ chữ mũi tên quay lại
  },
  header: {
    alignItems: 'center', // Căn giữa tiêu đề trang
    paddingTop: 16,
  },
  tagline: {
    color: Theme.colors.primary, // Đỏ rực rỡ hãng
    fontSize: 11, // Chữ nhỏ
    fontWeight: '700', // Đậm nét chữ
    letterSpacing: 3, // Khoảng cách ký tự rộng
    marginBottom: 6,
    fontFamily: Theme.typography.fontFamily,
  },
  subtitle: {
    color: Theme.colors.textTertiary, // Màu chữ xám mờ
    fontSize: 13,
    fontFamily: Theme.typography.fontFamily,
  },
  posterArea: {
    flex: 1, // Poster area chiếm không gian trống chính giữa màn hình
    alignItems: 'center', // Căn giữa chiều ngang
    justifyContent: 'center', // Căn giữa chiều dọc
    gap: 20, // Khoảng cách giữa Poster và Vùng text thông tin phim
    paddingHorizontal: 20,
  },
  poster: {
    width: 200, // Chiều rộng Poster 200 đơn vị
    height: 300, // Chiều cao Poster 300 đơn vị
    borderRadius: 20, // Bo tròn góc poster mượt mà
    overflow: 'hidden', // Ẩn ảnh thừa ngoài góc bo tròn
    alignItems: 'center', // Căn nội dung dự phòng vào giữa ngang
    justifyContent: 'center', // Căn nội dung dự phòng vào giữa dọc
    position: 'relative', // Sử dụng định vị tương đối để làm lớp phủ ảnh
    backgroundColor: '#12121e', // Nền tối chờ ảnh tải
  },
  posterTitle: {
    color: 'rgba(245,245,245,0.9)', // Chữ trắng đục nổi lên
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase', // Chuyển sang in hoa
    textAlign: 'center',
    paddingHorizontal: 12,
    fontFamily: Theme.typography.fontFamily,
  },
  posterYear: {
    color: 'rgba(229,9,20,0.6)', // Năm sản xuất màu đỏ mờ
    fontSize: 12,
    marginTop: 6,
    fontFamily: Theme.typography.fontFamily,
  },
  movieInfo: {
    alignItems: 'center', // Căn giữa nội dung mô tả phim
    paddingHorizontal: 10,
  },
  movieTitle: {
    color: Theme.colors.textPrimary, // Chữ màu trắng sáng
    fontSize: 22, // Tiêu đề phim cỡ lớn
    fontWeight: '700', // Đậm nét chữ
    marginBottom: 6,
    fontFamily: Theme.typography.fontFamily,
    textAlign: 'center',
  },
  badgeRow: {
    flexDirection: 'row', // Sắp xếp huy hiệu thể loại hàng ngang
    gap: 8, // Khoảng cách giữa các huy hiệu
    justifyContent: 'center',
    marginBottom: 8,
    flexWrap: 'wrap', // Tự động xuống dòng nếu thể loại quá dài
  },
  genrePill: {
    backgroundColor: Theme.colors.primary, // Nền viên thuốc màu đỏ thương hiệu
    borderRadius: Theme.roundness.pill, // Bo tròn viên thuốc tối đa
    paddingHorizontal: 8, // Khoảng đệm ngang chữ
    paddingVertical: 3, // Khoảng đệm dọc chữ
  },
  genrePillText: {
    fontSize: 10, // Cỡ chữ siêu nhỏ
    fontWeight: '600', // Chữ in đậm vừa
    color: Theme.colors.textPrimary, // Chữ trắng
    fontFamily: Theme.typography.fontFamily,
  },
  movieMeta: {
    color: Theme.colors.textSecondary, // Chữ màu xám nhẹ
    fontSize: 13,
    fontFamily: Theme.typography.fontFamily,
  },
  footer: {
    paddingHorizontal: 20, // Khoảng đệm hai bên các nút đáy
    paddingBottom: 28, // Khoảng cách cách mép dưới cùng
    gap: 10, // Khoảng cách dọc giữa các hàng nút
  },
  watchBtn: {
    width: '100%', // Nút xem ngay chiếm trọn chiều rộng
    height: 56, // Chiều cao nút
    borderRadius: Theme.roundness.button, // Bo góc nút bấm
    backgroundColor: Theme.colors.primary, // Màu nền đỏ chính hãng
    alignItems: 'center', // Căn giữa ngang
    justifyContent: 'center', // Căn giữa dọc
    flexDirection: 'row', // Xếp icon và chữ nằm ngang
    gap: 8,
  },
  watchText: {
    color: Theme.colors.textPrimary, // Chữ màu trắng sáng
    fontSize: 16,
    fontWeight: '700', // In đậm nét chữ
    fontFamily: Theme.typography.fontFamily,
  },
  secondaryRow: {
    flexDirection: 'row', // Xếp nút Chi tiết và Lắc lại song song nằm ngang
    gap: 10, // Khoảng cách giữa hai nút phụ
  },
  btn: {
    flex: 1, // Mỗi nút chiếm 50% độ rộng của hàng ngang
    height: 48, // Chiều cao nút bấm phụ
    borderRadius: Theme.roundness.button, // Bo góc nút
    backgroundColor: Theme.colors.surface, // Nền xám tối nhạt hơn
    borderWidth: 1, // Đường viền bao quanh
    borderColor: Theme.colors.divider, // Màu viền mờ
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: Theme.colors.textPrimary, // Chữ trắng sáng
    fontSize: 14,
    fontFamily: Theme.typography.fontFamily,
  },
});

import { useRef, useCallback } from 'react';
// Import cảm biến Accelerometer (Gia tốc kế) từ thư viện expo-sensors để thu thập dữ liệu chuyển động của thiết bị
import { Accelerometer } from 'expo-sensors';
// Import hook useFocusEffect từ expo-router để lắng nghe trạng thái focus của màn hình
import { useFocusEffect } from 'expo-router';

/**
 * Custom Hook useShake - Lắng nghe chuyển động rung lắc của điện thoại để kích hoạt sự kiện tương ứng
 * @param onShake Hàm callback sẽ được gọi khi phát hiện hành động rung lắc thiết bị hợp lệ
 * @param threshold Ngưỡng gia tốc kích hoạt sự kiện (mặc định là 1.8), càng thấp càng nhạy
 */
export function useShake(onShake: () => void, threshold = 1.8) {
  // Sử dụng useRef để lưu trữ gia tốc tọa độ X gần nhất, tránh render lại giao diện khi giá trị thay đổi
  const lastX = useRef<number | null>(null);
  // Lưu trữ gia tốc tọa độ Y gần nhất
  const lastY = useRef<number | null>(null);
  // Lưu trữ gia tốc tọa độ Z gần nhất
  const lastZ = useRef<number | null>(null);
  // Biến cờ hiệu cooldown để ngăn chặn sự kiện shake bị trigger liên tiếp nhiều lần trong thời gian ngắn
  const cooldown = useRef(false);

  useFocusEffect(
    useCallback(() => {
      // Biến lưu trữ đối tượng đăng ký lắng nghe cảm biến
      let subscription: { remove: () => void } | null = null;
      let timeoutId: NodeJS.Timeout;

      // Hàm bất đồng bộ thiết lập và đăng ký lắng nghe cảm biến gia tốc
      const subscribe = async () => {
        try {
          // Kiểm tra xem thiết bị hiện tại có hỗ trợ cảm biến gia tốc kế hay không (giúp tránh crash trên simulator)
          const isAvailable = await Accelerometer.isAvailableAsync();
          // Nếu không khả dụng, dừng luồng đăng ký cảm biến
          if (!isAvailable) return;
          
          // Cấu hình tần suất cập nhật dữ liệu từ cảm biến gia tốc là 100ms một lần
          Accelerometer.setUpdateInterval(100);
          
          // Bắt đầu lắng nghe sự thay đổi tọa độ của cảm biến
          subscription = Accelerometer.addListener(data => {
            // Nếu đang trong thời gian chờ (cooldown), bỏ qua không xử lý sự kiện
            if (cooldown.current) return;
            // Trích xuất các giá trị gia tốc dọc theo ba trục không gian X, Y, Z
            const { x, y, z } = data;

            // Kiểm tra xem đã có dữ liệu gia tốc của chu kỳ trước đó chưa
            if (lastX.current !== null && lastY.current !== null && lastZ.current !== null) {
              // Tính toán sự thay đổi gia tốc tuyệt đối dọc theo trục X (trái-phải)
              const dx = Math.abs(x - lastX.current);
              // Tính toán sự thay đổi gia tốc tuyệt đối dọc theo trục Y (lên-xuống)
              const dy = Math.abs(y - lastY.current);
              // Tính toán sự thay đổi gia tốc tuyệt đối dọc theo trục Z (trước-sau)
              const dz = Math.abs(z - lastZ.current);
              
              // Thuật toán: Nếu tổng lượng biến thiên gia tốc trên cả 3 trục vượt ngưỡng threshold cấu hình
              if (dx + dy + dz > threshold) {
                // Bật cờ cooldown để khóa các tín hiệu rung lắc tiếp theo
                cooldown.current = true;
                // Gọi hàm callback thực thi hành động đề xuất phim ngẫu nhiên từ phía client
                onShake();
                // Hẹn giờ sau 3 giây (3000ms) sẽ mở khóa cờ cooldown cho phép nhận tín hiệu rung tiếp theo
                timeoutId = setTimeout(() => {
                  cooldown.current = false;
                }, 3000);
              }
            }

            // Cập nhật giá trị gia tốc hiện tại làm giá trị cũ của chu kỳ tiếp theo
            lastX.current = x;
            lastY.current = y;
            lastZ.current = z;
          });
        } catch (err) {
          // Cảnh báo log lỗi nếu gặp trục trặc khởi tạo cảm biến
          console.warn('Accelerometer sensor initialization error:', err);
        }
      };

      subscribe();

      return () => {
        if (subscription) {
          subscription.remove();
        }
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        lastX.current = null;
        lastY.current = null;
        lastZ.current = null;
        cooldown.current = false;
      };
    }, [onShake, threshold])
  );
>>>>>>> origin/feature/update-logic
}

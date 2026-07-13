import React, { useState, useEffect, useRef } from 'react';
// Import các thành phần giao diện cơ bản từ React Native để xây dựng UI
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
// Import hook useRouter từ expo-router để thực hiện chuyển hướng màn hình
import { useRouter } from 'expo-router';
// Import hook useSafeAreaInsets để xử lý khoảng đệm vùng tai thỏ/nút Home trên iOS/Android
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// Import theme màu sắc và typography chung của ứng dụng
import Theme from '../constants/Theme';
// Import component bong bóng chat để hiển thị từng dòng tin nhắn
import ChatBubble from '../components/features/ChatBubble';
// Import danh sách phim giả lập để chọn phim gợi ý
import { mockMovies } from '../data/mockMovies';

// Tìm bộ phim 'Tenet' trong danh sách giả lập để làm dữ liệu gợi ý của AI
const tenetMovie = mockMovies.find(m => m.id === 'tenet');

// Chuỗi phản hồi đầy đủ của AI trợ lý NixAI khi trả lời yêu cầu phim "hại não" giống Inception
const FULL_AI_TEXT = "Great taste! Here's one I think you'll obsess over — it's got the mind-bending complexity of Inception but it's much more recent. ";

// Danh sách tin nhắn ban đầu để khởi tạo màn hình chat (gồm 1 tin AI chào hỏi và 1 tin user yêu cầu phim)
const INITIAL_MESSAGES = [
  {
    id: 1, // Định danh duy nhất cho tin nhắn chào mừng
    sender: 'ai' as const, // Phân biệt người gửi là Trợ lý ảo AI
    text: "Hey Alex! 👋 What kind of film are you in the mood for tonight?", // Nội dung chào mừng
    time: '9:41 PM', // Thời gian gửi tin nhắn giả lập
  },
  {
    id: 2, // Định danh duy nhất cho tin nhắn yêu cầu của người dùng
    sender: 'user' as const, // Phân biệt người gửi là User
    text: 'Something mind-bending, like Inception but newer.', // Nội dung yêu cầu tìm phim hại não mới hơn
    time: '9:42 PM', // Thời gian gửi tin nhắn giả lập
  },
];

export default function ChatbotScreen() {
  // Đối tượng router dùng để chuyển hướng màn hình (ví dụ: quay lại trang cũ)
  const router = useRouter();
  // Lấy các giá trị khoảng đệm an toàn của thiết bị (tai thỏ top, cằm dưới bottom)
  const insets = useSafeAreaInsets();
  // Khởi tạo state quản lý danh sách các tin nhắn hiển thị trong màn hình chat
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  // State lưu trữ nội dung văn bản đang được AI gõ ra (tạo hiệu ứng streaming từng chữ)
  const [streamText, setStreamText] = useState('');
  // State lưu chỉ số ký tự hiện tại đang được stream từ chuỗi phản hồi đầy đủ
  const [streamIdx, setStreamIdx] = useState(0);
  // State kiểm soát việc hiển thị thẻ phim đề cử (sau khi AI stream xong văn bản gợi ý)
  const [showCard, setShowCard] = useState(false);
  // State kiểm soát hiển thị bong bóng "AI đang nhập..." (typing indicator)
  const [showTyping, setShowTyping] = useState(false);
  // State lưu trữ nội dung người dùng nhập vào ô input
  const [input, setInput] = useState('');

  // Tham chiếu tới ScrollView để điều khiển cuộn trang tự động xuống cuối khi có tin nhắn mới
  const scrollRef = useRef<ScrollView>(null);
  // Tham chiếu lưu trữ bộ đếm thời gian (Interval) stream chữ để có thể dọn dẹp khi unmount
  const intervalRef = useRef<any>(null);
  // Tham chiếu lưu bộ hẹn giờ (Timeout) ẩn typing indicator
  const typingTimeoutRef = useRef<any>(null);
  // Tham chiếu lưu bộ hẹn giờ (Timeout) bắt đầu hiển thị typing indicator sau khi mở màn hình
  const startTimeoutRef = useRef<any>(null);

  // Hiệu ứng useEffect chạy một lần khi mount để giả lập luồng AI trả lời tin nhắn có sẵn
  useEffect(() => {
    // Sau 600ms kể từ lúc vào màn hình, hiển thị bong bóng "AI đang nhập..."
    startTimeoutRef.current = setTimeout(() => {
      setShowTyping(true);
      
      // Sau 1.5 giây hiển thị "AI đang nhập...", ẩn nó đi và bắt đầu hiệu ứng stream chữ trả lời
      typingTimeoutRef.current = setTimeout(() => {
        setShowTyping(false);
        
        // Khởi tạo bộ đếm lặp lại mỗi 28ms để gõ từng ký tự một của chuỗi phản hồi FULL_AI_TEXT
        intervalRef.current = setInterval(() => {
          setStreamIdx(i => {
            // Nếu đã gõ hết toàn bộ ký tự trong chuỗi phản hồi
            if (i >= FULL_AI_TEXT.length) {
              // Dừng bộ đếm lặp lại
              clearInterval(intervalRef.current);
              // Kích hoạt hiển thị Thẻ phim gợi ý (Tenet) bên dưới tin nhắn
              setShowCard(true);
              // Giữ nguyên chỉ số ký tự
              return i;
            }
            // Cập nhật chuỗi streamText bằng cách cắt chuỗi gốc từ đầu đến ký tự thứ i + 1
            setStreamText(FULL_AI_TEXT.slice(0, i + 1));
            // Tăng chỉ số ký tự lên 1 cho lần chạy tiếp theo
            return i + 1;
          });
        }, 28); // Tốc độ stream: 28ms một ký tự
      }, 1500); // Thời gian hiển thị "AI đang nhập" là 1.5s
    }, 600); // Thời gian chờ trước khi hiện "AI đang nhập" là 600ms

    // Hủy bỏ tất cả các bộ đếm thời gian khi component bị unmount để tránh rò rỉ bộ nhớ (memory leaks)
    return () => {
      clearTimeout(startTimeoutRef.current);
      clearTimeout(typingTimeoutRef.current);
      clearInterval(intervalRef.current);
    };
  }, []);

  // Tự động cuộn ScrollView xuống cuối cùng mỗi khi danh sách tin nhắn, chữ stream, typing hoặc card thay đổi
  useEffect(() => {
    // Chờ 100ms để đảm bảo layout giao diện mới đã được render hoàn chỉnh
    setTimeout(() => {
      // Gọi lệnh scrollToEnd để cuộn mượt mà (animated: true) xuống cuối danh sách chat
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, streamText, showTyping, showCard]);

  // Xử lý gửi tin nhắn mới của người dùng
  const handleSend = () => {
    // Nếu nội dung nhập vào chỉ toàn khoảng trắng hoặc rỗng thì không xử lý gửi
    if (!input.trim()) return;
    
    // Lấy thời gian hiện tại dưới định dạng Giờ:Phút (ví dụ: 09:45)
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    // Tạo cấu trúc đối tượng tin nhắn mới của User
    const userMsg = {
      id: Date.now(), // Dùng timestamp hiện tại làm ID duy nhất
      sender: 'user' as const, // Người gửi là user
      text: input, // Nội dung tin nhắn lấy từ ô nhập liệu
      time: timeStr, // Thời gian gửi
    };

    // Cập nhật danh sách tin nhắn hiện tại bằng cách thêm tin nhắn mới của user vào cuối mảng
    setMessages(prev => [...prev, userMsg]);
    // Reset trống ô nhập liệu
    setInput('');

    // Giả lập phản hồi tự động của AI sau khi người dùng gửi tin nhắn 1 giây
    setTimeout(() => {
      // Tạo tin nhắn phản hồi chung của AI
      const aiMsg = {
        id: Date.now() + 1, // ID duy nhất
        sender: 'ai' as const, // Người gửi là ai
        text: "I'll find something perfect for that mood! Give me a moment... 🎬", // Nội dung phản hồi giả lập
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Thời gian gửi phản hồi
      };
      // Thêm tin nhắn của AI vào danh sách hiển thị trên màn hình
      setMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  return (
    // KeyboardAvoidingView giúp đẩy giao diện lên trên khi bàn phím ảo xuất hiện, tránh che mất ô nhập liệu
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined} // Chỉ dùng padding trên iOS, Android tự xử lý
      style={[styles.container, { paddingTop: insets.top }]} // Thiết lập khoảng đệm đỉnh đầu tránh tai thỏ
    >
      {/* Header bar - Thanh tiêu đề trên cùng */}
      <View style={styles.header}>
        {/* Nút quay lại màn hình trước */}
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        {/* Thông tin tiêu đề Trợ lý ảo NixAI */}
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>✨ NixAI</Text>
          {/* Trạng thái hoạt động (Online) */}
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Online</Text>
          </View>
        </View>

        {/* Nút menu tùy chọn bổ sung (icon 3 chấm đứng) */}
        <TouchableOpacity style={styles.headerBtn}>
          <Text style={styles.headerOptions}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Chat Area - Vùng hiển thị nội dung hội thoại */}
      <ScrollView
        ref={scrollRef} // Gán ref để điều khiển cuộn trang
        style={styles.chatArea}
        contentContainerStyle={styles.chatScrollContent}
        showsVerticalScrollIndicator={false} // Ẩn thanh cuộn dọc mặc định
      >
        {/* Duyệt qua mảng tin nhắn và render tương ứng thông qua ChatBubble */}
        {messages.map(msg => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        {/* Bong bóng hiển thị chữ đang gõ (streaming) hoặc thẻ phim gợi ý của AI */}
        {(streamText.length > 0 || showCard) && (
          <ChatBubble
            message={{
              id: 'stream',
              sender: 'ai',
              text: streamText, // Nội dung text đang được stream dần
              streaming: streamIdx < FULL_AI_TEXT.length, // Cờ báo hiệu đang trong quá trình gõ
              time: '9:43 PM',
              movieCard: showCard ? tenetMovie : null, // Gửi kèm thông tin phim Tenet nếu stream đã hoàn thành
            }}
          />
        )}

        {/* Bong bóng hiển thị dấu 3 chấm động khi AI đang chuẩn bị câu trả lời */}
        {showTyping && (
          <ChatBubble
            message={{
              id: 'typing',
              sender: 'ai',
              type: 'typing', // Đánh dấu loại tin nhắn là hiệu ứng gõ chữ
            }}
          />
        )}
      </ScrollView>

      {/* Input bar - Thanh nhập liệu tin nhắn dưới đáy màn hình */}
      <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        {/* Nút bấm kích hoạt ghi âm/micro */}
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.micIcon}>🎙</Text>
        </TouchableOpacity>

        {/* Ô nhập văn bản chính */}
        <TextInput
          value={input} // Liên kết với state input
          onChangeText={setInput} // Cập nhật state khi gõ phím
          onSubmitEditing={handleSend} // Gửi tin nhắn khi nhấn nút Done/Submit trên bàn phím
          placeholder="Ask NixAI anything..." // Gợi ý nhập liệu
          placeholderTextColor={Theme.colors.textTertiary} // Màu chữ gợi ý dạng mờ
          style={styles.input}
        />

        {/* Nút gửi tin nhắn (dạng hình tròn có hiệu ứng phát sáng nhẹ màu đỏ) */}
        <TouchableOpacity
          onPress={handleSend} // Gọi hàm gửi tin nhắn khi bấm nút
          style={[styles.sendBtn, Theme.glows.red]} // Áp dụng style nút gửi và bóng sáng đỏ
          activeOpacity={0.8} // Độ mờ khi nhấn
        >
          <Text style={styles.sendText}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// Định nghĩa các lớp CSS Stylesheet cho màn hình Chatbot
const styles = StyleSheet.create({
  container: {
    flex: 1, // Kéo dãn giao diện chiếm toàn bộ chiều cao màn hình khả dụng
    backgroundColor: Theme.colors.bgBase, // Sử dụng màu nền tối base của hệ thống
  },
  header: {
    height: 56, // Chiều cao cố định cho thanh tiêu đề
    backgroundColor: Theme.colors.surface, // Màu nền của thanh header
    borderBottomWidth: 1, // Đường kẻ viền dưới thanh tiêu đề
    borderBottomColor: Theme.colors.divider, // Màu viền phân cách mờ
    flexDirection: 'row', // Xếp các thành phần con theo hàng ngang
    alignItems: 'center', // Căn chỉnh các thành phần con thẳng hàng theo trục đứng
    justifyContent: 'space-between', // Phân bổ đều khoảng cách giữa các phần tử (nút trái - giữa - nút phải)
    paddingHorizontal: 16, // Khoảng đệm hai bên trái/phải của header
  },
  headerBtn: {
    padding: 6, // Tạo vùng nhấn rộng hơn cho nút trên header
  },
  backArrow: {
    color: Theme.colors.textPrimary, // Màu trắng cho nút mũi tên quay lại
    fontSize: 22, // Kích thước chữ mũi tên quay lại
  },
  headerTitleContainer: {
    alignItems: 'center', // Căn giữa nội dung tiêu đề và trạng thái
  },
  headerTitle: {
    color: Theme.colors.textPrimary, // Màu trắng cho tiêu đề
    fontSize: 17, // Kích thước chữ tiêu đề
    fontWeight: '600', // Định dạng chữ in đậm vừa phải
    fontFamily: Theme.typography.fontFamily, // Phông chữ hệ thống chung
  },
  statusRow: {
    flexDirection: 'row', // Xếp chấm tròn và chữ Online nằm ngang
    alignItems: 'center', // Căn giữa theo chiều dọc
    gap: 4, // Khoảng cách giữa chấm tròn và chữ Online
  },
  statusDot: {
    width: 6, // Chiều rộng chấm tròn xanh lá
    height: 6, // Chiều cao chấm tròn xanh lá
    borderRadius: 3, // Bo tròn tuyệt đối để tạo hình tròn
    backgroundColor: Theme.colors.success, // Màu xanh lá biểu thị online
  },
  statusText: {
    color: Theme.colors.success, // Màu xanh lá cho chữ Online
    fontSize: 11, // Kích thước chữ nhỏ
    fontFamily: Theme.typography.fontFamily, // Phông chữ hệ thống chung
  },
  headerOptions: {
    color: Theme.colors.textTertiary, // Màu chữ mờ xám cho nút menu 3 chấm
    fontSize: 20, // Kích thước icon 3 chấm
  },
  chatArea: {
    flex: 1, // Vùng chat co giãn chiếm phần lớn không gian màn hình
  },
  chatScrollContent: {
    paddingHorizontal: 20, // Khoảng đệm hai bên cho nội dung tin nhắn chat
    paddingTop: 16, // Khoảng đệm đỉnh của vùng chat
    paddingBottom: 24, // Khoảng đệm đáy của vùng chat
  },
  inputBar: {
    height: 72, // Chiều cao cố định cho thanh nhập liệu
    backgroundColor: Theme.colors.surface, // Màu nền tối hơn của thanh nhập liệu
    borderTopWidth: 1, // Viền trên phân cách với vùng chat
    borderTopColor: Theme.colors.divider, // Màu viền mờ phân cách
    flexDirection: 'row', // Xếp các thành phần (mic, input, gửi) theo hàng ngang
    alignItems: 'center', // Căn giữa các thành phần theo chiều dọc
    gap: 10, // Khoảng cách giữa các thành phần con
    paddingHorizontal: 16, // Khoảng đệm hai bên thanh nhập liệu
  },
  micIcon: {
    color: Theme.colors.textTertiary, // Màu xám mờ cho icon micro
    fontSize: 20, // Kích thước micro
  },
  input: {
    flex: 1, // Ô nhập text co giãn tối đa chiếm không gian trống còn lại
    height: 40, // Chiều cao ô nhập text
    backgroundColor: Theme.colors.surfaceElevated, // Màu nền tối nâng cao để nổi bật hơn nền surface
    borderWidth: 1, // Viền bao quanh ô nhập text
    borderColor: Theme.colors.divider, // Màu viền mờ
    borderRadius: 100, // Bo góc tối đa tạo hình viên thuốc (rounded-full)
    paddingHorizontal: 16, // Khoảng cách chữ nhập cách viền trái/phải
    color: Theme.colors.textPrimary, // Màu chữ nhập vào là màu trắng sáng
    fontSize: 14, // Kích thước chữ
    fontFamily: Theme.typography.fontFamily, // Phông chữ hệ thống chung
  },
  sendBtn: {
    width: 40, // Chiều rộng nút gửi tròn
    height: 40, // Chiều cao nút gửi tròn
    borderRadius: 20, // Bo góc tạo hình tròn hoàn hảo
    backgroundColor: Theme.colors.primary, // Màu nền đỏ chính (Netflix Red)
    alignItems: 'center', // Căn icon mũi tên vào chính giữa chiều ngang
    justifyContent: 'center', // Căn icon mũi tên vào chính giữa chiều dọc
  },
  sendText: {
    color: Theme.colors.textPrimary, // Màu trắng cho icon mũi tên gửi
    fontSize: 16, // Kích thước icon gửi
  },
});

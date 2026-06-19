# NetGaFlet - Ứng dụng xem phim Streaming kết hợp AI

Dự án **NetGaFlet** là một hệ thống phát trực tuyến phim (Streaming App) được tích hợp các tính năng AI thông minh (Chatbot đề xuất phim, đánh giá gu phim Roast, tìm phim theo tâm trạng Mood Picker).

Dự án bao gồm 2 phần chính:
1. **Frontend (netgaflet):** Ứng dụng di động được xây dựng bằng **React Native**, **Expo (Expo Router)** và **TypeScript**.
2. **Backend (backend):** Server API xây dựng bằng **Node.js**, **Express**, **TypeScript** và sẵn sàng tích hợp với **Supabase**.

---

## Cấu trúc thư mục dự án

```text
NetGaFlet_Project/
├── netgaflet/            # Mã nguồn ứng dụng di động (Frontend)
│   ├── app/              # Các màn hình (Expo Router)
│   ├── components/       # Các component dùng chung
│   ├── constants/        # Hằng số cấu hình (Màu sắc, Typography, Theme)
│   ├── context/          # Quản lý State toàn cục (Auth, AppState)
│   ├── data/             # Dữ liệu Mock (Phim, reviews, người dùng)
│   ├── hooks/            # Các Custom Hooks
│   └── utils/            # Các hàm tiện ích bổ trợ
│
└── backend/              # Mã nguồn API Server (Backend)
    └── src/
        └── index.ts      # Điểm chạy chính của server
```

---

## Hướng dẫn cài đặt và chạy dự án (Đảm bảo chạy được 100%)

### 1. Yêu cầu hệ thống ban đầu
Để chạy được dự án, máy của bạn cần cài đặt sẵn:
* **Node.js** (Khuyến nghị phiên bản LTS mới nhất - v18 hoặc v20+).
* **NPM** (Đi kèm khi cài đặt Node.js).
* Ứng dụng **Expo Go** trên điện thoại (iOS / Android) để test nhanh trên thiết bị thật, hoặc cài sẵn Simulator/Emulator nếu muốn test trên máy tính.

---

### 2. Chạy ứng dụng di động (Frontend - `netgaflet`)

Mở Terminal và thực hiện các bước sau:

```bash
# 1. Di chuyển vào thư mục netgaflet
cd netgaflet

# 2. Cài đặt các thư viện phụ thuộc (dependencies)
npm install

# 3. Khởi chạy Metro Bundler của Expo
npm start
```

Sau khi chạy lệnh `npm start` (hoặc `npx expo start`), Metro Bundler sẽ khởi động và cung cấp một mã QR:
* **Trên điện thoại thật:** Mở ứng dụng camera (iOS) hoặc ứng dụng Expo Go (Android) quét mã QR để mở app.
* **Trên máy tính:**
  * Nhấn `i` để mở trên Trình giả lập iOS (iOS Simulator).
  * Nhấn `a` để mở trên Trình giả lập Android (Android Emulator).
  * Nhấn `w` để chạy phiên bản Web của ứng dụng trên trình duyệt.

---

### 3. Chạy Server API (Backend - `backend`)

Mở một cửa sổ Terminal mới:

```bash
# 1. Di chuyển vào thư mục backend
cd backend

# 2. Cài đặt các thư viện phụ thuộc
npm install

# 3. Chạy server ở chế độ Development
npm run dev
```

Server sẽ tự động biên dịch TypeScript và chạy bằng `ts-node`.

---

## Lưu ý quan trọng khi phát triển (Không làm ảnh hưởng cấu hình máy cá nhân)
* **Không commit thư mục node_modules, .expo, và các file build:** Các thư mục này đã được định nghĩa trong các file `.gitignore` ở cả thư mục gốc, thư mục `netgaflet` và `backend`.
* **Cấu hình môi trường (.env):** Nếu sau này có cấu hình các API Key hoặc URL kết nối database, hãy tạo một file `.env.example` để hướng dẫn người khác cấu hình, tuyệt đối không commit file `.env` chứa thông tin bảo mật hoặc thông số local của riêng bạn.

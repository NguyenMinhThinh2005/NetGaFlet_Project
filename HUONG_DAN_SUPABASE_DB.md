# CẨM NANG CHI TIẾT: THUYẾT TRÌNH BÁO CÁO SUPABASE & CƠ SỞ DỮ LIỆU (NETGAFLEX)

Tài liệu này được soạn riêng cho **Thành viên phụ trách Backend & Database**. Giúp bạn hiểu tường tận "chân tơ kẽ tóc" cơ chế hoạt động, cấu trúc SQL và bảo mật của dự án để ngày mai thuyết trình tự tin và chính xác nhất.

---

## PHẦN 1: BỨC TRANH TỔNG QUAN (SUPABASE LÀ GÌ?)

### 1. Kiến thức nền tảng:
*   **Supabase** không đơn thuần là một Database, nó là một **BaaS (Backend-as-a-Service)** cung cấp sẵn:
    *   **Database**: Hệ quản trị cơ sở dữ liệu quan hệ mạnh mẽ **PostgreSQL**.
    *   **Auth**: Quản lý đăng ký, đăng nhập người dùng (Email, Password, Social Login).
    *   **Storage**: Lưu trữ file/ảnh tĩnh (nếu có).
    *   **Realtime**: Đồng bộ dữ liệu tức thời.
*   **Ưu điểm cực lớn cần nói khi thuyết trình**:
    *   *“Thay vì phải dựng thủ công một server Node.js/Express, viết API, kết nối DB, cấu hình JWT token cho việc bảo mật đăng nhập... nhóm em lựa chọn giải pháp Serverless với Supabase. Điều này giúp giảm thiểu 80% công sức dựng API server truyền thống mà ứng dụng vẫn đảm bảo tính an toàn dữ liệu, tính mở rộng tốt nhờ sử dụng cơ sở dữ liệu quan hệ PostgreSQL chính thống.”*

---

## PHẦN 2: THIẾT KẾ CƠ SỞ DỮ LIỆU (DATABASE SCHEMA)
Ứng dụng gồm 3 bảng nghiệp vụ đặt trong schema `public`, liên kết chặt chẽ với schema hệ thống `auth` (nơi lưu tài khoản người dùng đăng ký).

```
  +-----------------------+              +------------------------+
  |    auth.users (gốc)   |              |    public.profiles     |
  |  - id (UUID)          |<-- 1:1 ----|  - id (UUID - PK)      |
  |  - email              |              |  - user_id (UUID - FK) |
  |  - created_at         |              |  - name (TEXT)         |
  +-----------------------+              |  - avatar_url (TEXT)   |
                                         +------------------------+
                                                     |
                                                1:N (Khóa ngoại)
                                                     |
                             +-----------------------+-----------------------+
                             |                                               |
                             v                                               v
              +----------------------------+                  +----------------------------+
              |      public.favorites      |                  |    public.watch_history    |
              |  - id (BIGINT - PK)        |                  |  - id (BIGINT - PK)        |
              |  - profile_id (UUID - FK)  |                  |  - profile_id (UUID - FK)  |
              |  - movie_slug (TEXT)       |                  |  - movie_slug (TEXT)       |
              |  - movie_name (TEXT)       |                  |  - movie_name (TEXT)       |
              |  - movie_thumb (TEXT)      |                  |  - episode_name (TEXT)     |
              |                            |                  |  - duration_watched (INT)  |
              |                            |                  |  - total_duration (INT)    |
              +----------------------------+                  +----------------------------+
```

### 1. Bảng `profiles` (Hồ sơ người dùng)
*   **Vai trò**: Lưu trữ thông tin cá nhân hiển thị của người dùng (tên, avatar).
*   **Khóa ngoại (`user_id`)**: `user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE`.
    *   *Giải thích*: Cột `user_id` liên kết trực tiếp với tài khoản trong bảng xác thực gốc của Supabase (`auth.users`).
    *   *Ràng buộc `ON DELETE CASCADE`*: Khi tài khoản đăng nhập bị xóa khỏi hệ thống, hồ sơ tương ứng trong bảng `profiles` cũng tự động bị xóa theo để tránh rác dữ liệu.

### 2. Bảng `favorites` (Phim yêu thích / Watchlist)
*   **Vai trò**: Lưu trữ các phim người dùng đã nhấn "Lưu" để xem sau.
*   **Khóa ngoại (`profile_id`)**: Liên kết với bảng `profiles` chứ không liên kết thẳng với `auth.users`. Điều này cho phép mở rộng tính năng tạo nhiều Profile con sau này giống Netflix.
*   **Ràng buộc Unique**: `UNIQUE (profile_id, movie_slug)`.
    *   *Giải thích*: Đảm bảo một hồ sơ không bao giờ lưu trùng một bộ phim hai lần trong danh sách yêu thích. Nếu cố chèn dòng thứ hai trùng lặp, Database sẽ báo lỗi trùng khóa.

### 3. Bảng `watch_history` (Lịch sử xem phim)
*   **Vai trò**: Lưu trữ lịch sử và tiến độ xem phim chính xác đến từng giây.
*   **Cấu trúc quan trọng**:
    *   `duration_watched`: Số giây mà người dùng đã xem.
    *   `total_duration`: Tổng thời lượng phim bằng giây.
*   **Ràng buộc Unique**: `UNIQUE (profile_id, movie_slug)`.
    *   *Giải thích*: Tương tự bảng Favorites, đảm bảo mỗi bộ phim chỉ xuất hiện 1 dòng trong lịch sử của từng user. Khi người dùng xem tiếp bộ phim đó, thay vì chèn dòng mới, DB sẽ cập nhật (`UPSERT`) lại số giây mới và thời điểm xem gần nhất (`updated_at`).

---

## PHẦN 3: ĐIỂM SÁNG KỸ THUẬT (TRIGGER TỰ ĐỘNG TẠO PROFILE)

### 1. Tại sao cần Trigger?
Thông thường khi đăng ký tài khoản, client phải gửi 2 request: Request 1 tạo user trong Auth, sau đó nhận kết quả về và gửi tiếp Request 2 chèn thông tin vào bảng Profiles. Cách làm này vừa tốn băng thông, dễ xảy ra lỗi nếu request 2 thất bại.
Nhóm em giải quyết triệt để bằng **Database Trigger** trực tiếp dưới database.

### 2. Mã lệnh chi tiết & cách giải thích:

```sql
-- 1. Định nghĩa Hàm xử lý (Function)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, avatar_url)
  VALUES (
    new.id, -- new là dữ liệu user vừa được chèn vào bảng auth.users
    COALESCE(new.raw_user_meta_data->>'full_name', 'Mới gia nhập'), -- Lấy tên từ đăng ký hoặc đặt mặc định
    'https://api.dicebear.com/7.x/bottts/svg?seed=' || new.id -- Tạo avatar ngẫu nhiên theo ID user
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```
*   *Ý nghĩa*: Hàm này sẽ tự động được Database kích hoạt. Nó lấy ID của User mới đăng ký (`new.id`) chèn vào bảng `profiles`. Từ khóa `COALESCE` đảm bảo nếu không có tên thì sẽ lấy chuỗi mặc định `"Mới gia nhập"`.
*   `SECURITY DEFINER`: Chạy hàm này bằng quyền admin tối cao (bypass RLS) vì lúc này user mới chưa đăng nhập hoàn tất.

```sql
-- 2. Khởi chạy Trigger gắn vào bảng auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```
*   *Ý nghĩa*: Lắng nghe sự kiện: Ngay sau khi một bản ghi được chèn vào bảng `auth.users` (`AFTER INSERT ON auth.users`), áp dụng cho từng dòng (`FOR EACH ROW`), Database hãy kích hoạt hàm `handle_new_user()`.

---

## PHẦN 4: BẢO MẬT DỮ LIỆU TẦNG THẤP (ROW LEVEL SECURITY - RLS)

Đây là phần **dễ ăn điểm nhất** trước hội đồng giảng viên.

### 1. RLS là gì?
Ở các hệ thống cũ, việc bảo vệ dữ liệu phụ thuộc hoàn toàn vào Backend API (ví dụ viết code Node.js check `if (req.user.id !== post.userId)`). Nếu lập trình viên quên viết điều kiện này ở một API nào đó, tin tặc sẽ khai thác được lỗi IDOR (Insecure Direct Object Reference) để sửa dữ liệu người khác.
Supabase hỗ trợ RLS trực tiếp trên PostgreSQL. Khi bật RLS, database sẽ chặn toàn bộ các truy vấn trừ khi truy vấn đó thỏa mãn một quy tắc (Policy) bảo mật xác định.

### 2. Phân tích các chính sách Policy trong file SQL:
Nhóm em cấu hình RLS cho cả 3 bảng nghiệp vụ:
```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;
```

#### Ví dụ Policy cho bảng `profiles`:
```sql
CREATE POLICY "Users can view their own profiles" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);
```
*   *Giải thích*: Khi client thực hiện truy vấn `SELECT * FROM profiles`, Database PostgreSQL sẽ tự động kiểm tra xem ID người dùng đang đăng nhập (`auth.uid()`) có trùng khớp với giá trị lưu trong cột `user_id` hay không. Nếu trùng khớp mới trả về dữ liệu, ngược lại sẽ trả về mảng rỗng hoặc lỗi quyền truy cập.

#### Ví dụ Policy phức tạp hơn cho bảng `favorites` (Truy vấn lồng):
```sql
CREATE POLICY "Users can insert their own favorites" 
ON public.favorites FOR INSERT 
WITH CHECK (
  profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);
```
*   *Giải thích*: Khi chèn một bộ phim mới vào danh sách yêu thích, Database thực hiện câu lệnh kiểm tra phụ: Nó quét bảng `profiles` để tìm tất cả các Profile thuộc về User đang đăng nhập (`user_id = auth.uid()`). Nếu `profile_id` định chèn nằm trong danh sách Profile hợp lệ này thì hành động `INSERT` mới được duyệt.

---

## PHẦN 5: CÁCH CLIENT TRUY VẤN DB (CONNECTING CODE)

Bạn cần mở file [`dbServices.ts`](file:///d:/NetGaFlet_Project/netGaFlex-app/lib/dbServices.ts) để chỉ cho thầy cô thấy cách React Native gọi DB:

### 1. Lấy danh sách yêu thích (`getFavorites`):
```typescript
export async function getFavorites(profileId: string) {
  const { data, error } = await supabase
    .from('favorites')   -- Chỉ định bảng favorites
    .select('*')         -- Lấy tất cả các cột
    .eq('profile_id', profileId)  -- Điều kiện so khớp profileId
    .order('created_at', { ascending: false }); -- Sắp xếp mới nhất lên đầu
  return { data, error };
}
```

### 2. Cập nhật tiến độ xem phim (`saveWatchProgress`):
```typescript
export async function saveWatchProgress(
  profileId: string,
  movieSlug: string,
  movieName: string,
  episodeName: string,
  durationWatched: number,
  totalDuration: number
) {
  const { data, error } = await supabase
    .from('watch_history')
    .upsert(
      {
        profile_id: profileId,
        movie_slug: movieSlug,
        movie_name: movieName,
        episode_name: episodeName,
        duration_watched: durationWatched,
        total_duration: totalDuration,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'profile_id,movie_slug', -- Nếu trùng hai cột này thì update thay vì insert
      }
    )
    .select()
    .single();
  return { data, error };
}
```
*   *Giải thích kỹ thuật*: Sử dụng hàm `.upsert()` kết hợp cấu hình `onConflict` để hệ thống tự biết cập nhật dòng cũ thay vì tạo mới.

---

## PHẦN 6: CÁC CÂU HỎI THƯỜNG GẶP CỦA GIẢNG VIÊN & MẸO TRẢ LỜI

1.  **Câu hỏi: Tại sao không dùng MongoDB hay MySQL mà lại dùng Supabase PostgreSQL?**
    *   **Trả lời**: *"Dự án cần một hệ thống quản trị cơ sở dữ liệu quan hệ (Relational DB) để thiết kế các bảng có liên kết khóa ngoại rõ ràng nhằm tránh rác dữ liệu (ví dụ: profiles xóa thì history phải xóa theo). PostgreSQL là một RDBMS mã nguồn mở mạnh mẽ nhất hiện nay. Hơn nữa, Supabase cung cấp sẵn hạ tầng Cloud, quản lý Auth bảo mật cao và cơ chế RLS giúp nhóm em tối ưu hóa thời gian triển khai sản phẩm di động mà vẫn đạt chuẩn an toàn thông tin."*
2.  **Câu hỏi: Làm sao ứng dụng biết user nào đang gửi request mà thực thi RLS chính xác?**
    *   **Trả lời**: *"Khi client đăng nhập thành công qua Supabase Auth, SDK của Supabase trên thiết bị di động sẽ tự động lưu JWT token vào ổ nhớ cục bộ (`AsyncStorage`). Khi gửi bất kỳ câu truy vấn nào lên DB, SDK sẽ tự động đính kèm Token này dưới dạng Header Authorization Bearer. Ở phía Server, Supabase giải mã token để xác định ID người dùng đó và truyền ID đó vào hàm `auth.uid()` của PostgreSQL để so khớp các policy."*
3.  **Câu hỏi: Trigger có làm chậm DB không khi số lượng user tăng lên nhiều?**
    *   **Trả lời**: *"Dạ không, ngược lại trigger chạy ở mức tầng thấp nhất của DB nên tốc độ thực thi rất nhanh (vài mili-giây), giảm thiểu việc gửi đi gửi lại request mạng từ app di động của user lên server, qua đó tiết kiệm băng thông và tăng hiệu quả xử lý bất đồng bộ."*

---
**Chúc bạn có một phần báo cáo thành công xuất sắc ngày mai!**

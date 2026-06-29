# Lumi Beauty — phiên bản HTML / CSS / JavaScript thuần

Bản chuyển đổi từ dự án React + TypeScript gốc (`Beauty_and_Massage_App`) sang
**HTML + CSS + JavaScript thuần** (ES Modules), giữ nguyên thiết kế và toàn bộ
chức năng, không cần build, không cần cài đặt.

## Cách chạy

Vì dùng ES Modules (`import`/`export`), cần chạy qua một web server tĩnh
(mở trực tiếp `file://` sẽ bị chặn bởi CORS). Chọn một trong các cách:

```bash
# Cách 1 — Python (có sẵn trên hầu hết máy)
python3 -m http.server 5173
# rồi mở http://localhost:5173

# Cách 2 — Node
npx serve .

# Cách 3 — VS Code: cài extension "Live Server" rồi bấm "Go Live"
```

- Trang khách: `http://localhost:5173/#/`
- Trang quản trị: `http://localhost:5173/#/admin` (hoặc bấm nút **Admin** trên navbar)

## Cấu trúc thư mục

```
bella-luxe/
├── index.html          # Điểm vào: nạp font, icon, CSS, module JS
├── css/
│   ├── base.css        # Design tokens (biến màu/font), reset, nút, form, toast, animation
│   ├── user.css        # Navbar, hero, dịch vụ, gallery, review, đội ngũ, liên hệ, footer, modal
│   └── admin.css       # Layout admin, sidebar, dashboard, bảng, quản lý ảnh/dịch vụ
└── js/
    ├── data.js         # Dữ liệu mẫu + hàm tiện ích (vnd, esc, icon...)
    ├── store.js        # Quản lý state + lưu localStorage (thay cho useState)
    ├── ui.js           # Toast, refresh icon, scroll-reveal (IntersectionObserver)
    ├── booking.js      # Modal đặt lịch + validate
    ├── user.js         # Render & sự kiện trang khách
    ├── admin.js        # Render & sự kiện trang quản trị (4 tab)
    └── main.js         # Router theo hash (#/ và #/admin)
```

## Đã làm gì so với bản React

| Khía cạnh | Bản React gốc | Bản vanilla này |
|---|---|---|
| Khung | React + Vite + Tailwind + Framer Motion | HTML/CSS/JS thuần, không build |
| Icon | `lucide-react` | `lucide` (CDN UMD) — y hệt bộ icon |
| Animation cuộn | Framer Motion `whileInView` | IntersectionObserver + CSS transition |
| State | `useState` trong `App.tsx` (~1835 dòng) | `store.js` nhỏ gọn, có pub/sub |
| **Dữ liệu mất khi F5** | Có (chỉ ở RAM) | **Đã lưu localStorage** — không mất |
| **URL không đổi** | Có | **Router theo hash** `#/` và `#/admin` |
| Thông báo | chỉ có trạng thái "thành công" tĩnh | thêm **toast** + **validate form** |

## Gợi ý nâng cấp công nghệ (tuỳ mức độ)

1. **Backend thật — Supabase**: thay `localStorage` trong `store.js` bằng bảng
   `bookings`, `gallery`, `services`. Chỉ cần đổi các hàm `addBooking`,
   `updateBookingStatus`... thành lệnh gọi Supabase. Kèm **Supabase Storage**
   cho upload ảnh thật (hiện đang dùng ảnh mẫu).
2. **Xác thực**: thay nút Admin bằng đăng nhập thật (Supabase Auth / Firebase Auth),
   bảo vệ route `#/admin`.
3. **Form liên hệ / đặt lịch gửi email**: dùng **EmailJS** hoặc **Formspree**
   nếu chưa muốn dựng backend.
4. **Build & tối ưu**: bọc bằng **Vite** để minify, tách chunk, tối ưu ảnh.
5. **PWA**: thêm `manifest.json` + service worker để cài như app, chạy offline.
6. **SEO & chia sẻ**: thêm thẻ Open Graph, `sitemap.xml`, dữ liệu có cấu trúc
   `LocalBusiness` (schema.org).
7. **Triển khai**: deploy miễn phí lên **Netlify / Vercel / GitHub Pages**
   (kéo thả thư mục là chạy).

## Ghi chú

- Toàn bộ chuỗi do người dùng nhập đều được escape (`esc()`) trước khi chèn vào
  DOM để tránh XSS.
- Có hỗ trợ `prefers-reduced-motion`, focus bàn phím rõ ràng, responsive xuống mobile.
- Reset dữ liệu mẫu: mở DevTools Console gõ `localStorage.clear()` rồi tải lại.

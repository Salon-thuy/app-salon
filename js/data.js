// ============================================================
//  Lumi Beauty — data.js
//  Static seed data + small helpers (ES module)
// ============================================================

// ---- Helpers ----------------------------------------------------------------

/** Format a number as Vietnamese dong, e.g. 150000 -> "150.000₫" */
export const vnd = (n) => Number(n).toLocaleString("vi-VN") + "₫";

/** Escape user/text content before injecting into innerHTML (XSS-safe) */
export const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

/** Inline a Lucide icon. Requires the lucide UMD script to be loaded.
 *  We render a placeholder <i data-lucide="..."> that lucide.createIcons() upgrades. */
export const icon = (name, cls = "") =>
  `<i data-lucide="${name}" class="icon ${cls}"></i>`;

/** Today's date as YYYY-MM-DD (for booking date min / dashboard "today") */
export const todayISO = () => new Date().toISOString().split("T")[0];

// ---- Seed data --------------------------------------------------------------

export const SERVICES = [
  { id: "h1", name: "Cắt tóc thời trang", category: "hair", price: 150000, duration: "45 phút",
    description: "Tạo kiểu tóc hiện đại, phù hợp khuôn mặt và phong cách riêng của bạn.",
    image: "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=500&h=350&fit=crop&auto=format", icon: "scissors" },
  { id: "h2", name: "Nhuộm màu & Balayage", category: "hair", price: 800000, duration: "120 phút",
    description: "Kỹ thuật nhuộm chuyên nghiệp với màu sắc tự nhiên, bền và rạng rỡ.",
    image: "https://images.unsplash.com/photo-1554519934-e32b1629d9ee?w=500&h=350&fit=crop&auto=format", icon: "sparkles" },
  { id: "h3", name: "Uốn / Duỗi tóc", category: "hair", price: 600000, duration: "90 phút",
    description: "Công nghệ uốn duỗi hiện đại, không hại tóc, giữ nếp lâu đến 6 tháng.",
    image: "https://images.unsplash.com/photo-1629397685944-7073f5589754?w=500&h=350&fit=crop&auto=format", icon: "wind" },
  { id: "m1", name: "Massage thư giãn toàn thân", category: "massage", price: 350000, duration: "60 phút",
    description: "Xoa dịu căng thẳng, phục hồi năng lượng với liệu pháp massage toàn thân chuẩn spa.",
    image: "https://images.unsplash.com/photo-1745327883508-b6cd32e5dde5?w=500&h=350&fit=crop&auto=format", icon: "heart" },
  { id: "m2", name: "Massage đá nóng", category: "massage", price: 500000, duration: "75 phút",
    description: "Đá basalt núi lửa tự nhiên giúp thư giãn cơ sâu và cải thiện lưu thông máu.",
    image: "https://images.unsplash.com/photo-1696841212541-449ca29397cc?w=500&h=350&fit=crop&auto=format", icon: "flame" },
  { id: "m3", name: "Liệu pháp Aromatherapy", category: "massage", price: 450000, duration: "60 phút",
    description: "Tinh dầu thiên nhiên thuần khiết kết hợp massage nhẹ nhàng cho tâm hồn thư thái.",
    image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=500&h=350&fit=crop&auto=format", icon: "leaf" },
];

export const GALLERY_SEED = [
  { id: "g1", url: "https://images.unsplash.com/photo-1554519934-e32b1629d9ee?w=400&h=520&fit=crop&auto=format", category: "hair", caption: "Balayage tự nhiên" },
  { id: "g2", url: "https://images.unsplash.com/photo-1605980766335-d3a41c7332a1?w=400&h=300&fit=crop&auto=format", category: "hair", caption: "Tóc vàng óng ánh" },
  { id: "g3", url: "https://images.unsplash.com/photo-1696841212541-449ca29397cc?w=400&h=420&fit=crop&auto=format", category: "massage", caption: "Massage đá nóng" },
  { id: "g4", url: "https://images.unsplash.com/photo-1762745103248-093916cce084?w=400&h=520&fit=crop&auto=format", category: "hair", caption: "Tạo kiểu sang trọng" },
  { id: "g5", url: "https://images.unsplash.com/photo-1745327883508-b6cd32e5dde5?w=400&h=420&fit=crop&auto=format", category: "massage", caption: "Liệu pháp thư giãn" },
  { id: "g6", url: "https://images.unsplash.com/photo-1546877625-cb8c71916608?w=400&h=300&fit=crop&auto=format", category: "hair", caption: "Tóc xoăn bồng bềnh" },
  { id: "g7", url: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400&h=360&fit=crop&auto=format", category: "massage", caption: "Liệu pháp đá khoáng" },
  { id: "g8", url: "https://images.unsplash.com/photo-1629397685944-7073f5589754?w=400&h=520&fit=crop&auto=format", category: "hair", caption: "Tạo kiểu chuyên nghiệp" },
];

export const REVIEWS = [
  { name: "Phạm Thị Lan", role: "Khách hàng thân thiết", rating: 5, avatar: "PL",
    text: "Tóc tôi trông tuyệt vời sau khi làm tại đây! Nhân viên rất chuyên nghiệp, tỉ mỉ và luôn lắng nghe yêu cầu. Không gian cực kỳ thoải mái." },
  { name: "Nguyễn Văn Minh", role: "Khách hàng mới", rating: 5, avatar: "NM",
    text: "Dịch vụ massage đá nóng thực sự giúp tôi thư giãn hoàn toàn. Không gian yên tĩnh, sạch sẽ, nhân viên rất chuyên nghiệp. Sẽ quay lại!" },
  { name: "Trần Thị Thu Hà", role: "Khách hàng thân thiết", rating: 5, avatar: "TH",
    text: "Balayage của tôi rất tự nhiên và bền màu. Giá cả hợp lý với chất lượng nhận được. Đội ngũ nhân viên thân thiện và nhiệt tình. Rất hài lòng!" },
];

export const TEAM = [
  { name: "Nguyễn Thị Mai", role: "Trưởng Stylist", specialty: "Nhuộm màu & Balayage", years: 8, initials: "NM", color: "#C27A52" },
  { name: "Trần Văn Hùng", role: "Thợ Tạo Kiểu", specialty: "Cắt tóc Nam & Nữ", years: 5, initials: "TH", color: "#7FA882" },
  { name: "Lê Thị Hoa", role: "Chuyên viên Massage", specialty: "Liệu pháp trị liệu", years: 10, initials: "LH", color: "#C27A52" },
];

export const BOOKINGS_SEED = [
  { id: "b1", name: "Phạm Thị Lan", phone: "0901 234 567", service: "Nhuộm màu & Balayage", date: "2026-06-30", time: "09:00", staff: "Nguyễn Thị Mai", status: "confirmed" },
  { id: "b2", name: "Nguyễn Văn Minh", phone: "0912 345 678", service: "Massage đá nóng", date: "2026-06-30", time: "10:30", staff: "Lê Thị Hoa", status: "pending" },
  { id: "b3", name: "Trần Thị Thu", phone: "0923 456 789", service: "Cắt tóc thời trang", date: "2026-06-30", time: "14:00", staff: "Trần Văn Hùng", status: "completed" },
  { id: "b4", name: "Lê Văn Nam", phone: "0934 567 890", service: "Massage thư giãn toàn thân", date: "2026-07-01", time: "11:00", staff: "Lê Thị Hoa", status: "pending" },
  { id: "b5", name: "Hoàng Thị Yến", phone: "0945 678 901", service: "Uốn / Duỗi tóc", date: "2026-07-01", time: "15:30", staff: "Nguyễn Thị Mai", status: "confirmed" },
  { id: "b6", name: "Đặng Minh Tuấn", phone: "0956 789 012", service: "Liệu pháp Aromatherapy", date: "2026-07-02", time: "09:30", staff: "Lê Thị Hoa", status: "pending" },
];

export const TIME_SLOTS = ["09:00","09:30","10:00","10:30","11:00","11:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00"];

export const STATUS_MAP = {
  pending:   { label: "Chờ xác nhận", bg: "#FEF3C7", color: "#D97706" },
  confirmed: { label: "Đã xác nhận",  bg: "#D1FAE5", color: "#059669" },
  completed: { label: "Hoàn thành",   bg: "#DBEAFE", color: "#2563EB" },
  cancelled: { label: "Đã huỷ",       bg: "#FEE2E2", color: "#DC2626" },
};

export const SAMPLE_UPLOADS = [
  "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=400&h=380&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1598901986949-f593ff2a31a6?w=400&h=360&fit=crop&auto=format",
];

// ============================================================
//  Lumi Beauty — user.js
//  Renders the public landing page and wires interactions.
// ============================================================

import { SERVICES, REVIEWS, TEAM, vnd, esc, icon } from "./data.js";
import { store } from "./store.js";
import { refreshIcons, observeReveals, toast } from "./ui.js";
import { openBooking } from "./booking.js";

const NAV_LINKS = [
  { label: "Dịch vụ", href: "#services" },
  { label: "Bộ sưu tập", href: "#gallery" },
  { label: "Đội ngũ", href: "#team" },
  { label: "Liên hệ", href: "#contact" },
];

// ---- Section renderers ------------------------------------------------------

function navbar() {
  return `
  <header class="navbar" id="navbar">
    <div class="navbar__inner">
      <a href="#top" class="brand">
        <span class="brand__mark">${icon("scissors")}</span>
        <span class="brand__name">Lumi Beauty</span>
      </a>
      <nav class="nav-links">
        ${NAV_LINKS.map((l) => `<a href="${l.href}">${l.label}</a>`).join("")}
      </nav>
      <div class="nav-actions">
        <button class="nav-admin-btn" data-go-admin>Admin</button>
        <button class="btn btn--primary" data-book>Đặt lịch</button>
      </div>
      <button class="nav-toggle" data-toggle-menu aria-label="Mở menu">${icon("menu")}</button>
    </div>
    <div class="mobile-menu hidden" id="mobile-menu">
      ${NAV_LINKS.map((l) => `<a href="${l.href}" data-close-menu>${l.label}</a>`).join("")}
      <div class="mobile-menu__actions">
        <button class="nav-admin-btn" data-go-admin style="border-color:var(--border);color:var(--muted-foreground)">Admin</button>
        <button class="btn btn--primary" data-book data-close-menu>Đặt lịch</button>
      </div>
    </div>
  </header>`;
}

function hero() {
  const stats = [
    { val: "5K+", label: "Khách hàng" },
    { val: "8+", label: "Năm kinh nghiệm" },
    { val: "4.9★", label: "Đánh giá" },
  ];
  return `
  <section class="hero" id="top">
    <div class="hero__bg">
      <img src="https://images.unsplash.com/photo-1626383137804-ff908d2753a2?w=1920&h=1080&fit=crop&auto=format" alt="Không gian Lumi Beauty Salon" />
      <div class="hero__overlay"></div>
    </div>
    <div class="hero__content">
      <p class="hero__eyebrow">Vẻ đẹp &amp; Wellness — Hà Nội</p>
      <h1 class="hero__title">Tỏa sáng mỗi<br><em>ngày</em></h1>
      <p class="hero__lead">Trải nghiệm dịch vụ làm tóc cao cấp và massage trị liệu chuyên nghiệp tại không gian sang trọng và thư thái.</p>
      <div class="hero__cta">
        <button class="btn btn--primary btn--lg" data-book>Đặt lịch ngay</button>
        <a class="btn btn--ghost btn--lg" href="#services">Khám phá dịch vụ</a>
      </div>
      <div class="hero__stats">
        ${stats
          .map(
            (s) => `<div>
              <div class="hero__stat-val">${s.val}</div>
              <div class="hero__stat-label">${s.label}</div>
            </div>`
          )
          .join("")}
      </div>
    </div>
    <div class="hero__scroll">${icon("chevron-down")}</div>
  </section>`;
}

function serviceCard(s, i, accent) {
  return `
  <div class="svc-card reveal" style="--reveal-delay:${i * 0.1}s">
    <div class="svc-card__media">
      <img src="${s.image}" alt="${esc(s.name)}" loading="lazy" />
      <div class="svc-card__icon" style="background:${accent}">${icon(s.icon)}</div>
    </div>
    <div class="svc-card__body">
      <h3 class="svc-card__name">${esc(s.name)}</h3>
      <p class="svc-card__desc">${esc(s.description)}</p>
      <div class="svc-card__foot">
        <div>
          <div class="svc-card__price" style="color:${accent}">${vnd(s.price)}</div>
          <div class="svc-card__dur">${icon("clock")}${esc(s.duration)}</div>
        </div>
        <button class="btn btn--primary" style="background:${accent};font-size:.75rem;padding:.5rem 1rem" data-book-service="${s.id}">Đặt lịch</button>
      </div>
    </div>
  </div>`;
}

function services(serviceList) {
  const hair = serviceList.filter((s) => s.category === "hair");
  const massage = serviceList.filter((s) => s.category === "massage");
  return `
  <section class="section" id="services">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">Dịch vụ của chúng tôi</p>
        <h2 class="section-title">Chăm sóc toàn diện</h2>
        <p class="section-sub">Từ tạo kiểu tóc đến liệu pháp massage trị liệu — chúng tôi mang đến trải nghiệm làm đẹp hoàn hảo cho bạn.</p>
      </div>
      <div class="svc-group">
        <div class="svc-group__head">
          <span class="svc-group__rule" style="background:#C27A52"></span>
          <h3 class="svc-group__title" style="color:#C27A52">Làm tóc</h3>
        </div>
        <div class="svc-grid">${hair.map((s, i) => serviceCard(s, i, "#C27A52")).join("")}</div>
      </div>
      <div class="svc-group">
        <div class="svc-group__head">
          <span class="svc-group__rule" style="background:#7FA882"></span>
          <h3 class="svc-group__title" style="color:#7FA882">Massage trị liệu</h3>
        </div>
        <div class="svc-grid">${massage.map((s, i) => serviceCard(s, i, "#7FA882")).join("")}</div>
      </div>
    </div>
  </section>`;
}

function galleryItem(item) {
  return `
  <div class="masonry__item" data-cat="${item.category}">
    <img src="${item.url}" alt="${esc(item.caption)}" loading="lazy" />
    <div class="masonry__caption"><span>${esc(item.caption)}</span></div>
  </div>`;
}

function gallery(items) {
  return `
  <section class="section section--surface" id="gallery">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">Bộ sưu tập</p>
        <h2 class="section-title">Tác phẩm của chúng tôi</h2>
        <p class="section-sub">Mỗi kiểu tóc và liệu pháp đều là một tác phẩm nghệ thuật, được thực hiện với sự tận tâm và chuyên nghiệp.</p>
      </div>
      <div class="gallery-tabs" id="gallery-tabs">
        <button class="chip is-active" data-filter="all">Tất cả</button>
        <button class="chip" data-filter="hair">Làm tóc</button>
        <button class="chip" data-filter="massage">Massage</button>
      </div>
      <div class="masonry" id="masonry">${items.map(galleryItem).join("")}</div>
    </div>
  </section>`;
}

function testimonials() {
  return `
  <section class="section">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">Đánh giá</p>
        <h2 class="section-title">Khách hàng nói gì</h2>
      </div>
      <div class="review-grid">
        ${REVIEWS.map(
          (r, i) => `
          <div class="review-card reveal" style="--reveal-delay:${i * 0.12}s">
            <div class="review-card__stars">${Array.from({ length: r.rating }).map(() => icon("star")).join("")}</div>
            <p class="review-card__text">&ldquo;${esc(r.text)}&rdquo;</p>
            <div class="review-card__author">
              <div class="avatar">${esc(r.avatar)}</div>
              <div>
                <div class="review-card__name">${esc(r.name)}</div>
                <div class="review-card__role">${esc(r.role)}</div>
              </div>
            </div>
          </div>`
        ).join("")}
      </div>
    </div>
  </section>`;
}

function team() {
  return `
  <section class="section section--surface" id="team">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">Đội ngũ</p>
        <h2 class="section-title">Những nghệ nhân của chúng tôi</h2>
        <p class="section-sub">Đội ngũ chuyên gia giàu kinh nghiệm, luôn tận tâm mang đến vẻ đẹp tốt nhất cho bạn.</p>
      </div>
      <div class="team-grid">
        ${TEAM.map(
          (m, i) => `
          <div class="team-card reveal" style="--reveal-delay:${i * 0.12}s">
            <div class="team-card__photo" style="background:linear-gradient(135deg, ${m.color}, ${m.color}88)">${esc(m.initials)}</div>
            <h3 class="team-card__name">${esc(m.name)}</h3>
            <div class="team-card__role" style="color:${m.color}">${esc(m.role)}</div>
            <p class="team-card__spec">${esc(m.specialty)}</p>
            <div class="team-card__years">${icon("award")}${m.years} năm kinh nghiệm</div>
          </div>`
        ).join("")}
      </div>
    </div>
  </section>`;
}

function contact() {
  const info = [
    { ic: "map-pin", label: "Địa chỉ", value: "123 Đường Trần Phú, Phường 4, Quận 5, TP. Hà Nội" },
    { ic: "phone", label: "Điện thoại", value: "0901 234 567 · 0912 345 678" },
    { ic: "mail", label: "Email", value: "lumibeauty@gmail.com" },
    { ic: "clock", label: "Giờ mở cửa", value: "Thứ 2 – Chủ nhật: 8:00 – 20:00" },
  ];
  return `
  <section class="section" id="contact">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">Liên hệ</p>
        <h2 class="section-title">Kết nối với chúng tôi</h2>
        <p class="section-sub">Có thắc mắc? Hãy để lại tin nhắn hoặc liên hệ trực tiếp — chúng tôi luôn sẵn sàng.</p>
      </div>
      <div class="contact-grid">
        <div class="contact-form" id="contact-card">
          <form id="contact-form" novalidate>
            <h3 class="contact-form__title">Gửi tin nhắn</h3>
            <div class="field-row">
              <div class="field"><label class="field-label">Họ tên</label><input class="input" name="name" type="text" placeholder="Nguyễn Văn A" required /></div>
              <div class="field"><label class="field-label">Điện thoại</label><input class="input" name="phone" type="tel" placeholder="0901 234 567" required /></div>
            </div>
            <div class="field"><label class="field-label">Email</label><input class="input" name="email" type="email" placeholder="email@example.com" /></div>
            <div class="field"><label class="field-label">Chủ đề</label>
              <select class="select" name="topic">
                <option>Tư vấn dịch vụ</option><option>Hỏi về giá cả</option><option>Góp ý &amp; Khiếu nại</option><option>Hợp tác kinh doanh</option><option>Khác</option>
              </select>
            </div>
            <div class="field"><label class="field-label">Tin nhắn</label><textarea class="textarea" name="message" rows="4" placeholder="Nhập nội dung tin nhắn..." required></textarea></div>
            <button type="submit" class="btn btn--primary btn--block">Gửi tin nhắn</button>
          </form>
        </div>
        <div>
          <h3 class="contact-info__title">Thông tin liên hệ</h3>
          ${info
            .map(
              (it) => `
            <div class="contact-info__item">
              <div class="contact-info__icon">${icon(it.ic)}</div>
              <div>
                <div class="contact-info__label">${it.label}</div>
                <div class="contact-info__value">${esc(it.value)}</div>
              </div>
            </div>`
            )
            .join("")}
          <div class="contact-map">
            <img src="https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=700&h=300&fit=crop&auto=format" alt="Vị trí Lumi Beauty" loading="lazy" />
            <div class="contact-map__pin"><div>${icon("map-pin")}<span>Lumi Beauty — Hà Nội</span></div></div>
          </div>
          <div class="contact-social">
            ${["Facebook", "Instagram", "TikTok", "Zalo"].map((s) => `<a href="#" data-noop>${s}</a>`).join("")}
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

function footer() {
  const svc = ["Cắt tóc thời trang", "Nhuộm màu & Balayage", "Uốn / Duỗi tóc", "Massage toàn thân", "Massage đá nóng", "Aromatherapy"];
  const social = ["Facebook", "Instagram", "TikTok", "Zalo OA"];
  return `
  <footer class="footer section--dark">
    <div class="container">
      <div class="footer__grid">
        <div>
          <div class="brand">
            <span class="brand__mark" style="width:1.75rem;height:1.75rem">${icon("scissors")}</span>
            <span class="footer__brand-name">Lumi Beauty</span>
          </div>
          <p class="footer__about">Nơi vẻ đẹp và sức khỏe hòa quyện. Chúng tôi cam kết mang đến trải nghiệm làm đẹp đẳng cấp cho mọi khách hàng.</p>
          <div class="footer__status"><span class="footer__dot"></span><span>Đang mở cửa: 8:00 – 20:00 hàng ngày</span></div>
        </div>
        <div>
          <div class="footer__col-title">Dịch vụ</div>
          ${svc.map((s) => `<span class="footer__link">${esc(s)}</span>`).join("")}
        </div>
        <div>
          <div class="footer__col-title">Kết nối</div>
          ${social.map((s) => `<span class="footer__link">${esc(s)}</span>`).join("")}
          <div class="footer__hotline">
            <div class="footer__hotline-label">Hotline</div>
            <div class="footer__hotline-num">0901 234 567</div>
          </div>
        </div>
      </div>
      <div class="footer__bottom">
        <p class="footer__copy">© 2026 Lumi Beauty. Tất cả quyền được bảo lưu.</p>
        <div class="footer__legal"><span>Chính sách bảo mật</span><span>Điều khoản sử dụng</span></div>
      </div>
    </div>
  </footer>`;
}

// ---- Main render + wiring ---------------------------------------------------

export function renderUser(root, { onAdmin }) {
  const { gallery: galleryItems, services: serviceList } = store.state;

  root.innerHTML =
    navbar() +
    hero() +
    services(serviceList) +
    gallery(galleryItems) +
    testimonials() +
    team() +
    contact() +
    footer();

  refreshIcons();
  observeReveals(root);
  window.scrollTo(0, 0);

  // Navbar scroll state
  const nav = root.querySelector("#navbar");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 50);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu
  const menu = root.querySelector("#mobile-menu");
  root.querySelector("[data-toggle-menu]")?.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  });
  root.querySelectorAll("[data-close-menu]").forEach((el) =>
    el.addEventListener("click", () => menu.classList.add("hidden"))
  );

  // Booking buttons (generic + per-service)
  root.querySelectorAll("[data-book]").forEach((b) =>
    b.addEventListener("click", () => openBooking())
  );
  root.querySelectorAll("[data-book-service]").forEach((b) =>
    b.addEventListener("click", () => {
      const svc = SERVICES.find((s) => s.id === b.dataset.bookService);
      openBooking(svc || null);
    })
  );

  // Admin entry
  root.querySelectorAll("[data-go-admin]").forEach((b) =>
    b.addEventListener("click", onAdmin)
  );

  // Gallery filter
  const tabs = root.querySelector("#gallery-tabs");
  tabs?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-filter]");
    if (!btn) return;
    tabs.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-active"));
    btn.classList.add("is-active");
    const f = btn.dataset.filter;
    root.querySelectorAll("#masonry .masonry__item").forEach((item) => {
      item.classList.toggle("hidden", f !== "all" && item.dataset.cat !== f);
    });
  });

  // Contact form
  const cform = root.querySelector("#contact-form");
  cform?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(cform);
    if (!fd.get("name").trim() || !fd.get("phone").trim() || !fd.get("message").trim()) {
      toast("Vui lòng điền họ tên, điện thoại và nội dung.", "error");
      return;
    }
    const card = root.querySelector("#contact-card");
    card.innerHTML = `
      <div class="form-success">
        <div class="form-success__check">${icon("check")}</div>
        <h3>Đã gửi thành công!</h3>
        <p>Chúng tôi sẽ phản hồi trong vòng 24 giờ.</p>
        <button class="form-success__again" id="contact-again">Gửi tin nhắn khác</button>
      </div>`;
    refreshIcons();
    toast("Tin nhắn đã được gửi.");
    card.querySelector("#contact-again").addEventListener("click", () => renderUser(root, { onAdmin }));
  });

  // No-op anchors (social) shouldn't jump
  root.querySelectorAll('[data-noop]').forEach((a) =>
    a.addEventListener("click", (e) => e.preventDefault())
  );
}

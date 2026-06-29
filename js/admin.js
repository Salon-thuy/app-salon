// ============================================================
//  Lumi Beauty — admin.js
//  Admin console: sidebar + dashboard / bookings / gallery / services.
// ============================================================

import { STATUS_MAP, SAMPLE_UPLOADS, vnd, esc, icon, todayISO } from "./data.js";
import { store } from "./store.js";
import { refreshIcons, toast } from "./ui.js";

const TABS = [
  { tab: "dashboard", label: "Tổng quan", ic: "layout-dashboard" },
  { tab: "bookings", label: "Lịch hẹn", ic: "book-open" },
  { tab: "gallery", label: "Thư viện ảnh", ic: "image" },
  { tab: "services", label: "Dịch vụ", ic: "settings-2" },
];

let activeTab = "dashboard";
let sidebarOpen = false;
// transient UI state (kept out of the persistent store)
let bookingSearch = "";
let bookingStatusFilter = "all";
let galleryFilter = "all";
let editingServiceId = null;

// ---- Small helpers ----------------------------------------------------------

function badge(status) {
  const m = STATUS_MAP[status] || STATUS_MAP.pending;
  return `<span class="badge" style="background:${m.bg};color:${m.color}">${m.label}</span>`;
}

// ---- Tab renderers ----------------------------------------------------------

function dashboardTab() {
  const { bookings, gallery } = store.state;
  const today = bookings.filter((b) => b.date === todayISO());
  const stats = [
    { label: "Lịch hôm nay", value: today.length, ic: "calendar", color: "#C27A52", bg: "#EDCDB0" },
    { label: "Tổng lịch hẹn", value: bookings.length, ic: "book-open", color: "#7FA882", bg: "#C8DEC9" },
    { label: "Khách tháng này", value: "247", ic: "users", color: "#C27A52", bg: "#EDCDB0" },
    { label: "Doanh thu tháng", value: "18.4M₫", ic: "trending-up", color: "#7FA882", bg: "#C8DEC9" },
  ];
  const todayRows = today.length
    ? today
        .map(
          (b) => `
        <div class="dash-list__row">
          <div class="dash-list__time">${esc(b.time)}</div>
          <div class="dash-list__main">
            <div class="dash-list__name">${esc(b.name)}</div>
            <div class="dash-list__sub">${esc(b.service)} · ${esc(b.staff)}</div>
          </div>
          ${badge(b.status)}
        </div>`
        )
        .join("")
    : `<div class="table-empty">Chưa có lịch hẹn nào cho hôm nay.</div>`;

  return `
  <div class="dash">
    <div class="dash-stats">
      ${stats
        .map(
          (s) => `
        <div class="stat-card">
          <div class="stat-card__icon" style="background:${s.bg};color:${s.color}">${icon(s.ic)}</div>
          <div class="stat-card__value" style="color:${s.color}">${s.value}</div>
          <div class="stat-card__label">${s.label}</div>
        </div>`
        )
        .join("")}
    </div>
    <div class="panel">
      <div class="panel__head">
        <h3 class="panel__title">Lịch hẹn hôm nay</h3>
        <span class="panel__meta">${today.length} lịch</span>
      </div>
      <div class="dash-list">${todayRows}</div>
    </div>
    <div class="panel">
      <div class="panel__head"><h3 class="panel__title">Ảnh mới nhất</h3></div>
      <div class="dash-thumbs">
        ${gallery
          .slice(-4)
          .reverse()
          .map((g) => `<div class="dash-thumbs__item"><img src="${g.url}" alt="${esc(g.caption)}" loading="lazy" /></div>`)
          .join("")}
      </div>
    </div>
  </div>`;
}

function bookingsTab() {
  const q = bookingSearch.toLowerCase();
  const rows = store.state.bookings.filter((b) => {
    const matchSearch =
      b.name.toLowerCase().includes(q) || b.service.toLowerCase().includes(q);
    const matchStatus = bookingStatusFilter === "all" || b.status === bookingStatusFilter;
    return matchSearch && matchStatus;
  });

  const statusOptions = (cur) =>
    Object.entries(STATUS_MAP)
      .map(([k, v]) => `<option value="${k}" ${k === cur ? "selected" : ""}>${v.label}</option>`)
      .join("");

  const body = rows.length
    ? rows
        .map(
          (b) => `
      <tr>
        <td><div class="cell-strong">${esc(b.name)}</div><div class="cell-muted">${esc(b.phone)}</div></td>
        <td>${esc(b.service)}</td>
        <td><div>${esc(b.date)}</div><div class="cell-mono">${esc(b.time)}</div></td>
        <td>${esc(b.staff)}</td>
        <td>${badge(b.status)}</td>
        <td><select class="status-select" data-status-for="${b.id}">${statusOptions(b.status)}</select></td>
      </tr>`
        )
        .join("")
    : "";

  return `
  <div>
    <div class="bookings-toolbar">
      <div class="search-box">
        ${icon("search")}
        <input class="input" id="booking-search" type="text" placeholder="Tìm kiếm khách hàng, dịch vụ..." value="${esc(bookingSearch)}" />
      </div>
      <select class="select" id="booking-status-filter">
        <option value="all" ${bookingStatusFilter === "all" ? "selected" : ""}>Tất cả trạng thái</option>
        ${Object.entries(STATUS_MAP)
          .map(([k, v]) => `<option value="${k}" ${bookingStatusFilter === k ? "selected" : ""}>${v.label}</option>`)
          .join("")}
      </select>
    </div>
    <div class="table-wrap">
      <div class="table-scroll">
        <table class="data-table">
          <thead><tr>
            ${["Khách hàng", "Dịch vụ", "Ngày / Giờ", "Kỹ thuật viên", "Trạng thái", "Cập nhật"]
              .map((h) => `<th>${h}</th>`)
              .join("")}
          </tr></thead>
          <tbody>${body}</tbody>
        </table>
        ${rows.length ? "" : `<div class="table-empty">Không tìm thấy kết quả phù hợp.</div>`}
      </div>
    </div>
  </div>`;
}

function galleryTab() {
  const { gallery } = store.state;
  const items = galleryFilter === "all" ? gallery : gallery.filter((g) => g.category === galleryFilter);
  const tag = (cat) =>
    cat === "hair"
      ? `<span class="gal-item__tag" style="background:#EDCDB0;color:#C27A52">Tóc</span>`
      : `<span class="gal-item__tag" style="background:#C8DEC9;color:#7FA882">Massage</span>`;

  return `
  <div>
    <div class="gal-toolbar">
      <div class="gal-toolbar__chips" id="gal-chips">
        <button class="chip chip--sm ${galleryFilter === "all" ? "is-active" : ""}" data-gfilter="all">Tất cả</button>
        <button class="chip chip--sm ${galleryFilter === "hair" ? "is-active" : ""}" data-gfilter="hair">Tóc</button>
        <button class="chip chip--sm ${galleryFilter === "massage" ? "is-active" : ""}" data-gfilter="massage">Massage</button>
      </div>
      <button class="btn btn--primary gal-toolbar__upload" id="gal-upload">${icon("upload")} Tải ảnh lên</button>
    </div>
    <p class="gal-count">${items.length} ảnh ·
      ${gallery.filter((g) => g.category === "hair").length} tóc ·
      ${gallery.filter((g) => g.category === "massage").length} massage</p>
    <div class="gal-grid" id="gal-grid">
      ${items
        .map(
          (item) => `
        <div class="gal-item">
          <img src="${item.url}" alt="${esc(item.caption)}" loading="lazy" />
          <div class="gal-item__overlay">
            <p class="gal-item__cap">${esc(item.caption)}</p>
            ${tag(item.category)}
            <button class="gal-item__del" data-del="${item.id}" aria-label="Xoá ảnh">${icon("trash-2")}</button>
          </div>
        </div>`
        )
        .join("")}
      <button class="gal-add" id="gal-add">${icon("plus")}<span>Thêm ảnh</span></button>
    </div>
  </div>`;
}

function servicesTab() {
  const { services } = store.state;
  const cats = [
    { cat: "hair", title: "Dịch vụ làm tóc", color: "#C27A52" },
    { cat: "massage", title: "Dịch vụ massage trị liệu", color: "#7FA882" },
  ];
  const row = (s, color) => {
    const editing = editingServiceId === s.id;
    const priceArea = editing
      ? `<div class="svc-row__editing">
           <input class="input" type="number" id="price-input-${s.id}" value="${s.price}" />
           <button class="icon-btn--save" data-save="${s.id}" aria-label="Lưu">${icon("check")}</button>
           <button class="icon-btn icon-btn--cancel" data-cancel aria-label="Huỷ">${icon("x")}</button>
         </div>`
      : `<div class="svc-row__price-view">
           <div class="svc-row__price" style="color:${color}">${vnd(s.price)}</div>
           <button class="svc-row__edit-btn" data-edit="${s.id}" aria-label="Sửa giá">${icon("pencil")}</button>
         </div>`;
    return `
      <div class="svc-row">
        <img class="svc-row__thumb" src="${s.image}" alt="${esc(s.name)}" loading="lazy" />
        <div class="svc-row__main">
          <div class="svc-row__name">${esc(s.name)}</div>
          <div class="svc-row__dur">${esc(s.duration)}</div>
        </div>
        ${priceArea}
      </div>`;
  };

  return `
  <div class="svc-manage">
    ${cats
      .map(
        (c) => `
      <div class="panel svc-panel">
        <div class="svc-panel__head">
          <span class="svc-panel__bar" style="background:${c.color}"></span>
          <h3 class="svc-panel__title">${c.title}</h3>
        </div>
        <div>${services.filter((s) => s.category === c.cat).map((s) => row(s, c.color)).join("")}</div>
      </div>`
      )
      .join("")}
  </div>`;
}

function tabContent() {
  switch (activeTab) {
    case "bookings": return bookingsTab();
    case "gallery": return galleryTab();
    case "services": return servicesTab();
    default: return dashboardTab();
  }
}

// ---- Shell + wiring ---------------------------------------------------------

export function renderAdmin(root, { onUser }) {
  root.innerHTML = `
  <div class="admin">
    <aside class="admin-sidebar ${sidebarOpen ? "is-open" : ""}" id="admin-sidebar">
      <div class="admin-sidebar__head">
        <span class="brand__mark">${icon("scissors")}</span>
        <div>
          <div class="admin-sidebar__brand-name">Lumi Beauty</div>
          <div class="admin-sidebar__brand-sub">Cổng quản trị</div>
        </div>
      </div>
      <nav class="admin-nav" id="admin-nav">
        ${TABS.map(
          (t) => `<button class="admin-nav__item ${t.tab === activeTab ? "is-active" : ""}" data-tab="${t.tab}">${icon(t.ic)}${t.label}</button>`
        ).join("")}
      </nav>
      <div class="admin-sidebar__foot">
        <button class="admin-sidebar__exit" id="admin-exit">${icon("log-out")} Xem trang khách</button>
      </div>
    </aside>
    ${sidebarOpen ? `<div class="admin-backdrop" id="admin-backdrop"></div>` : ""}
    <div class="admin-main">
      <header class="admin-topbar">
        <button class="admin-topbar__menu" id="admin-menu" aria-label="Mở menu">${icon("menu")}</button>
        <h1 class="admin-topbar__title">${TABS.find((t) => t.tab === activeTab)?.label || ""}</h1>
        <div class="admin-topbar__user">
          <div class="admin-topbar__avatar">A</div><span>Admin</span>
        </div>
      </header>
      <main class="admin-content" id="admin-content">${tabContent()}</main>
    </div>
  </div>`;

  refreshIcons();
  wire(root, { onUser });
}

function rerender(root, ctx) {
  // Re-render just the content area + topbar title for snappy tab switches.
  const content = root.querySelector("#admin-content");
  if (content) {
    content.innerHTML = tabContent();
    root.querySelector(".admin-topbar__title").textContent =
      TABS.find((t) => t.tab === activeTab)?.label || "";
    root.querySelectorAll(".admin-nav__item").forEach((el) =>
      el.classList.toggle("is-active", el.dataset.tab === activeTab)
    );
    refreshIcons();
    wireContent(root, ctx);
  } else {
    renderAdmin(root, ctx);
  }
}

function wire(root, ctx) {
  const { onUser } = ctx;

  // Sidebar nav
  root.querySelector("#admin-nav").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-tab]");
    if (!btn) return;
    activeTab = btn.dataset.tab;
    sidebarOpen = false;
    renderAdmin(root, ctx);
  });

  // Mobile drawer
  root.querySelector("#admin-menu")?.addEventListener("click", () => {
    sidebarOpen = true;
    renderAdmin(root, ctx);
  });
  root.querySelector("#admin-backdrop")?.addEventListener("click", () => {
    sidebarOpen = false;
    renderAdmin(root, ctx);
  });

  // Exit to user view
  root.querySelector("#admin-exit").addEventListener("click", onUser);

  wireContent(root, ctx);
}

function wireContent(root, ctx) {
  // ---- Bookings tab ----
  const search = root.querySelector("#booking-search");
  if (search) {
    search.addEventListener("input", (e) => {
      bookingSearch = e.target.value;
      // Re-render content but keep focus + caret in the search box.
      const pos = e.target.selectionStart;
      rerender(root, ctx);
      const again = root.querySelector("#booking-search");
      if (again) {
        again.focus();
        again.setSelectionRange(pos, pos);
      }
    });
  }
  root.querySelector("#booking-status-filter")?.addEventListener("change", (e) => {
    bookingStatusFilter = e.target.value;
    rerender(root, ctx);
  });
  root.querySelectorAll("[data-status-for]").forEach((sel) =>
    sel.addEventListener("change", (e) => {
      store.updateBookingStatus(sel.dataset.statusFor, e.target.value);
      toast("Đã cập nhật trạng thái lịch hẹn.");
      rerender(root, ctx);
    })
  );

  // ---- Gallery tab ----
  root.querySelector("#gal-chips")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-gfilter]");
    if (!btn) return;
    galleryFilter = btn.dataset.gfilter;
    rerender(root, ctx);
  });
  const doUpload = () => {
    const url = SAMPLE_UPLOADS[Math.floor(Math.random() * SAMPLE_UPLOADS.length)];
    store.addGalleryItem({ url, category: "hair", caption: "Ảnh mới tải lên" });
    toast("Đã thêm ảnh vào thư viện.");
    rerender(root, ctx);
  };
  root.querySelector("#gal-upload")?.addEventListener("click", doUpload);
  root.querySelector("#gal-add")?.addEventListener("click", doUpload);
  root.querySelectorAll("[data-del]").forEach((btn) =>
    btn.addEventListener("click", () => {
      store.removeGalleryItem(btn.dataset.del);
      toast("Đã xoá ảnh.", "info");
      rerender(root, ctx);
    })
  );

  // ---- Services tab ----
  root.querySelectorAll("[data-edit]").forEach((btn) =>
    btn.addEventListener("click", () => {
      editingServiceId = btn.dataset.edit;
      rerender(root, ctx);
      root.querySelector(`#price-input-${editingServiceId}`)?.focus();
    })
  );
  root.querySelector("[data-cancel]")?.addEventListener("click", () => {
    editingServiceId = null;
    rerender(root, ctx);
  });
  root.querySelectorAll("[data-save]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const id = btn.dataset.save;
      const input = root.querySelector(`#price-input-${id}`);
      const price = Math.max(0, Number(input?.value) || 0);
      store.updateServicePrice(id, price);
      editingServiceId = null;
      toast("Đã cập nhật giá dịch vụ.");
      rerender(root, ctx);
    })
  );
}

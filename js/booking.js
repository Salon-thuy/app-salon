// ============================================================
//  Lumi Beauty — booking.js
//  Booking modal: open/close, validation, persist to store.
// ============================================================

import { SERVICES, TEAM, TIME_SLOTS, vnd, esc, icon, todayISO } from "./data.js";
import { store } from "./store.js";
import { refreshIcons, toast } from "./ui.js";

let overlay = null;

function closeBooking() {
  if (!overlay) return;
  overlay.remove();
  overlay = null;
  document.body.style.overflow = "";
}

function serviceOptions(selectedId) {
  const group = (cat, label) =>
    `<optgroup label="${label}">${SERVICES.filter((s) => s.category === cat)
      .map(
        (s) =>
          `<option value="${s.id}" ${s.id === selectedId ? "selected" : ""}>${esc(s.name)} — ${vnd(s.price)}</option>`
      )
      .join("")}</optgroup>`;
  return (
    `<option value="">-- Chọn dịch vụ --</option>` +
    group("hair", "✂ Làm tóc") +
    group("massage", "♡ Massage trị liệu")
  );
}

function formMarkup(selectedId) {
  return `
    <form id="booking-form" class="modal__body" novalidate>
      <div class="field-row">
        <div class="field">
          <label class="field-label">Họ và tên *</label>
          <input class="input" name="name" type="text" placeholder="Nguyễn Văn A" required />
        </div>
        <div class="field">
          <label class="field-label">Số điện thoại *</label>
          <input class="input" name="phone" type="tel" placeholder="0901 234 567" required />
        </div>
      </div>
      <div class="field">
        <label class="field-label">Dịch vụ *</label>
        <select class="select" name="serviceId" required>${serviceOptions(selectedId)}</select>
      </div>
      <div class="field-row">
        <div class="field">
          <label class="field-label">Ngày hẹn *</label>
          <input class="input" name="date" type="date" min="${todayISO()}" required />
        </div>
        <div class="field">
          <label class="field-label">Giờ hẹn *</label>
          <select class="select" name="time" required>
            <option value="">-- Chọn giờ --</option>
            ${TIME_SLOTS.map((t) => `<option value="${t}">${t}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="field">
        <label class="field-label">Chọn kỹ thuật viên (tuỳ chọn)</label>
        <select class="select" name="staff">
          <option value="">-- Không có yêu cầu --</option>
          ${TEAM.map((t) => `<option value="${esc(t.name)}">${esc(t.name)} — ${esc(t.role)}</option>`).join("")}
        </select>
      </div>
      <div class="field">
        <label class="field-label">Ghi chú</label>
        <textarea class="textarea" name="note" rows="3" placeholder="Yêu cầu đặc biệt hoặc thắc mắc của bạn..."></textarea>
      </div>
      <button type="submit" class="btn btn--primary btn--block">Xác nhận đặt lịch</button>
    </form>`;
}

function successMarkup() {
  return `
    <div class="booking-success">
      <div class="booking-success__check">${icon("check")}</div>
      <h3>Đặt lịch thành công!</h3>
      <p>Cảm ơn bạn đã đặt lịch. Chúng tôi sẽ gọi xác nhận lịch hẹn sớm nhất có thể.</p>
      <button class="btn btn--primary" data-close>Đóng</button>
    </div>`;
}

/** Validate a phone like 0xxxxxxxxx (allowing spaces). Returns boolean. */
function validPhone(v) {
  return /^0\d[\d\s]{7,12}$/.test(v.trim());
}

export function openBooking(service = null) {
  closeBooking();
  document.body.style.overflow = "hidden";

  overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-label="Đặt lịch hẹn">
      <div class="modal__head">
        <div>
          <h2 class="modal__title">Đặt lịch hẹn</h2>
          <p class="modal__sub">Chúng tôi sẽ xác nhận trong vòng 15 phút</p>
        </div>
        <button class="modal__close" data-close aria-label="Đóng">${icon("x")}</button>
      </div>
      ${formMarkup(service?.id || "")}
    </div>`;
  document.body.appendChild(overlay);
  refreshIcons();

  // Close interactions
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay || e.target.closest("[data-close]")) closeBooking();
  });
  const onEsc = (e) => {
    if (e.key === "Escape") {
      closeBooking();
      document.removeEventListener("keydown", onEsc);
    }
  };
  document.addEventListener("keydown", onEsc);

  // Submit
  const form = overlay.querySelector("#booking-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());

    // Reset previous error states
    form.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));

    let firstError = null;
    const fail = (sel) => {
      const el = form.querySelector(sel);
      el?.classList.add("invalid");
      if (!firstError) firstError = el;
    };

    if (!data.name.trim()) fail('[name="name"]');
    if (!validPhone(data.phone)) fail('[name="phone"]');
    if (!data.serviceId) fail('[name="serviceId"]');
    if (!data.date) fail('[name="date"]');
    if (!data.time) fail('[name="time"]');

    if (firstError) {
      firstError.focus();
      toast("Vui lòng kiểm tra lại thông tin còn thiếu.", "error");
      return;
    }

    const svc = SERVICES.find((s) => s.id === data.serviceId);
    store.addBooking({
      name: data.name.trim(),
      phone: data.phone.trim(),
      service: svc ? svc.name : "",
      date: data.date,
      time: data.time,
      staff: data.staff || "Chưa chỉ định",
      note: data.note?.trim() || "",
    });

    // Swap to success view
    overlay.querySelector(".modal").innerHTML = `
      <div class="modal__head">
        <div>
          <h2 class="modal__title">Đặt lịch hẹn</h2>
          <p class="modal__sub">Hoàn tất</p>
        </div>
        <button class="modal__close" data-close aria-label="Đóng">${icon("x")}</button>
      </div>
      ${successMarkup()}`;
    refreshIcons();
    toast("Đã ghi nhận lịch hẹn của bạn.");
  });
}

// ============================================================
//  Lumi Beauty — ui.js
//  Shared UI helpers: toast notifications + lucide refresh.
// ============================================================

import { icon } from "./data.js";

/** Re-scan the DOM and upgrade any <i data-lucide> placeholders into SVGs.
 *  Safe to call repeatedly after rendering new markup. */
export function refreshIcons() {
  if (window.lucide?.createIcons) {
    window.lucide.createIcons();
  }
}

let toastStack;
function ensureStack() {
  if (!toastStack) {
    toastStack = document.createElement("div");
    toastStack.className = "toast-stack";
    document.body.appendChild(toastStack);
  }
  return toastStack;
}

/** Show a transient toast. type: "success" | "error" | "info" */
export function toast(message, type = "success") {
  const stack = ensureStack();
  const el = document.createElement("div");
  el.className = `toast toast--${type}`;
  const ic = type === "error" ? "x" : type === "info" ? "info" : "check";
  el.innerHTML = `${icon(ic)}<span>${message}</span>`;
  stack.appendChild(el);
  refreshIcons();

  setTimeout(() => {
    el.style.transition = "opacity .3s, transform .3s";
    el.style.opacity = "0";
    el.style.transform = "translateY(8px)";
    setTimeout(() => el.remove(), 320);
  }, 3200);
}

/** Attach an IntersectionObserver that reveals `.reveal` elements on scroll.
 *  Replaces Framer Motion's whileInView. Call once after page render. */
export function observeReveals(root = document) {
  const els = root.querySelectorAll(".reveal:not(.is-visible)");
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  els.forEach((el) => io.observe(el));
}

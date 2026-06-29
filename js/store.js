// ============================================================
//  Lumi Beauty — store.js
//  Tiny reactive state container with localStorage persistence.
//  Replaces the React useState lifting in the original App.tsx.
// ============================================================

import { GALLERY_SEED, BOOKINGS_SEED, SERVICES } from "./data.js";

const KEY = "lumi-beauty:v1";

// Default shape. `services` is seeded but kept editable (price edits persist).
function seed() {
  return {
    gallery: structuredClone(GALLERY_SEED),
    bookings: structuredClone(BOOKINGS_SEED),
    // Strip the non-serialisable icon string is fine — it's just a name.
    services: SERVICES.map((s) => ({ ...s })),
  };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed();
    const parsed = JSON.parse(raw);
    // Merge so new seed fields appear even for older saved state.
    return { ...seed(), ...parsed };
  } catch {
    return seed();
  }
}

class Store {
  #state = load();
  #subs = new Set();

  get state() {
    return this.#state;
  }

  /** Replace part of the state, persist, and notify subscribers. */
  set(patch) {
    this.#state = { ...this.#state, ...patch };
    this.#persist();
    this.#emit();
  }

  subscribe(fn) {
    this.#subs.add(fn);
    return () => this.#subs.delete(fn);
  }

  reset() {
    this.#state = seed();
    this.#persist();
    this.#emit();
  }

  #persist() {
    try {
      localStorage.setItem(KEY, JSON.stringify(this.#state));
    } catch {
      /* storage full or unavailable — fail silently */
    }
  }

  #emit() {
    this.#subs.forEach((fn) => fn(this.#state));
  }

  // ---- Domain actions -------------------------------------------------------

  addBooking(booking) {
    const id = "b" + Date.now();
    this.set({ bookings: [{ id, status: "pending", ...booking }, ...this.#state.bookings] });
  }

  updateBookingStatus(id, status) {
    this.set({
      bookings: this.#state.bookings.map((b) => (b.id === id ? { ...b, status } : b)),
    });
  }

  addGalleryItem(item) {
    const id = "g" + Date.now();
    this.set({ gallery: [...this.#state.gallery, { id, ...item }] });
  }

  removeGalleryItem(id) {
    this.set({ gallery: this.#state.gallery.filter((g) => g.id !== id) });
  }

  updateServicePrice(id, price) {
    this.set({
      services: this.#state.services.map((s) => (s.id === id ? { ...s, price } : s)),
    });
  }
}

export const store = new Store();

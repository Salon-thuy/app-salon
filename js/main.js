// ============================================================
//  Lumi Beauty — main.js
//  Entry point. Hash router toggles the User site and Admin console.
//  Routes:  #/         -> user landing page
//           #/admin    -> admin console
// ============================================================

import { renderUser } from "./user.js";
import { renderAdmin } from "./admin.js";

const root = document.getElementById("app");

function go(route) {
  if (location.hash !== route) {
    location.hash = route;
  } else {
    render(); // hash unchanged → render manually
  }
}

function render() {
  const isAdmin = location.hash.startsWith("#/admin");
  if (isAdmin) {
    renderAdmin(root, { onUser: () => go("#/") });
  } else {
    renderUser(root, { onAdmin: () => go("#/admin") });
  }
}

window.addEventListener("hashchange", render);
window.addEventListener("DOMContentLoaded", render);

// If the script runs after DOMContentLoaded already fired, render immediately.
if (document.readyState !== "loading") render();

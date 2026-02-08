function $(sel, root = document) { return root.querySelector(sel); }
function $all(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

function saveLS(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function loadLS(key, fallback = null) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch (e) {
    return fallback;
  }
}

function toast(msg) {
  let t = $("#toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}

function setActiveNav() {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".navlinks a").forEach(a => {
    const href = (a.getAttribute("href") || "").split("/").pop();
    if (href === path) a.classList.add("active");
  });
}

function initNav() {
  const burger = $("#burger");
  const links = $("#navlinks");
  if (!burger || !links) return;

  burger.addEventListener("click", () => {
    burger.classList.toggle("open");
    links.classList.toggle("open");
  });

  $all("#navlinks a").forEach(a => a.addEventListener("click", () => {
    burger.classList.remove("open");
    links.classList.remove("open");
  }));

  document.addEventListener("click", (e) => {
    if (!links.classList.contains("open")) return;
    if (links.contains(e.target) || burger.contains(e.target)) return;
    burger.classList.remove("open");
    links.classList.remove("open");
  });
}

function initReveal() {
  const els = $all(".reveal");
  if (!("IntersectionObserver" in window) || els.length === 0) {
    els.forEach(el => el.classList.add("show"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add("show");
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

function registerSW() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}


function initTheme() {
  const THEME_KEY = "readify_theme";
  const btn = document.getElementById("themeToggle");

  function applyTheme(theme) {
    const heroImg = document.getElementById("heroImg");
    if (theme === "dark") {
      document.body.setAttribute("data-theme", "dark");
      if (btn) btn.textContent = "☀️";
      if (heroImg) heroImg.src = "./assets/dark_cheems_hero_img.png";
    } else {
      document.body.removeAttribute("data-theme");
      if (btn) btn.textContent = "🌙";
      if (heroImg) heroImg.src = "./assets/Cheems_hero_image.jpeg";
    }
  }

  const savedTheme = localStorage.getItem(THEME_KEY) || "light";
  applyTheme(savedTheme);

  if (!btn) return;
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const current = document.body.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");
  initNav();
  setActiveNav();
  initReveal();
  registerSW();
  initTheme();
});

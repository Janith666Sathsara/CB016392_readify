const CACHE_NAME = "readify-cache-v1002";



const CORE_ASSETS = [
  "./",
  "./index.html",
  "./explorer.html",
  "./tracker.html",
  "./recommender.html",
  "./flow.html",
  "./feedback.html",
  "./offline.html",

  "./css/styles.css",

  "./js/app.js",
  "./js/books.js",
  "./js/explorer.js",
  "./js/tracker.js",
  "./js/recommender.js",
  "./js/flow.js",
  "./js/feedback.js",
  

  "./assets/hero.svg",
  "./assets/favicon.png",
  
  "./assets/logo_cheems.png",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",

  "./assets/covers/thor.jpg",

  "./assets/covers/spiderman.jpg",

  "./assets/covers/superman.jpg",

  "./manifest.webmanifest"
];

// INSTALL
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

// ACTIVATE
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// FETCH
self.addEventListener("fetch", (event) => {
  const req = event.request;

  if (req.method !== "GET") return;

// NETWORK-FIRST for page navigation
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => caches.match("./offline.html"))
    );
    return;
  }

// CACHE-FIRST for static assets
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;

      return fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, copy)).catch(()=>{});
        return res;
      }).catch(() => caches.match("./offline.html"));
    })
  );
});

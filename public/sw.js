// ============================================================
// مسار / 42 — Service Worker بسيط للعمل دون اتصال (PWA)
// التقدم يعيش في localStorage — هذا العامل يخزن الواجهة فقط
// ============================================================

const CACHE = "path42-v1";

// الملفات الأساسية التي تُخزَّن مسبقًا عند أول زيارة
const PRECACHE = [
  "/",
  "/manifest.webmanifest",
  "/icon.svg",
  "/growth/hero-desk.png",
  "/growth/portfolio-docs.png",
  "/growth/tools-dark.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  // نتجاهل كل ما هو خارج نطاق الموقع (مصادر Mahara-Tech وYouTube مثلاً)
  if (url.origin !== self.location.origin) return;

  // صفحات التنقل: شبكة أولًا، وإذا فشل الاتصال نرجع آخر نسخة مخزنة ثم الرئيسية
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() =>
          caches
            .match(request)
            .then((cached) => cached || caches.match("/"))
        )
    );
    return;
  }

  // الأصول الثابتة: الكاش أولًا ثم الشبكة مع التخزين
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          if (response.ok && response.type === "basic") {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
    )
  );
});

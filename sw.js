const VERSION = "simplenote-plus-pwa-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    // 目前刻意不做離線資料快取；若曾有舊 cache，升版時一併清掉。
    const keys = await caches.keys();
    await Promise.all(keys.map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // Network-only：確保每次都拿最新版頁面，不讓 PWA cache 造成舊版前端。
  event.respondWith(fetch(event.request));
});

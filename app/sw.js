/* Good Q · 网页版离线缓存。VERSION 由发布脚本每次自动改写，改了浏览器就会换新版。 */
const VERSION = '20260922-bcdc0baa';
const CACHE = 'goodq-web-' + VERSION;
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));  /* 不抢：新版装好后等用户点「更新」，或下次打开自动换 */
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('goodq-web-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (e) => { if (e.data === 'skipWaiting') self.skipWaiting(); });

/* 同源 GET：先给缓存（秒开、离线可用），后台再去网上拿新版存起来。 */
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  const key = (req.mode === 'navigate') ? './index.html' : req;
  e.respondWith(
    caches.open(CACHE).then(async (c) => {
      const hit = await c.match(key);
      const net = fetch(req).then((res) => { if (res && res.ok) c.put(key, res.clone()); return res; }).catch(() => null);
      if (hit) { e.waitUntil(net); return hit; }
      const res = await net;
      if (res) return res;
      if (req.mode === 'navigate') { const shell = await c.match('./index.html'); if (shell) return shell; }
      return new Response('offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
    })
  );
});

/* Service worker тренажера. Це шаблон: build.mjs підставляє версію й список файлів і записує результат у docs/sw.js.
 * Сторінку беремо спершу з мережі, щоб нові уроки приходили одразу, а без інтернету — з кешу. */
const VERSION = "a611ab2a97";
const ASSETS = ["./","manifest.webmanifest","icons/icon-192.png","icons/icon-512.png","icons/maskable-192.png","icons/maskable-512.png","icons/apple-touch-icon.png"];
const CACHE = 'en-trainer-' + VERSION;
const PAGE = new URL('./', self.registration.scope).href;
// Повільний мобільний інтернет не має тримати учня перед білим екраном, коли в кеші вже є робоча копія
const NETWORK_TIMEOUT = 4000;

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE)
    .then((c) => c.addAll(ASSETS.map((u) => new Request(u, { cache: 'reload' }))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('en-trainer-') && k !== CACHE) await caches.delete(k);
    await self.clients.claim();
    // Відкриті вкладки зі старим кодом покажуть «Вийшла нова версія» (views2.js → showUpdateBar)
    for (const c of await self.clients.matchAll({ type: 'window' })) c.postMessage({ type: 'activated', version: VERSION });
  })());
});

async function page(req) {
  const cache = await caches.open(CACHE);
  try {
    const res = await Promise.race([
      fetch(req),
      new Promise((resolve, reject) => setTimeout(() => reject(new Error('timeout')), NETWORK_TIMEOUT))
    ]);
    if (res.ok && res.type === 'basic') cache.put(PAGE, res.clone());
    return res;
  } catch (err) {
    return (await cache.match(PAGE)) || Response.error();
  }
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  // Аудіо онлайн-голосу кешувати марно: фраз тисячі, а непрозорі відповіді Google займали б місце в сховищі сайту
  if (new URL(req.url).origin !== self.location.origin) return;
  if (req.mode === 'navigate') { e.respondWith(page(req)); return; }
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req)));
});

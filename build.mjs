// Збирає src/ у docs/ — сайт для GitHub Pages: index.html (CSS і JS вбудовано), manifest, service worker, іконки.
// docs/ генерується повністю: правте src/, а не docs/
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { makeIcons } from './tools/icons.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const src = join(root, 'src'), out = join(root, 'docs');
const read = (p) => readFileSync(join(src, p), 'utf8');

let html = read('index.html');
html = html.replace(/<link rel="stylesheet" href="([^"]+)">/g, (_, p) => '<style>\n' + read(p) + '\n</style>');
html = html.replace(/<script src="([^"]+)"><\/script>/g, (_, p) => {
  const js = read(p);
  if (/<\/script/i.test(js)) throw new Error(p + ' містить "</script" — зберіть інакше');
  return '<script>\n' + js + '\n</script>';
});
const logo = html.match(/<span class="logo"[^>]*>(<svg[\s\S]*?<\/svg>)/);
if (!logo) throw new Error('src/index.html: не знайдено прапор <span class="logo"><svg>…</svg>');

const assets = { 'manifest.webmanifest': read('manifest.webmanifest'), ...makeIcons(logo[1]) };
JSON.parse(assets['manifest.webmanifest']);
const swTemplate = read('sw.js');

// Відбиток усього, що віддає сайт: змінився хоч байт → новий sw.js → браузер оновить кеш на телефоні
const hash = createHash('sha256').update(html).update(swTemplate);
for (const [name, body] of Object.entries(assets)) hash.update(name).update(body);
const version = hash.digest('hex').slice(0, 10);

const files = {
  'index.html': html.replace('</head>', '<script>window.EN = window.EN || {}; EN.BUILD = ' + JSON.stringify(version) + ';</script>\n</head>'),
  'sw.js': swTemplate.replace("'__VERSION__'", JSON.stringify(version)).replace('__ASSETS__', JSON.stringify(['./', ...Object.keys(assets)])),
  // Без цього файлу GitHub Pages пропускає сайт через Jekyll, а той може змінити чи сховати файли
  '.nojekyll': '',
  ...assets
};
for (const [name, body] of Object.entries(files)) {
  mkdirSync(dirname(join(out, name)), { recursive: true });
  writeFileSync(join(out, name), body);
}
console.log('OK: docs/ — index.html ' + Math.round(Buffer.byteLength(files['index.html']) / 1024) + ' KB, ' + Object.keys(files).length + ' файлів, версія ' + version);

// PNG-іконки для встановлення як додаток. Малюнок береться з прапора в шапці src/index.html, щоб він жив в одному місці.
// Проєкт навмисно без залежностей, тож тут власний мінірастеризатор для того підмножини SVG, яку використовує прапор:
// rect, circle, path (M L H V C Z, також відносні), g із fill і clip-path, clipPath, stroke на path.
import { deflateSync } from 'node:zlib';

const CRC = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c; });
function crc32(buf) { let c = -1; for (const b of buf) c = CRC[(c ^ b) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; }
function chunk(type, data) {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, 'ascii');
  data.copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
  return out;
}
function encodePng(w, h, rgba) {
  const stride = w * 4 + 1, raw = Buffer.alloc(stride * h);
  for (let y = 0; y < h; y++) rgba.copy(raw, y * stride + 1, y * w * 4, (y + 1) * w * 4);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}

function color(s) {
  s = String(s).trim().replace('#', '');
  if (s.length === 3) s = s.replace(/./g, '$&$&');
  if (!/^[0-9a-f]{6}$/i.test(s)) throw new Error('icons.mjs: непідтримуваний колір ' + s);
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16));
}
const attrs = (s) => Object.fromEntries([...s.matchAll(/([\w:-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));

// Шлях → замкнені ламані (криві Безьє розбиваються на 24 відрізки — для іконки цього досить)
function pathPolys(d) {
  const toks = d.match(/[MmLlHhVvCcZz]|-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/g);
  const polys = []; let poly = null, x = 0, y = 0, sx = 0, sy = 0, cmd = '', i = 0;
  const num = () => +toks[i++];
  while (i < toks.length) {
    if (/[a-z]/i.test(toks[i])) cmd = toks[i++];
    const rel = cmd === cmd.toLowerCase(), C = cmd.toUpperCase();
    if (C === 'Z') { if (poly) poly.push([sx, sy]); x = sx; y = sy; poly = null; continue; }
    if (C === 'M') { x = num() + (rel ? x : 0); y = num() + (rel ? y : 0); sx = x; sy = y; poly = [[x, y]]; polys.push(poly); cmd = rel ? 'l' : 'L'; continue; }
    if (!poly) { poly = [[x, y]]; polys.push(poly); }
    if (C === 'L') { x = num() + (rel ? x : 0); y = num() + (rel ? y : 0); poly.push([x, y]); }
    else if (C === 'H') { x = num() + (rel ? x : 0); poly.push([x, y]); }
    else if (C === 'V') { y = num() + (rel ? y : 0); poly.push([x, y]); }
    else if (C === 'C') {
      const p = [num(), num(), num(), num(), num(), num()];
      if (rel) for (let k = 0; k < 6; k++) p[k] += k % 2 ? y : x;
      const [x0, y0] = [x, y];
      for (let t = 1; t <= 24; t++) {
        const s = t / 24, u = 1 - s;
        poly.push([u * u * u * x0 + 3 * u * u * s * p[0] + 3 * u * s * s * p[2] + s * s * s * p[4],
          u * u * u * y0 + 3 * u * u * s * p[1] + 3 * u * s * s * p[3] + s * s * s * p[5]]);
      }
      x = p[4]; y = p[5];
    } else throw new Error('icons.mjs: непідтримувана команда шляху ' + cmd);
  }
  return polys;
}
function bbox(pts, pad) {
  let a = Infinity, b = Infinity, c = -Infinity, d = -Infinity;
  for (const [x, y] of pts) { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y); }
  return [a - pad, b - pad, c + pad, d + pad];
}
// Правило заповнення SVG за замовчуванням — nonzero: перехрестя хреста на щиті не має ставати діркою
function windingInside(polys, px, py) {
  let w = 0;
  for (const poly of polys) for (let k = 0; k < poly.length - 1; k++) {
    const [x1, y1] = poly[k], [x2, y2] = poly[k + 1];
    const side = (x2 - x1) * (py - y1) - (px - x1) * (y2 - y1);
    if (y1 <= py) { if (y2 > py && side > 0) w++; } else if (y2 <= py && side < 0) w--;
  }
  return w !== 0;
}
function nearEdge(polys, px, py, r) {
  for (const poly of polys) for (let k = 0; k < poly.length - 1; k++) {
    const [x1, y1] = poly[k], [x2, y2] = poly[k + 1];
    const dx = x2 - x1, dy = y2 - y1, L = dx * dx + dy * dy;
    const t = L ? Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / L)) : 0;
    const ex = x1 + t * dx - px, ey = y1 + t * dy - py;
    if (ex * ex + ey * ey <= r * r) return true;
  }
  return false;
}
function shape(tag, a) {
  if (tag === 'rect') {
    const x = +(a.x || 0), y = +(a.y || 0), w = +a.width, h = +a.height;
    return { box: [x, y, x + w, y + h], inside: (px, py) => px >= x && px < x + w && py >= y && py < y + h };
  }
  if (tag === 'circle') {
    const cx = +a.cx, cy = +a.cy, r = +a.r;
    return { box: [cx - r, cy - r, cx + r, cy + r], inside: (px, py) => (px - cx) ** 2 + (py - cy) ** 2 <= r * r };
  }
  if (tag === 'path') {
    const polys = pathPolys(a.d), half = a.stroke && a['stroke-width'] ? +a['stroke-width'] / 2 : 0;
    return { box: bbox(polys.flat(), half), inside: (px, py) => windingInside(polys, px, py) || (half > 0 && nearEdge(polys, px, py, half)) };
  }
  throw new Error('icons.mjs: непідтримуваний елемент <' + tag + '>');
}

// Порядок фігур має значення: як і в SVG, пізніша перекриває попередню
function parseFlag(svg) {
  const vb = (attrs(svg.match(/<svg[^>]*>/)[0]).viewBox || '').split(/[\s,]+/).map(Number);
  if (vb.length !== 4) throw new Error('icons.mjs: у прапора немає viewBox');
  const shapes = [], clips = {}, stack = [{ fill: '#000', clip: null }];
  let clipId = null;
  for (const m of svg.matchAll(/<(\/?)([a-zA-Z]+)([^>]*?)(\/?)>/g)) {
    const [, close, tag, rest, self] = m, a = attrs(rest), top = stack[stack.length - 1];
    if (tag === 'svg') continue;
    if (tag === 'clipPath') { clipId = close ? null : a.id; if (!close) clips[a.id] = []; continue; }
    if (tag === 'g') {
      if (close) stack.pop();
      else stack.push({ fill: a.fill || top.fill, clip: a['clip-path'] ? a['clip-path'].replace(/^url\(#|\)$/g, '') : top.clip });
      continue;
    }
    if (close) continue;
    // Обведення малюється кольором заливки; інший колір обведення цей растеризатор не вміє
    if (a.stroke && color(a.stroke).join() !== color(a.fill || top.fill).join()) throw new Error('icons.mjs: обведення іншого кольору, ніж заливка');
    const s = shape(tag, a);
    if (clipId) { clips[clipId].push(s); continue; }
    s.rgb = color(a.fill || top.fill);
    s.clip = top.clip;
    shapes.push(s);
    if (!self) throw new Error('icons.mjs: очікувався самозакривний <' + tag + '/>');
  }
  for (const s of shapes) if (s.clip && !clips[s.clip]) throw new Error('icons.mjs: немає clipPath #' + s.clip);
  return { vb, shapes, clips };
}

/**
 * size — розмір іконки; o.w — ширина прапора як частка size; o.bg — колір тла або null (прозоре);
 * o.radius — заокруглення кутів прапора як частка його висоти; o.outline — колір облямівки завтовшки 2% size.
 * SS×SS вибірок на піксель згладжують краї.
 */
function render(flag, size, o) {
  const SS = 4, [vx, vy, vw, vh] = flag.vb;
  const fw = size * o.w, fh = fw * vh / vw, ox = (size - fw) / 2, oy = (size - fh) / 2, rr = fh * o.radius;
  const back = o.bg ? color(o.bg) : null, line = o.outline ? color(o.outline) : null, ow = size * 0.02, out = Buffer.alloc(size * size * 4);
  const inRound = (lx, ly, w, h, r) => {
    if (lx < 0 || ly < 0 || lx >= w || ly >= h) return false;
    const cx = Math.max(r - lx, 0, lx - (w - r)), cy = Math.max(r - ly, 0, ly - (h - r));
    return cx * cx + cy * cy <= r * r;
  };
  for (let py = 0; py < size; py++) for (let px = 0; px < size; px++) {
    let r = 0, g = 0, b = 0, cover = 0;
    for (let sy = 0; sy < SS; sy++) for (let sx = 0; sx < SS; sx++) {
      const x = px + (sx + 0.5) / SS, y = py + (sy + 0.5) / SS;
      let rgb = null;
      const lx = x - ox, ly = y - oy;
      if (inRound(lx, ly, fw, fh, rr)) {
        {
          const fx = vx + lx / fw * vw, fy = vy + ly / fh * vh, clipped = {};
          for (const s of flag.shapes) {
            const [x0, y0, x1, y1] = s.box;
            if (fx < x0 || fy < y0 || fx > x1 || fy > y1 || !s.inside(fx, fy)) continue;
            if (s.clip) {
              if (!(s.clip in clipped)) clipped[s.clip] = flag.clips[s.clip].some((c) => c.inside(fx, fy));
              if (!clipped[s.clip]) continue;
            }
            rgb = s.rgb;
          }
        }
      }
      if (!rgb && line && inRound(lx + ow, ly + ow, fw + 2 * ow, fh + 2 * ow, rr + ow)) rgb = line;
      if (!rgb) rgb = back;
      if (rgb) { r += rgb[0]; g += rgb[1]; b += rgb[2]; cover++; }
    }
    const at = (py * size + px) * 4;
    if (cover) { out[at] = Math.round(r / cover); out[at + 1] = Math.round(g / cover); out[at + 2] = Math.round(b / cover); }
    out[at + 3] = Math.round(cover / (SS * SS) * 255);
  }
  return encodePng(size, size, out);
}

// Маскувальні іконки: прапор у безпечному колі (80% діаметра) на суцільному тлі, бо лаунчер Android обрізає їх колом
// чи «пігулкою». apple-touch-icon — теж на тлі: iOS не підтримує прозорість. Звичайним іконкам потрібна облямівка:
// без неї біла смуга прапора зливається зі світлим тлом меню «Пуск» чи нової вкладки.
export function makeIcons(flagSvg) {
  const flag = parseFlag(flagSvg), BG = '#e8f0fb';
  return {
    'icons/icon-192.png': render(flag, 192, { w: 0.9, radius: 0.06, outline: '#c9d1dc' }),
    'icons/icon-512.png': render(flag, 512, { w: 0.9, radius: 0.06, outline: '#c9d1dc' }),
    'icons/maskable-192.png': render(flag, 192, { w: 0.64, radius: 0.04, bg: BG }),
    'icons/maskable-512.png': render(flag, 512, { w: 0.64, radius: 0.04, bg: BG }),
    'icons/apple-touch-icon.png': render(flag, 180, { w: 0.8, radius: 0.05, bg: BG })
  };
}

/* Мій словник: додавання, редагування, транскрипція й записи носіїв, експорт та імпорт.
 * Розбір і злиття імпорту — без DOM, тому validate.mjs перевіряє їх у Node. Екрани — у dictview.js */
window.EN = window.EN || {};
(function (EN) {
  'use strict';
  const FORMAT = 'hello-english-dictionary';
  const FORMAT_VERSION = 1;
  const key = (en) => EN.dictKey(en);
  const cid = (en) => EN.cardId('my', en);
  const clone = (o) => JSON.parse(JSON.stringify(o));
  // Ліміт захищає localStorage (~5 МБ на сайт) від випадково вставленого величезного файлу
  const MAX_WORDS = 20000;

  const Dict = {
    FORMAT, MAX_WORDS,
    list() { return EN.S.dict; },
    index(en) { const k = key(en); return EN.S.dict.findIndex((w) => key(w.en) === k); },
    get(en) { return EN.S.dict[this.index(en)] || null; },

    // Повертає { ok, word } або { ok: false, reason: 'empty' | 'dup' | 'full', word? }
    add(fields) {
      const w = EN.cleanWord(Object.assign({}, fields, { added: EN.isoDay(EN.today()) }));
      if (!w) return { ok: false, reason: 'empty' };
      const old = this.get(w.en);
      if (old) return { ok: false, reason: 'dup', word: old };
      if (EN.S.dict.length >= MAX_WORDS) return { ok: false, reason: 'full' };
      EN.S.dict.push(w);
      EN.save();
      return { ok: true, word: w };
    },
    // Нове англійське написання переносить і прогрес повторення: id картки містить саме слово
    update(oldEn, fields) {
      const i = this.index(oldEn);
      if (i < 0) return { ok: false, reason: 'missing' };
      const cur = EN.S.dict[i];
      const w = EN.cleanWord(Object.assign({}, cur, fields));
      if (!w) return { ok: false, reason: 'empty' };
      const j = this.index(w.en);
      if (j >= 0 && j !== i) return { ok: false, reason: 'dup', word: EN.S.dict[j] };
      if (w.en !== cur.en) {
        if (key(w.en) !== key(cur.en)) { delete w.ipa; delete w.au; }
        const card = EN.S.cards[cid(cur.en)];
        delete EN.S.cards[cid(cur.en)];
        if (card) EN.S.cards[cid(w.en)] = card;
      }
      EN.S.dict[i] = w;
      EN.save();
      return { ok: true, word: w };
    },
    remove(en) {
      const i = this.index(en);
      if (i < 0) return false;
      const w = EN.S.dict.splice(i, 1)[0];
      delete EN.S.cards[cid(w.en)];
      EN.save();
      return true;
    },
    clear() {
      for (const w of EN.S.dict) delete EN.S.cards[cid(w.en)];
      EN.S.dict = [];
      EN.save();
    },
    card(en) { return EN.S.cards[cid(en)] || null; },

    // Транскрипція й записи живих людей з dictionaryapi.dev (дані Wiktionary). Відповіді кешуються на час сесії,
    // бо в сервісу обмеження на кількість запитів, а учень часто натискає те саме слово кілька разів
    cache: new Map(),
    async lookup(en) {
      const q = EN.sayText(en).toLowerCase().replace(/^to\s+/, '').trim();
      if (!q || q.length > 60) return null;
      if (this.cache.has(q)) return this.cache.get(q);
      const once = async () => {
        const ctrl = typeof AbortController === 'function' ? new AbortController() : null;
        const timer = setTimeout(() => ctrl && ctrl.abort(), 8000);
        try {
          const r = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + encodeURIComponent(q), { signal: ctrl && ctrl.signal, referrerPolicy: 'no-referrer' });
          if (r.ok) return Dict.parseLookup(await r.json());
          if (r.status === 404) return null;
          throw new Error('HTTP ' + r.status);
        } finally { clearTimeout(timer); }
      };
      let res;
      try { res = await once(); } catch (e) {
        // Перший запит до сервісу інколи падає з «Failed to fetch» (холодне з'єднання), а повтор за мить проходить
        await new Promise((ok) => setTimeout(ok, 1200));
        try { res = await once(); } catch (e2) {
          console.warn('Словниковий сервіс недоступний', e2);
          return undefined;   // undefined — сервіс не відповів (не кешуємо); null — слова в базі немає
        }
      }
      this.cache.set(q, res);
      return res;
    },
    // Слова без транскрипції чи запису (наприклад, після імпорту) доповнюються по черзі: у сервісу ліміт запитів
    missing() { return EN.S.dict.filter((w) => !w.ipa).map((w) => w.en); },
    async enrichAll(onStep, stop) {
      const list = this.missing();
      let fails = 0, found = 0;
      for (let i = 0; i < list.length && !(stop && stop()); i++) {
        const r = await this.enrich(list[i]);
        if (r === undefined) { if (++fails >= 3) break; } else { fails = 0; if (r) found++; }
        if (onStep) onStep(i + 1, list.length, found);
        await new Promise((ok) => setTimeout(ok, 250));
      }
      return { found, total: list.length, offline: fails >= 3 };
    },
    parseLookup(data) {
      if (!Array.isArray(data)) return null;
      const au = {}, texts = { us: '', gb: '', au: '' };
      let any = '';
      for (const entry of data) {
        if (!any && entry && typeof entry.phonetic === 'string') any = entry.phonetic;
        for (const p of (entry && entry.phonetics) || []) {
          let url = typeof p.audio === 'string' ? p.audio.trim() : '';
          if (url.startsWith('//')) url = 'https:' + url;
          const acc = /-us\.mp3$|_us_/i.test(url) ? 'us' : /-uk\.mp3$|_gb_/i.test(url) ? 'gb' : /-au\.mp3$/i.test(url) ? 'au' : null;
          if (acc && !au[acc]) au[acc] = url;
          if (p.text) { if (!any) any = p.text; if (acc && !texts[acc]) texts[acc] = p.text; }
        }
      }
      const want = EN.S.settings.accent;
      let ipa = texts[want] || texts.us || texts.gb || any || '';
      if (ipa && !/^[/[]/.test(ipa)) ipa = '/' + ipa + '/';
      const clean = EN.cleanWord({ en: 'x', uk: 'x', ipa, au });
      return { ipa: clean.ipa || '', au: clean.au || null };
    },
    // Дописує транскрипцію (якщо її немає) і записи носіїв до слова зі словника
    async enrich(en) {
      const r = await this.lookup(en);
      if (!r) return r;
      const i = this.index(en);
      if (i < 0) return r;
      const w = EN.S.dict[i];
      const next = Object.assign({}, w, { ipa: w.ipa || r.ipa, au: r.au || w.au });
      EN.S.dict[i] = EN.cleanWord(next) || w;
      EN.save();
      return r;
    },
    // Запис носія потрібного акценту, а якщо його немає — будь-який (австралійський теж краще за синтез)
    nativeUrl(w, accent) {
      const au = w && w.au;
      if (!au) return null;
      return au[accent] || au[accent === 'gb' ? 'us' : 'gb'] || au.au || null;
    },

    toJson(withProgress) {
      const words = EN.S.dict.map((w) => {
        const out = clone(w);
        const c = withProgress && this.card(w.en);
        if (c) out.card = clone(c);
        return out;
      });
      return JSON.stringify({ format: FORMAT, version: FORMAT_VERSION, app: 'Hello, English', exported: new Date().toISOString(), count: words.length, words }, null, 1);
    },
    toCsv() {
      const q = (s) => (/[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s);
      const rows = [['english', 'ukrainian', 'note', 'example', 'ipa']].concat(EN.S.dict.map((w) => [w.en, w.uk, w.note || '', w.ex || '', w.ipa || '']));
      return rows.map((r) => r.map(q).join(',')).join('\r\n') + '\r\n';
    },
    // Табуляція — роздільник, який Excel і Google Таблиці розпізнають у будь-якій мовній локалі
    toTsv() {
      const t = (s) => String(s || '').replace(/[\t\r\n]+/g, ' ');
      return ['English\tУкраїнською\tПримітка\tПриклад\tТранскрипція'].concat(EN.S.dict.map((w) => [w.en, w.uk, w.note, w.ex, w.ipa].map(t).join('\t'))).join('\n');
    },
    fileName(ext) { return 'hello-english-dictionary-' + EN.isoDay(EN.today()) + '.' + ext; },

    // Розбір імпорту → { kind, rows: [{en, uk, note?, ex?, ipa?, au?, added?, card?}], bad: [{line, text}] }
    parse(text, filename) {
      text = String(text || '').replace(/^﻿/, '');
      const t = text.trim();
      if (!t) return { kind: 'empty', rows: [], bad: [] };
      if (/^[[{]/.test(t)) {
        try { return Dict.parseJson(JSON.parse(t)); } catch (e) { return { kind: 'json', rows: [], bad: [{ line: 0, text: 'Файл схожий на JSON, але не читається: ' + e.message }] }; }
      }
      const ext = String(filename || '').toLowerCase().split('.').pop();
      const first = t.split(/\r?\n/)[0];
      if (first.includes('\t') || ext === 'tsv') return Dict.parseTable(t, '\t');
      if (ext === 'csv') return Dict.parseTable(t, (first.match(/;/g) || []).length > (first.match(/,/g) || []).length ? ';' : ',');
      return Dict.parseText(t);
    },
    parseJson(data) {
      const list = Array.isArray(data) ? data : data && (Array.isArray(data.words) ? data.words : Array.isArray(data.dict) ? data.dict : null);
      if (!list) return { kind: 'json', rows: [], bad: [{ line: 0, text: 'У файлі немає списку слів (очікувалося поле words)' }] };
      const pickKey = (o, names) => { for (const n of Object.keys(o)) if (names.includes(n.toLowerCase())) return o[n]; return undefined; };
      const rows = [], bad = [];
      list.forEach((item, i) => {
        let w = null;
        if (Array.isArray(item)) w = { en: item[0], uk: item[1], note: item[2], ex: item[3], ipa: item[4] };
        else if (item && typeof item === 'object') {
          w = { en: pickKey(item, EN_NAMES), uk: pickKey(item, UK_NAMES), note: pickKey(item, NOTE_NAMES), ex: pickKey(item, EX_NAMES), ipa: pickKey(item, IPA_NAMES), au: item.au, added: item.added };
          const card = EN.cleanCard(item.card);
          if (card) w.card = card;
        }
        const c = w && EN.cleanWord(w);
        if (c) { if (w.card) c.card = w.card; rows.push(c); } else bad.push({ line: i + 1, text: JSON.stringify(item).slice(0, 80) });
      });
      return { kind: 'json', rows, bad };
    },
    // CSV за RFC 4180: лапки, подвоєні лапки й переноси рядків усередині лапок
    splitCsv(text, d) {
      const rows = [];
      let row = [], cell = '', q = false;
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (q) {
          if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += ch;
        } else if (ch === '"' && cell === '') q = true;
        else if (ch === d) { row.push(cell); cell = ''; }
        else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; }
        else cell += ch;
      }
      if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
      return rows;
    },
    parseTable(text, d) {
      const table = Dict.splitCsv(text, d).filter((r) => r.some((c) => c.trim()));
      let cols = { en: 0, uk: 1, note: 2, ex: 3, ipa: 4 }, start = 0;
      const head = (table[0] || []).map((c) => c.trim().toLowerCase());
      if (head.length && (EN_NAMES.includes(head[0]) || head.some((h) => UK_NAMES.includes(h)))) {
        const find = (names, def) => { const i = head.findIndex((h) => names.includes(h)); return i >= 0 ? i : def; };
        cols = { en: find(EN_NAMES, 0), uk: find(UK_NAMES, 1), note: find(NOTE_NAMES, -1), ex: find(EX_NAMES, -1), ipa: find(IPA_NAMES, -1) };
        start = 1;
      }
      const rows = [], bad = [];
      for (let i = start; i < table.length; i++) {
        const r = table[i], get = (k) => (cols[k] >= 0 ? r[cols[k]] : '');
        const w = EN.cleanWord({ en: get('en'), uk: get('uk'), note: get('note'), ex: get('ex'), ipa: get('ipa') });
        if (w) rows.push(w); else bad.push({ line: i + 1, text: r.join(d === '\t' ? ' ⇥ ' : d).slice(0, 80) });
      }
      return { kind: d === '\t' ? 'tsv' : 'csv', rows, bad };
    },
    // Вільний текст: по слову на рядок, роздільник — перший знайдений з SEPARATORS
    parseText(text) {
      const rows = [], bad = [];
      text.split(/\r?\n/).forEach((raw, i) => {
        const line = raw.replace(/^\s*(?:\d+[.)]|[-•*–])\s+/, '').trim();
        if (!line || line.startsWith('#')) return;
        let w = null;
        for (const sep of SEPARATORS) {
          const at = line.indexOf(sep);
          if (at > 0) { w = EN.cleanWord({ en: line.slice(0, at), uk: line.slice(at + sep.length) }); break; }
        }
        if (w) rows.push(w); else bad.push({ line: i + 1, text: line.slice(0, 80) });
      });
      return { kind: 'text', rows, bad };
    },

    // План злиття: що нове, що вже є з тим самим перекладом, що з іншим, що повторюється в самому файлі
    plan(parsed) {
      const fresh = [], same = [], conflict = [], seen = new Set();
      let dup = 0;
      for (const row of parsed.rows) {
        const k = key(row.en);
        if (seen.has(k)) { dup++; continue; }
        seen.add(k);
        const cur = this.get(row.en);
        if (!cur) fresh.push(row);
        else if (EN.norm(cur.uk) === EN.norm(row.uk)) same.push({ row, cur });
        else conflict.push({ row, cur });
      }
      return { fresh, same, conflict, dup, bad: parsed.bad, kind: parsed.kind, withCards: parsed.rows.some((r) => r.card) };
    },
    // conflict: 'keep' | 'replace' | 'merge'; progress — брати прогрес повторення з файлу. Повертає підсумок і знімок для скасування
    apply(plan, opts) {
      opts = Object.assign({ conflict: 'keep', progress: true }, opts);
      const snapshot = { dict: clone(EN.S.dict), cards: {} };
      for (const k of Object.keys(EN.S.cards)) if (k.startsWith('my|')) snapshot.cards[k] = clone(EN.S.cards[k]);
      let added = 0, updated = 0, filled = 0;
      const room = Math.max(0, MAX_WORDS - EN.S.dict.length);
      const takeCard = (row, en) => {
        if (!opts.progress || !row.card) return;
        const old = EN.S.cards[cid(en)];
        if (!old || (!old.reps && row.card.reps)) EN.S.cards[cid(en)] = clone(row.card);
      };
      // Порожні поля мого слова заповнюються з файлу; заповнені — не чіпаємо
      const fill = (cur, row) => {
        let n = 0;
        for (const f of ['note', 'ex', 'ipa']) if (!cur[f] && row[f]) { cur[f] = row[f]; n++; }
        if (!cur.au && row.au) { cur.au = row.au; n++; }
        return n;
      };
      for (const row of plan.fresh.slice(0, room)) {
        const w = Object.assign({}, row);
        delete w.card;
        if (!w.added) w.added = EN.isoDay(EN.today());
        EN.S.dict.push(w);
        takeCard(row, w.en);
        added++;
      }
      for (const { row } of plan.same) {
        const cur = this.get(row.en);
        if (fill(cur, row)) filled++;
        takeCard(row, cur.en);
      }
      for (const { row } of plan.conflict) {
        const cur = this.get(row.en);
        if (opts.conflict === 'replace') { cur.uk = row.uk; updated++; } else if (opts.conflict === 'merge') {
          const parts = cur.uk.split(/\s*;\s*/);
          if (!parts.some((p) => EN.norm(p) === EN.norm(row.uk))) { cur.uk = (cur.uk + '; ' + row.uk).slice(0, 300); updated++; }
        }
        if (fill(cur, row)) filled++;
        takeCard(row, cur.en);
      }
      EN.save();
      return { added, updated, filled, skipped: plan.fresh.length - Math.min(plan.fresh.length, room), snapshot };
    },
    undo(snapshot) {
      for (const k of Object.keys(EN.S.cards)) if (k.startsWith('my|')) delete EN.S.cards[k];
      Object.assign(EN.S.cards, snapshot.cards);
      EN.S.dict = snapshot.dict;
      EN.save();
    },

    // Тренування: диктант (почути й написати), переклад українська → англійська, вибір перекладу
    practiceSpecs(n) {
      const all = EN.S.dict;
      if (!all.length) return [];
      const t = EN.today();
      // Спершу слова, які пора повторити, і нові: їх тренувати найкорисніше
      const rank = (w) => { const c = this.card(w.en); return !c ? 1 : c.due <= t ? 0 : 2; };
      const pool = EN.shuffle(all).sort((a, b) => rank(a) - rank(b)).slice(0, n || 10);
      return pool.map((w) => {
        const answers = Dict.answers(w.en);
        const types = ['i'];
        if (!/\s\/\s/.test(w.en)) types.push('l');
        const others = EN.shuffle(all.filter((x) => EN.norm(x.uk) !== EN.norm(w.uk))).map((x) => x.uk).filter((u, i, a) => a.indexOf(u) === i).slice(0, 2);
        if (others.length === 2) types.push('c');
        const type = types[Math.floor(Math.random() * types.length)];
        const note = w.note ? ' <span class="small muted">(' + EN.esc(w.note) + ')</span>' : '';
        const e = EN.sayHtml(w.en, EN.sayText(w.en)) + (w.ipa ? ' <span class="ipa">' + EN.esc(w.ipa) + '</span>' : '') + ' — ' + EN.esc(w.uk);
        if (type === 'c') return { t: 'c', q: 'Що означає ' + EN.sayHtml(w.en, EN.sayText(w.en)) + '?', o: [w.uk].concat(others), e };
        if (type === 'l') return { t: 'l', a: answers, say: EN.sayText(w.en), tr: w.uk, h: 'Прослухайте й напишіть англійською' };
        return { t: 'i', q: 'Як англійською: <b>' + EN.esc(w.uk) + '</b>?' + note, a: answers, e };
      });
    },
    // Прийнятні відповіді для слова: варіанти через « / », без приміток у дужках, з «to» перед дієсловом і без нього
    answers(en) {
      const out = new Set();
      for (const part of String(en).split(/\s\/\s/)) {
        const p = part.trim(), plain = p.replace(/\s*\([^)]*\)/g, '').trim();
        [p, plain].forEach((x) => { if (!x) return; out.add(x); if (/^to\s/i.test(x)) out.add(x.replace(/^to\s+/i, '')); });
      }
      out.add(en);
      return Array.from(out);
    }
  };
  const EN_NAMES = ['english', 'en', 'word', 'term', 'front', 'слово', 'англійською', 'англійська', 'англ', 'english word'];
  const UK_NAMES = ['ukrainian', 'uk', 'ua', 'translation', 'back', 'definition', 'meaning', 'переклад', 'українською', 'українська', 'укр'];
  const NOTE_NAMES = ['note', 'notes', 'comment', 'примітка', 'примітки', 'коментар'];
  const EX_NAMES = ['example', 'examples', 'sentence', 'context', 'ex', 'приклад', 'речення'];
  const IPA_NAMES = ['ipa', 'transcription', 'pronunciation', 'phonetic', 'транскрипція', 'вимова'];
  // Порядок важливий: « — » і « - » раніше за «;» і «,», бо переклад часто містить коми («квартира, житло»)
  const SEPARATORS = [' — ', ' – ', ' - ', '\t', ' ; ', ';', ' = ', '=', ' : ', ','];

  // Завантаження файлу, «Поділитися» і буфер обміну потребують браузера; у Node (validate.mjs) їх не викликають
  Dict.download = function (name, text, mime) {
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = name; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };
  Dict.canShareFiles = function () {
    try { return !!(navigator.canShare && navigator.canShare({ files: [new File(['{}'], 'x.json', { type: 'application/json' })] })); } catch (e) { return false; }
  };
  Dict.share = function (name, text, mime) {
    return navigator.share({ files: [new File([text], name, { type: mime })], title: 'Hello, English — мій словник' });
  };
  Dict.copy = async function (text) {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (e2) { ok = false; }
      ta.remove();
      return ok;
    }
  };

  EN.Dict = Dict;
})(window.EN);

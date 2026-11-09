/* Hello, English — тренажер англійської: стан, озвучення, запис, перевірка відповідей, інтервальне повторення, мій словник */
window.EN = window.EN || {};
(function (EN) {
  'use strict';

  // Увесь прогрес лежить у localStorage сайту під цим ключем. Ключ НЕ змінювати: інакше збережений прогрес не відкриється.
  // Він відрізняється від ключа словацького тренажера (sk-trainer-v1): сайти GitHub Pages одного акаунта мають спільне сховище.
  const STORE_KEY = 'en-trainer-v1';
  const VERSION = 1;   // версія схеми стану: змінили формат → +1 і крок у MIGRATIONS
  const DEFAULTS = {
    v: VERSION,
    start: null,
    settings: { accent: 'us', voice: '', rate: 0.9, strict: false, newPerDay: 10, dir: 'mix', autoIpa: true },
    lessons: {},   // id -> {opened, theory, ex:{best,done}, speak, mission, skipped, run}
    modules: {},   // id модуля програми -> true (ручні позначки; зараз усі етапи мають уроки)
    cards: {},     // id картки -> {due,int,ease,reps,lapses}
    dict: [],      // мій словник [{en, uk, note, ex, ipa, au:{us,gb,au}, added}]
    days: {},      // номер дня -> {ex, cards, speak}
    newDay: { day: 0, count: 0 },
    ui: { installTip: true, dictSort: 'new' }
  };
  // MIGRATIONS[n](s) переводить стан версії n у версію n + 1 (змінює s на місці)
  const MIGRATIONS = {};
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const UNSAFE = new Set(['__proto__', 'constructor', 'prototype']);
  function merge(base, extra) {
    for (const k of Object.keys(extra || {})) {
      if (UNSAFE.has(k)) continue;
      if (extra[k] && typeof extra[k] === 'object' && !Array.isArray(extra[k]) && base[k] && typeof base[k] === 'object' && !Array.isArray(base[k])) merge(base[k], extra[k]);
      else base[k] = extra[k];
    }
    return base;
  }
  function migrate(s) {
    s.v = Math.floor(+s.v) || 1;
    while (s.v < VERSION && MIGRATIONS[s.v]) { MIGRATIONS[s.v](s); s.v++; }
    return s;
  }
  // Записи словника приходять і з файлів імпорту, тож їх приводимо до рядків розумної довжини
  const str = (v, max) => String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, max);
  // Записи носіїв — лише з відомих адрес: інакше файл імпорту міг би підсунути довільну адресу для <audio>
  const AUDIO_OK = /^https:\/\/(api\.dictionaryapi\.dev\/media\/|ssl\.gstatic\.com\/dictionary\/|upload\.wikimedia\.org\/)[^\s"'<>]+\.(mp3|ogg|wav)$/i;
  EN.cleanWord = function (w) {
    if (!w || typeof w !== 'object') return null;
    const out = { en: str(w.en, 200), uk: str(w.uk, 300) };
    if (!out.en || !out.uk) return null;
    const note = str(w.note, 300), ex = str(w.ex, 500), ipa = str(w.ipa, 100), added = str(w.added, 10);
    if (note) out.note = note;
    if (ex) out.ex = ex;
    if (ipa) out.ipa = ipa;
    if (/^\d{4}-\d{2}-\d{2}$/.test(added)) out.added = added;
    if (w.au && typeof w.au === 'object') {
      const au = {};
      for (const k of ['us', 'gb', 'au']) if (typeof w.au[k] === 'string' && AUDIO_OK.test(w.au[k])) au[k] = w.au[k];
      if (Object.keys(au).length) out.au = au;
    }
    return out;
  };
  EN.cleanCard = function (c) {
    if (!c || typeof c !== 'object') return null;
    const int = (v, lo, hi) => Math.min(hi, Math.max(lo, Math.round(+v) || 0));
    const due = Math.round(+c.due);
    if (!isFinite(due)) return null;
    return { due, int: int(c.int, 0, 36500), ease: Math.min(5, Math.max(1.3, +c.ease || 2.5)), reps: int(c.reps, 0, 100000), lapses: int(c.lapses, 0, 100000) };
  };
  // Ключ однакового слова: регістр, апострофи й зайві пробіли не роблять його новим словом
  EN.dictKey = (en) => String(en).toLowerCase().replace(/[’‘`´]/g, "'").replace(/\s+/g, ' ').trim();
  // Налаштування й словник потрапляють у розмітку, тож вони мають бути саме числами, відомими рядками й чистими записами
  function tidy(s) {
    const st = s.settings;
    if (!['us', 'gb'].includes(st.accent)) st.accent = 'us';
    st.voice = String(st.voice || '');
    st.rate = Math.min(1.2, Math.max(0.5, +st.rate || 0.9));
    st.strict = !!st.strict;
    st.autoIpa = st.autoIpa !== false;
    st.newPerDay = Math.min(50, Math.max(0, Math.round(+st.newPerDay) || 0));
    if (!['mix', 'en', 'uk'].includes(st.dir)) st.dir = 'mix';
    if (!['new', 'az', 'due'].includes(s.ui.dictSort)) s.ui.dictSort = 'new';
    const seen = new Set();
    s.dict = (Array.isArray(s.dict) ? s.dict : []).map(EN.cleanWord).filter((w) => w && !seen.has(EN.dictKey(w.en)) && seen.add(EN.dictKey(w.en)));
    return s;
  }
  // newer — прогрес записала новіша версія тренажера: тоді нічого не записуємо, щоб старий код його не зіпсував;
  // broken — збережене не вдалося прочитати; failed — останній запис не вдався
  EN.store = { key: STORE_KEY, newer: false, broken: null, failed: null };
  function load() {
    let raw = null;
    try { raw = localStorage.getItem(STORE_KEY); } catch (e) { EN.store.broken = e; console.warn('Сховище недоступне', e); return clone(DEFAULTS); }
    if (!raw) return clone(DEFAULTS);
    try {
      const data = JSON.parse(raw);
      if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('не об\'єкт');
      EN.store.newer = (+data.v || 1) > VERSION;
      return tidy(merge(clone(DEFAULTS), migrate(data)));
    } catch (e) {
      // Наступне збереження затерло б пошкоджений запис, тому копія лишається поруч для ручного відновлення
      EN.store.broken = e;
      console.warn('Не вдалося прочитати прогрес; копію збережено під ключем ' + STORE_KEY + '-broken', e);
      try { localStorage.setItem(STORE_KEY + '-broken', raw); } catch (e2) { console.warn(e2); }
      return clone(DEFAULTS);
    }
  }
  EN.S = load();
  let warnedAt = 0;
  EN.save = function () {
    if (EN.store.newer) return;
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(EN.S));
      EN.store.failed = null;
    } catch (e) {
      EN.store.failed = e;
      console.warn('Прогрес не збережено', e);
      if (Date.now() - warnedAt > 60000 && document.body) {
        warnedAt = Date.now();
        EN.toast('⚠️ Прогрес не зберігся (' + (e && e.name || e) + '). Подробиці — у ⚙️ «Налаштування».', 6000);
      }
    }
  };
  // Зберігається завжди весь стан, тож без перечитування наступне збереження тут затерло б те, що записала
  // інша вкладка чи встановлений додаток. Екран перемальовує EN.onExternalChange (views2.js).
  window.addEventListener('storage', (e) => {
    if (e.key !== STORE_KEY && e.key !== null) return;   // null — сховище сайту очистили повністю
    EN.S = load();
    if (EN.onExternalChange) EN.onExternalChange();
  });

  // persisted: true — Chrome не видалить дані сайту сам, навіть коли забракне місця; false — може; null — невідомо.
  // Chrome вирішує без запитання: зазвичай дозволяє встановленим додаткам, закладкам і сайтам, якими часто користуються.
  EN.Storage = {
    persisted: null, listeners: [],
    async check(ask) {
      const st = navigator.storage;
      if (!st || !st.persisted) return this.persisted;
      try {
        let p = await st.persisted();
        if (!p && ask && st.persist) p = await st.persist();
        this.persisted = !!p;
      } catch (e) { this.persisted = null; }
      this.listeners.forEach((f) => f());
      return this.persisted;
    }
  };
  EN.isInstalled = () => !!(window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  // Chrome віддає подію beforeinstallprompt один раз; зберігаємо її, щоб кнопка «Встановити» спрацювала пізніше
  EN.Install = {
    prompt: null, listeners: [],
    notify() { this.listeners.forEach((f) => f()); },
    async run() {
      const p = this.prompt; if (!p) return;
      this.prompt = null;
      p.prompt();
      try { await p.userChoice; } catch (e) { console.warn(e); }
      this.notify();
    }
  };
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); EN.Install.prompt = e; EN.Install.notify(); });
  window.addEventListener('appinstalled', () => { EN.Install.prompt = null; EN.Storage.check(true); EN.Install.notify(); });
  EN.replaceState = function (obj) { EN.S = tidy(merge(clone(DEFAULTS), obj)); EN.save(); };
  EN.resetState = function () { EN.S = clone(DEFAULTS); EN.save(); };
  // Часткові скидання зберігають налаштування і мій словник
  EN.resetLessons = function () { EN.S.lessons = {}; EN.S.modules = {}; EN.save(); };
  EN.resetWords = function () { EN.S.cards = {}; EN.S.newDay = { day: 0, count: 0 }; EN.save(); };

  // Номер дня рахується за місцевим часом: інакше заняття о пів на першу ночі потрапляло б у вчорашній день
  EN.today = function () {
    const d = new Date();
    return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000);
  };
  EN.dayOfWeek = function (dayNum) { return new Date(dayNum * 86400000).getUTCDay(); }; // 0 = неділя
  EN.isoDay = (dayNum) => new Date(dayNum * 86400000).toISOString().slice(0, 10);
  EN.logActivity = function (kind, n) {
    const t = EN.today();
    const d = EN.S.days[t] || (EN.S.days[t] = { ex: 0, cards: 0, speak: 0 });
    d[kind] = (d[kind] || 0) + (n || 1);
    if (!EN.S.start) EN.S.start = t;
    EN.save();
  };
  // Вихідні не розривають серію: навчання заплановано лише на робочі дні
  EN.streak = function () {
    const t = EN.today();
    let day = t, count = 0;
    if (!EN.S.days[t]) day = t - 1;
    for (let i = 0; i < 800; i++, day--) {
      const active = !!EN.S.days[day];
      const wd = EN.dayOfWeek(day);
      if (active) count++;
      else if (wd === 0 || wd === 6) continue;
      else break;
    }
    return count;
  };

  EN.esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  EN.shuffle = function (a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  // [[текст]] або [[текст|що озвучити]] → клікабельний англійський фрагмент. Лише для даних уроків: вони вже є HTML
  EN.rich = function (html) {
    return String(html || '').replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (m, shown, said) =>
      '<span class="say" data-say="' + EN.esc(String(said || shown).replace(/<[^>]+>/g, '')) + '">' + shown + '</span>');
  };
  // Для тексту, який увів учень (мій словник, імпорт), екрануються і показане, і озвучуване
  EN.sayHtml = (shown, said) => '<span class="say" data-say="' + EN.esc(said == null ? shown : said) + '">' + EN.esc(shown) + '</span>';
  // Примітки в дужках не озвучуються, а «flat / apartment» звучить як перелік
  EN.sayText = (s) => String(s).replace(/\s\/\s/g, ', ').replace(/\s*\([^)]*\)/g, '').trim();
  EN.toast = function (msg, ms) {
    let el = document.getElementById('toast');
    if (!el) { el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; document.body.appendChild(el); }
    el.textContent = msg; el.classList.add('show');
    clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('show'), ms || 2200);
  };
  // Телефон чи планшет: там екранна клавіатура закриває пів екрана, а підказки про клавіші не мають сенсу
  EN.touch = () => !!(window.matchMedia && matchMedia('(pointer: coarse)').matches);

  // Регістр і розділові знаки не важливі; дефіс = пробіл (twenty-five = twenty five)
  EN.norm = (s) => String(s).toLowerCase().replace(/[’‘`´]/g, "'").replace(/[.,!?;:"„“”«»()…–—-]/g, ' ').replace(/\s+/g, ' ').trim();
  // Британський і американський правопис зараховуються однаково (colour = color, organise = organize).
  // Заміни роблять з обох боків, тому «promise» → «promize» нічого не ламає. -our лише за списком: інакше four = for
  function spelling(s) {
    return s
      .replace(/\bpractise(s|d)?\b/g, 'practice$1').replace(/\blicence(s?)\b/g, 'license$1')
      .replace(/\bdefence(s?)\b/g, 'defense$1').replace(/\boffence(s?)\b/g, 'offense$1')
      .replace(/\b(colo|favo|flavo|hono|humo|labo|neighbo|behavio|harbo|rumo|savo|vapo|armo|odo|endeavo|parlo|tumo|vigo)ur/g, '$1r')
      .replace(/\b(cent|theat|met|lit|fib|kilomet|centimet|millimet|calib|somb|spect|lust|meag)re(s|d)?\b/g, '$1er$2')
      .replace(/\b(\w{2,})is(e|es|ed|er|ers|ing|ation|ations)\b/g, '$1iz$2')
      .replace(/\b(\w{2,})ys(e|es|ed|ing)\b/g, '$1yz$2')
      .replace(/\b(travel|cancel|label|model|fuel|level|signal|marvel|quarrel|counsel|dial|equal|total|jewel)l(ed|ing|er|ers|ous)\b/g, '$1$2')
      .replace(/\bjewellery\b/g, 'jewelry').replace(/\bgrey\b/g, 'gray').replace(/\bprogramme(s?)\b/g, 'program$1')
      .replace(/\bmum(s?)\b/g, 'mom$1').replace(/\bmaths\b/g, 'math').replace(/\bcatalogue\b/g, 'catalog');
  }
  // Скорочення розгортаються (I'm = I am, don't = do not). Неоднозначні 's і 'd дають варіанти (is / has, would / had).
  // 's розгортаємо лише після займенників: у «John's car» це присвійний відмінок
  const S_WORDS = 'he|she|it|that|there|here|what|where|who|how|when|why|this|everything|nothing|something|everyone|someone|nobody|everybody|somebody';
  function forkAll(list, re, a, b) {
    const out = [];
    for (const x of list) {
      let res = [''];
      let last = 0;
      for (const m of x.matchAll(re)) {
        const head = x.slice(last, m.index) + m[1] + ' ';
        res = res.flatMap((r) => [r + head + a, r + head + b]).slice(0, 8);
        last = m.index + m[0].length;
      }
      res.forEach((r) => out.push(r + x.slice(last)));
    }
    return out.slice(0, 16);
  }
  function variants(s) {
    s = s.replace(/\bwon't\b/g, 'will not').replace(/\bcan't\b/g, 'cannot').replace(/\bshan't\b/g, 'shall not').replace(/\bcan not\b/g, 'cannot')
      .replace(/n't\b/g, ' not').replace(/'m\b/g, ' am').replace(/'re\b/g, ' are').replace(/'ve\b/g, ' have').replace(/'ll\b/g, ' will')
      .replace(/\blet's\b/g, 'let us');
    // У пропуск після займенника учень вписує й саме скорочення: «I ___ been waiting» → «'d been waiting»
    let out = /^'s\b/.test(s) ? [s.replace(/^'s/, 'is'), s.replace(/^'s/, 'has')] : /^'d\b/.test(s) ? [s.replace(/^'d/, 'would'), s.replace(/^'d/, 'had')] : [s];
    out = forkAll(out, new RegExp("\\b(" + S_WORDS + ")'s\\b", 'g'), 'is', 'has');
    out = forkAll(out, /\b(i|you|he|she|it|we|they|there|that)'d\b/g, 'would', 'had');
    return out.map((x) => x.replace(/'/g, '').replace(/\s+/g, ' ').trim());
  }
  function canon(s, exact) {
    const n = spelling(EN.norm(s));
    return exact ? [n] : variants(n);
  }
  // Одна описка (пропущена, зайва, змінена чи переставлена буква) у слові з 6+ літер, коли останні дві літери збігаються:
  // так «beatiful» — майже, а «work» замість «works» чи «studies» замість «studied» — помилка граматики, а не описка
  function oneTypo(a, b) {
    if (a === b || Math.min(a.length, b.length) < 5 || Math.max(a.length, b.length) < 6 || Math.abs(a.length - b.length) > 1) return false;
    if (a.slice(-2) !== b.slice(-2)) return false;
    let i = 0;
    while (i < a.length && a[i] === b[i]) i++;
    if (a.length === b.length) {
      if (a.slice(i + 1) === b.slice(i + 1)) return true;
      return a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2);
    }
    const [l, s] = a.length > b.length ? [a, b] : [b, a];
    return l.slice(i + 1) === s.slice(i);
  }
  function near(x, y) {
    const a = x.split(' '), b = y.split(' ');
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let k = 0; k < a.length; k++) if (a[k] !== b[k]) { if (++diff > 1 || !oneTypo(a[k], b[k])) return false; }
    return diff === 1;
  }
  // 'ok' | 'near' (одна описка: зараховується, якщо не ввімкнено суворий режим) | 'bad'.
  // exact — для вправ на правопис і скорочення: без розгортання скорочень і без допуску на описку
  EN.check = function (input, answers, exact) {
    const list = Array.isArray(answers) ? answers : [answers];
    if (!EN.norm(input)) return 'bad';
    const inp = canon(input, exact);
    const ans = list.flatMap((a) => canon(a, exact));
    if (inp.some((x) => ans.includes(x))) return 'ok';
    if (!exact && inp.some((x) => ans.some((y) => near(x, y)))) return 'near';
    return 'bad';
  };

  // Два рушії озвучення: 1) англійський голос системи (Web Speech API, є майже всюди й працює офлайн);
  // 2) онлайн-голос Google (потрібен інтернет) — коли голосу потрібного акценту в системі немає або учень вибрав його сам
  const ONLINE = '@online';   // значення settings.voice для онлайн-голосу; '' — вибір автоматично
  const LANG = { us: 'en-US', gb: 'en-GB' };
  const ONLINE_URLS = [       // друга адреса — запасна, якщо перша не відповіла
    (q, tl) => 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=' + tl + '&q=' + encodeURIComponent(q),
    (q, tl) => 'https://translate.googleapis.com/translate_tts?ie=UTF-8&client=gtx&tl=' + tl + '&q=' + encodeURIComponent(q)
  ];
  // Онлайн-сервіс приймає до ~200 символів за запит: ріжемо за реченнями, а задовгі речення — між словами
  EN.ttsChunks = function (text, max) {
    const out = [];
    let cur = '';
    for (const w of String(text).replace(/\s+/g, ' ').trim().split(' ')) {
      if (cur && (cur + ' ' + w).length > max) { out.push(cur); cur = w; } else cur = cur ? cur + ' ' + w : w;
      if (/[.!?…]$/.test(cur) && cur.length > max / 2) { out.push(cur); cur = ''; }
    }
    if (cur) out.push(cur);
    return out;
  };
  // Нейронні голоси (Edge «Natural», Google, Apple «Premium / Enhanced») звучать набагато природніше за старі системні
  const quality = (v) => (/natural|neural/i.test(v.name) ? 3 : /google|premium|enhanced|siri/i.test(v.name) ? 2 : v.localService ? 1 : 0);
  const accentOf = (v) => (/^en[-_](gb|uk)/i.test(v.lang) ? 'gb' : /^en[-_]us/i.test(v.lang) ? 'us' : 'other');
  EN.TTS = {
    ONLINE, LANG,
    voices: [],
    ready: false, settled: false, listeners: [],
    system: 'speechSynthesis' in window,
    audio: null,
    token: 0,                 // події застарілого озвучення (після нового say) мають ігноруватися
    accentOf,
    init() {
      const notify = () => this.listeners.forEach((f) => f());
      window.addEventListener('online', notify);
      window.addEventListener('offline', notify);
      if (!this.system) { this.ready = this.settled = true; notify(); return; }
      const load = () => {
        this.voices = speechSynthesis.getVoices().filter((v) => v && v.lang && /^en([-_]|$)/i.test(v.lang) && v.name && v.name !== 'undefined')
          .sort((a, b) => quality(b) - quality(a));
        this.ready = true;
        notify();
      };
      load();
      speechSynthesis.onvoiceschanged = load;
      setTimeout(() => { this.settled = true; load(); }, 1500);
    },
    // Голос системи для акценту (us | gb), яким говоримо зараз, або null — тоді говорить онлайн-голос
    voice(accent) {
      const v = this.voices, want = EN.S.settings.voice;
      accent = accent || EN.S.settings.accent;
      if (accent === EN.S.settings.accent) {
        if (want === ONLINE) return null;
        // Вибраний голос іншого акценту не має «перебивати» акцент: 🇬🇧 мусить звучати по-британськи
        const chosen = v.find((x) => x.name === want);
        if (chosen && accentOf(chosen) !== (accent === 'gb' ? 'us' : 'gb')) return chosen;
      }
      return v.find((x) => accentOf(x) === accent) || null;
    },
    label(accent) { const v = this.voice(accent); return v ? v.name : 'Google — ' + ((accent || EN.S.settings.accent) === 'gb' ? 'британська' : 'американська') + ' вимова, онлайн'; },
    // true — озвучити нічим: англійського голосу в системі немає, а інтернету для онлайн-голосу теж немає
    silent() { return this.settled && !this.voices.length && navigator.onLine === false; },
    stop() {
      this.token++;
      if (this.system) speechSynthesis.cancel();
      if (this.audio) this.audio.pause();
    },
    // accent — 'us' | 'gb', щоб послухати слово з іншим акцентом; без нього — з налаштувань
    say(text, rate, accent) {
      if (!text) return;
      this.stop();
      rate = rate || EN.S.settings.rate || 0.9;
      accent = accent || EN.S.settings.accent;
      const v = this.voice(accent);
      if (v) this.sayLocal(text, rate, v); else this.sayOnline(text, rate, accent);
    },
    sayLocal(text, rate, v) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = v.lang || 'en-US';
      u.voice = v;
      u.rate = rate;
      speechSynthesis.speak(u);
    },
    sayOnline(text, rate, accent) {
      const parts = EN.ttsChunks(text, 180), token = this.token, tl = LANG[accent] || 'en-US';
      // Один <audio> на всю сесію: Safari дозволяє вже «розблокованому» елементу грати без нового натискання
      const a = this.audio || (this.audio = new Audio());
      let i = 0, url = 0;
      const play = () => {
        a.src = ONLINE_URLS[url](parts[i], tl);
        a.defaultPlaybackRate = a.playbackRate = rate;   // нове src скидає швидкість, тому лише після нього
        a.play().catch((e) => { if (token === this.token && e && e.name === 'NotAllowedError') EN.toast('Натисніть 🔊, щоб послухати'); });
      };
      a.onended = () => { if (token === this.token && ++i < parts.length) play(); };
      a.onerror = () => {
        if (token !== this.token) return;
        if (++url < ONLINE_URLS.length) { play(); return; }
        const v = this.voices[0];
        if (v) { this.sayLocal(parts.slice(i).join(' '), rate, v); return; }   // без інтернету рятує будь-який англійський голос системи
        EN.toast('🔇 Онлайн-голос недоступний (немає інтернету?), а англійського голосу в системі немає. Див. ⚙️ «Налаштування».');
      };
      play();
    },
    // Запис живої людини зі словника — звичайний аудіофайл, без синтезу
    playUrl(url, rate) {
      this.stop();
      const a = this.audio || (this.audio = new Audio()), token = this.token;
      a.onended = null;
      a.onerror = () => { if (token === this.token) EN.toast('Запис носія не завантажився (немає інтернету?)'); };
      a.src = url;
      a.defaultPlaybackRate = a.playbackRate = rate || 1;
      a.play().catch(() => {});
    }
  };

  EN.Rec = {
    mr: null, url: null,
    supported: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder),
    async start(onStop, onError) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const chunks = [];
        this.mr = new MediaRecorder(stream);
        this.mr.ondataavailable = (e) => chunks.push(e.data);
        this.mr.onstop = () => {
          stream.getTracks().forEach((t) => t.stop());
          if (this.url) URL.revokeObjectURL(this.url);
          this.url = URL.createObjectURL(new Blob(chunks, { type: this.mr.mimeType || 'audio/webm' }));
          onStop(this.url);
        };
        this.mr.start();
      } catch (e) { onError(e); }
    },
    stop() { if (this.mr && this.mr.state !== 'inactive') this.mr.stop(); },
    active() { return !!(this.mr && this.mr.state === 'recording'); }
  };

  EN.recorderWidget = function (container) {
    if (!EN.Rec.supported) {
      container.innerHTML = '<span class="small muted">Запис голосу недоступний у цьому браузері.</span>';
      return;
    }
    container.innerHTML = '<button class="btn rec-btn">● Записати себе</button> <audio class="rec-audio" controls style="display:none;vertical-align:middle;max-width:260px"></audio>';
    const btn = container.querySelector('.rec-btn');
    const audio = container.querySelector('.rec-audio');
    btn.onclick = () => {
      if (EN.Rec.active()) { EN.Rec.stop(); return; }
      EN.Rec.start((url) => {
        btn.textContent = '● Записати ще раз';
        audio.src = url; audio.style.display = '';
        EN.logActivity('speak');
      }, (e) => {
        btn.textContent = '● Записати себе';
        EN.toast('Немає доступу до мікрофона: ' + (e && e.name ? e.name : e));
      });
      btn.textContent = '■ Зупинити запис';
    };
  };

  EN.lessons = EN.lessons || [];
  EN.lessonById = (id) => EN.lessons.find((l) => l.id === id);
  EN.lessonState = function (id) { return EN.S.lessons[id] || (EN.S.lessons[id] = {}); };
  // Стан уроку: {opened, theory, ex:{best,done}, speak, mission, skipped, run}
  //   done    — вправи виконано на ≥ 80%;  skipped — учень пропустив урок («вже знаю» / «почати з іншого уроку»);
  //   run     — незавершений підхід до вправ (див. exercises.js), щоб продовжити пізніше
  EN.lessonDone = (id) => !!(EN.S.lessons[id] && EN.S.lessons[id].ex && EN.S.lessons[id].ex.done);
  EN.lessonSkipped = (id) => !!(EN.S.lessons[id] && EN.S.lessons[id].skipped) && !EN.lessonDone(id);
  EN.lessonClosed = (id) => EN.lessonDone(id) || EN.lessonSkipped(id);
  EN.currentLesson = function () { return EN.lessons.find((l) => !EN.lessonClosed(l.id)) || EN.lessons[EN.lessons.length - 1]; };
  EN.skipLesson = function (id, on) { const st = EN.lessonState(id); if (on) st.skipped = true; else delete st.skipped; EN.save(); };
  // «Пройти наново» скидає позначки й вправи, але слова уроку лишаються в повторенні
  EN.resetLesson = function (id) { const st = EN.lessonState(id); ['theory', 'ex', 'speak', 'mission', 'skipped', 'run'].forEach((k) => delete st[k]); EN.save(); };
  EN.startFrom = function (id) {
    for (const l of EN.lessons) { if (l.id === id) break; if (!EN.lessonDone(l.id)) EN.lessonState(l.id).skipped = true; }
    delete EN.lessonState(id).skipped;
    EN.save();
  };

  EN.cardId = (lessonId, en) => lessonId + '|' + en;
  // Слова з уроків, які учень уже відкривав, + мій словник. only: 'my' — лише мій словник
  // Слово, що є в кількох уроках, — одна картка з id за першим уроком, де воно з'являється. Так id не залежить від того,
  // який урок учень відкрив першим, і прогрес слова не губиться
  let firstOf = null;
  const firstLesson = (en) => {
    if (!firstOf) {
      firstOf = new Map();
      EN.lessons.forEach((l) => (l.vocab || []).forEach((w) => { const k = w[0].toLowerCase(); if (!firstOf.has(k)) firstOf.set(k, [l.id, w[0]]); }));
    }
    return firstOf.get(en.toLowerCase());
  };
  EN.allWords = function (only) {
    const out = [], seen = new Set();
    if (only !== 'my') EN.lessons.forEach((l) => {
      if (!(EN.S.lessons[l.id] && EN.S.lessons[l.id].opened)) return;
      (l.vocab || []).forEach((w) => {
        const [lid, en] = firstLesson(w[0]) || [l.id, w[0]], id = EN.cardId(lid, en);
        if (seen.has(id)) return;
        seen.add(id);
        out.push({ id, en: w[0], uk: w[1], note: w[2] || '', lesson: l.id });
      });
    });
    EN.S.dict.forEach((w) => out.push({ id: EN.cardId('my', w.en), en: w.en, uk: w.uk, note: w.note || '', ipa: w.ipa || '', ex: w.ex || '', au: w.au, lesson: 'my' }));
    return out;
  };
  EN.srsQueue = function (only) {
    const t = EN.today();
    const words = EN.allWords(only);
    const due = EN.shuffle(words.filter((w) => EN.S.cards[w.id] && EN.S.cards[w.id].due <= t));
    if (EN.S.newDay.day !== t) EN.S.newDay = { day: t, count: 0 };
    const room = Math.max(0, (EN.S.settings.newPerDay || 10) - EN.S.newDay.count);
    const fresh = words.filter((w) => !EN.S.cards[w.id]).slice(0, room);
    return { due, fresh, total: due.length + fresh.length };
  };
  EN.srsCounts = function (only) {
    const t = EN.today();
    const words = EN.allWords(only);
    const due = words.filter((w) => EN.S.cards[w.id] && EN.S.cards[w.id].due <= t).length;
    const known = words.filter((w) => EN.S.cards[w.id] && EN.S.cards[w.id].reps > 0).length;
    const unseen = words.filter((w) => !EN.S.cards[w.id]).length;
    return { due, known, unseen, all: words.length };
  };
  function nextInterval(c, grade) {
    if (c.reps === 0) return grade === 4 ? 3 : 1;
    if (c.reps === 1) return grade === 2 ? 2 : grade === 4 ? 6 : 4;
    return Math.round(c.int * (grade === 2 ? 1.2 : grade === 4 ? c.ease * 1.3 : c.ease));
  }
  // grade: 1 знову, 2 важко, 3 добре, 4 легко
  EN.srsGrade = function (word, grade) {
    const t = EN.today();
    let c = EN.S.cards[word.id];
    if (!c) {
      c = EN.S.cards[word.id] = { due: t, int: 0, ease: 2.5, reps: 0, lapses: 0 };
      if (EN.S.newDay.day !== t) EN.S.newDay = { day: t, count: 0 };
      EN.S.newDay.count++;
    }
    if (grade === 1) {
      c.lapses++; c.reps = 0; c.int = 0; c.ease = Math.max(1.3, c.ease - 0.2); c.due = t;
    } else {
      const next = nextInterval(c, grade);
      if (grade === 2) c.ease = Math.max(1.3, c.ease - 0.15);
      if (grade === 4) c.ease += 0.15;
      c.int = Math.max(1, next); c.reps++; c.due = t + c.int;
    }
    EN.logActivity('cards');
    EN.save();
  };
  EN.nextIntervalLabel = function (word, grade) {
    if (grade === 1) return 'сьогодні';
    const next = Math.max(1, nextInterval(EN.S.cards[word.id] || { int: 0, ease: 2.5, reps: 0 }, grade));
    return next < 30 ? next + ' дн.' : Math.round(next / 30) + ' міс.';
  };
})(window.EN);

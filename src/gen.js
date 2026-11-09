/* Генератор вправ на числа, ціни, час, дати, роки, номери телефонів і spelling.
 * Без DOM, бо його також запускає validate.mjs. У даних уроку: { t: 'g', g: '<назва>', min?, max? } —
 * під час запуску стає звичайною вправою 'l' або 'i' з новими випадковими даними. */
window.EN = window.EN || {};
(function (EN) {
  'use strict';
  const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen',
    'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const MONTHS = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const MONTH_DAYS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const ORD_IRREG = { one: 'first', two: 'second', three: 'third', five: 'fifth', eight: 'eighth', nine: 'ninth', twelve: 'twelfth' };

  const under100 = (n) => (n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : ''));
  // and — британська норма (one hundred and five); американці часто кажуть без нього, і обидва варіанти правильні
  function under1000(n, and) {
    const h = Math.floor(n / 100), r = n % 100;
    let s = h ? ONES[h] + ' hundred' : '';
    if (r) s += (h ? (and ? ' and ' : ' ') : '') + under100(r);
    return s;
  }
  /** Число 0–999 999 999 словами. and: true — британське «one hundred and five» (за замовчуванням) */
  function words(n, and) {
    if (and === undefined) and = true;
    if (n === 0) return 'zero';
    const m = Math.floor(n / 1e6), th = Math.floor(n / 1000) % 1000, rest = n % 1000, parts = [];
    if (m) parts.push(under1000(m, and) + ' million');
    if (th) parts.push(under1000(th, and) + ' thousand');
    if (rest) parts.push((parts.length && rest < 100 && and ? 'and ' : '') + under1000(rest, and));
    return parts.join(' ');
  }
  function ordinal(n) {
    const p = under100(n).split('-');
    const last = p.pop();
    p.push(ORD_IRREG[last] || (last.endsWith('y') ? last.slice(0, -1) + 'ieth' : last + 'th'));
    return p.join('-');
  }
  // Рік: 1990 — nineteen ninety, 1905 — nineteen oh five, 2006 — two thousand and six, 2026 — twenty twenty-six
  function yearWords(y, alt) {
    const hi = Math.floor(y / 100), lo = y % 100;
    if (y >= 2000 && y < 2010) return lo ? 'two thousand ' + (alt ? '' : 'and ') + ONES[lo] : 'two thousand';
    if (y >= 2010 && y < 2100 && alt) return 'two thousand and ' + under100(lo);
    if (lo === 0) return under100(hi) + ' hundred';
    return under100(hi) + ' ' + (lo < 10 ? 'oh ' + ONES[lo] : under100(lo));
  }
  // Усі правильні способи сказати час h:m (h 1–12): цифровий (three fifteen) і традиційний (quarter past three)
  function timeVariants(h, m) {
    const H = under100(h), next = under100(h % 12 + 1), v = [];
    if (m === 0) return [H + " o'clock", H];
    v.push(H + ' ' + (m < 10 ? 'oh ' + ONES[m] : under100(m)));
    if (m === 15) v.push('quarter past ' + H, 'a quarter past ' + H);
    else if (m === 30) v.push('half past ' + H);
    else if (m === 45) v.push('quarter to ' + next, 'a quarter to ' + next);
    else if (m < 30) v.push(under100(m) + ' past ' + H, under100(m) + ' minutes past ' + H);
    else v.push(under100(60 - m) + ' to ' + next, under100(60 - m) + ' minutes to ' + next);
    return v;
  }
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const digits = (s) => String(s).replace(/[^\d]/g, '');
  // Порівняння словами: регістр, дефіси, «and», «a hundred» = «one hundred» і «It's» на початку не важливі
  const wnorm = (s) => String(s).toLowerCase().replace(/[’']/g, '').replace(/[-.,!?;:]/g, ' ').replace(/\bafter\b/g, 'past')
    .replace(/^\s*(it is|its)\s+/, '').replace(/\band\b/g, ' ').replace(/(^|\s)a (hundred|thousand|million|quarter)/g, '$1one $2')
    .replace(/\bone quarter\b/g, 'quarter').replace(/\bthe\b|\bof\b/g, ' ').replace(/\s+/g, ' ').trim();
  const sameWords = (answers) => (v) => (answers.map(wnorm).includes(wnorm(v)) ? 'ok' : 'bad');
  // Імена й слова, які в Словаччині чи на роботі доводиться диктувати по буквах; є пари, що плутаються на слух (E/I, G/J, A/R)
  const SPELL = ['Kovalenko', 'Shevchenko', 'Bondarenko', 'Tkachenko', 'Kravchuk', 'Melnyk', 'Hryhorii', 'Yevhen', 'Oksana', 'Yuliia',
    'Kyiv', 'Lviv', 'Kharkiv', 'Zhytomyr', 'Bratislava', 'Kosice', 'Zilina', 'George', 'Jacob', 'Heather', 'Gareth', 'Ivy', 'Irene',
    'Eugene', 'Jessica', 'Rachel', 'Agnes', 'Harry', 'Quentin', 'Wendy', 'Xavier', 'Yvonne', 'Zachary', 'email', 'password', 'address',
    'schedule', 'receipt', 'Wednesday', 'February', 'queue', 'colleague', 'necessary', 'business'];

  const G = {
    // 🎧 число → цифрами
    numListen(sp) {
      const n = rnd(sp.min ?? 0, sp.max ?? 100), say = words(n, Math.random() < 0.6);
      return { t: 'l', h: 'Прослухайте й запишіть цифрами', say, a: String(n), nodia: true, ph: 'цифрами, напр. 47',
        check: (v) => (digits(v) !== '' && Number(digits(v)) === n ? 'ok' : 'bad'), e: 'Словами: ' + words(n) };
    },
    // 🎧 -teen чи -ty: 13 і 30, 14 і 40 українці плутають найчастіше; різниця — у наголосі й довгому «-ті:н»
    teenListen() {
      const k = rnd(3, 9), n = Math.random() < 0.5 ? 10 + k : k * 10;
      return { t: 'l', h: 'Прослухайте: -teen чи -ty? Запишіть цифрами', say: words(n), a: String(n), nodia: true, ph: 'напр. 14 або 40',
        check: (v) => (Number(digits(v)) === n ? 'ok' : 'bad'),
        e: n < 20 ? '[[' + words(n) + ']] — наголос у кінці, довге «-ті:н»; пара: [[' + words(k * 10) + ']]' : '[[' + words(n) + ']] — наголос на початку, коротке «-ті»; пара: [[' + words(10 + k) + ']]' };
    },
    // 🎧 ціна → цифрами
    priceListen(sp) {
      const e = rnd(sp.min ?? 1, sp.max ?? 49), c = Math.random() < 0.25 ? 0 : pick([5, 10, 20, 25, 49, 50, 75, 80, 95, 99, rnd(11, 98)]);
      const cur = pick(['£', '$', '€']);
      const unit = { '£': ['pound', 'pounds', 'p', 'pence'], '$': ['dollar', 'dollars', 'cent', 'cents'], '€': ['euro', 'euros', 'cent', 'cents'] }[cur];
      const main = words(e) + ' ' + (e === 1 ? unit[0] : unit[1]);
      const say = !c ? main : Math.random() < 0.3 ? words(e) + ' ' + under100(c) : cur === '£' ? main + ' ' + under100(c) : main + ' and ' + under100(c) + ' ' + (c === 1 ? unit[2] : unit[3]);
      const shown = cur + e + '.' + String(c).padStart(2, '0');
      return { t: 'l', h: 'Прослухайте ціну й запишіть цифрами', say, a: shown, nodia: true, ph: 'напр. 3.49',
        check: (v) => {
          const m = String(v).replace(/[£$€]|pounds?|dollars?|euros?/gi, '').replace(/\s+/g, '').replace(',', '.');
          return m !== '' && !isNaN(+m) && Math.round(+m * 100) === e * 100 + c ? 'ok' : 'bad';
        }, e: 'Словами: ' + say + '. В англійській десяткова <b>крапка</b>: ' + shown };
    },
    // 🎧 час → цифрами (і 3:15, і 15:15 правильно, бо в розмові «am / pm» зазвичай не кажуть)
    timeListen() {
      const h = rnd(1, 12), m = Math.random() < 0.3 ? 0 : pick([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, rnd(1, 59)]);
      const vs = timeVariants(h, m), say = m && Math.random() < 0.5 && vs.length > 1 ? vs[1] : vs[0];
      const shown = h + ':' + String(m).padStart(2, '0');
      return { t: 'l', h: 'Прослухайте час і запишіть цифрами', say, a: shown, nodia: true, ph: 'напр. 3:45',
        check: (v) => {
          // Кома — бо на телефоні цифрова клавіатура (inputmode="decimal") в українській локалі має кому, а не двокрапку
          const p = String(v).trim().match(/^(\d{1,2})(?:\s*[:.,\s]\s*(\d{2}))?$/);
          if (!p) return 'bad';
          const hh = +p[1], mm = p[2] ? +p[2] : 0;
          return mm === m && (hh === h || hh === h + 12 || (h === 12 && hh === 0)) ? 'ok' : 'bad';
        }, e: 'Словами: ' + vs.join(' = ') };
    },
    // 🎧 дата → цифрами у звичному для нас порядку «день.місяць»
    dateListen() {
      const mo = rnd(1, 12), d = rnd(1, MONTH_DAYS[mo]), o = ordinal(d);
      const say = pick(['the ' + o + ' of ' + MONTHS[mo], MONTHS[mo] + ' the ' + o, MONTHS[mo] + ' ' + o]);
      return { t: 'l', h: 'Прослухайте дату й запишіть цифрами: день.місяць', say, a: d + '.' + mo, nodia: true, ph: 'напр. 24.8',
        check: (v) => { const p = String(v).match(/(\d{1,2})\D+(\d{1,2})/); return p && +p[1] === d && +p[2] === mo ? 'ok' : 'bad'; },
        e: 'Словами: ' + say + '. Британці пишуть 24/8, американці — 8/24 (спершу місяць!)' };
    },
    // 🎧 рік → цифрами
    yearListen(sp) {
      const y = rnd(sp.min ?? 1900, sp.max ?? 2099), say = yearWords(y, Math.random() < 0.3);
      return { t: 'l', h: 'Прослухайте рік і запишіть цифрами', say, a: String(y), nodia: true, ph: 'напр. 1998',
        check: (v) => (Number(digits(v)) === y ? 'ok' : 'bad'), e: 'Словами: ' + say };
    },
    // 🎧 номер телефону: цифри по одній, 0 — «oh», дві однакові поспіль — «double»
    phoneListen() {
      const num = '0' + Array.from({ length: rnd(8, 9) }, () => rnd(0, 9)).join('');
      const groups = num.match(/.{1,3}/g);
      const say = groups.map((g) => {
        const out = [];
        for (let i = 0; i < g.length; i++) {
          const w = g[i] === '0' ? 'oh' : ONES[+g[i]];
          if (g[i] === g[i + 1]) { out.push('double ' + w); i++; } else out.push(w);
        }
        return out.join(' ');
      }).join(', ');
      return { t: 'l', h: 'Прослухайте номер телефону й запишіть цифрами', say, a: num, nodia: true, ph: 'лише цифри',
        check: (v) => (digits(v) === num ? 'ok' : 'bad'), e: 'Словами: ' + say };
    },
    // 🎧 слово по буквах → написати слово
    spellListen() {
      // Великі літери через кому нейронні голоси читають як назви літер (H — «aitch», Z — «zee» чи «zed» за акцентом голосу),
      // а слова на кшталт «ay» деякі голоси читають як [aɪ]
      const word = pick(SPELL), lw = word.toLowerCase(), names = [];
      for (let i = 0; i < lw.length; i++) {
        const L = lw[i].toUpperCase();
        if (lw[i] === lw[i + 1] && Math.random() < 0.6) { names.push('double ' + L); i++; } else names.push(L);
      }
      return { t: 'l', h: 'Прослухайте, як слово диктують по буквах, і напишіть його', say: names.join(', '), a: word, ph: 'слово',
        check: (v) => (String(v).toLowerCase().replace(/[^a-z]/g, '') === lw ? 'ok' : 'bad'), e: word.toUpperCase().split('').join(' – ') };
    },
    // ✍️ число → словами
    numWords(sp) {
      const n = rnd(sp.min ?? 0, sp.max ?? 100), a = [words(n), words(n, false)];
      return { t: 'i', q: 'Напишіть англійською словами число <b>' + n + '</b>', a, check: sameWords(a), say: words(n),
        e: 'Десятки й одиниці — через дефіс: [[' + words(n) + ']]' + (n > 100 && n % 100 ? '. «and» після hundred — британська норма, американці часто його пропускають.' : '') };
    },
    // ✍️ час → словами
    timeWords() {
      const h = rnd(1, 12), m = pick([0, 0, 5, 10, 15, 20, 25, 30, 30, 35, 40, 45, 45, 50, 55]), a = timeVariants(h, m);
      return { t: 'i', q: 'Котра година? Напишіть англійською словами: <b>' + h + ':' + String(m).padStart(2, '0') + '</b>', a, check: sameWords(a),
        e: 'Правильно: ' + a.map((x) => '[[' + x + ']]').join(' · ') };
    },
    // ✍️ дата → словами
    dateWords() {
      const mo = rnd(1, 12), d = rnd(1, MONTH_DAYS[mo]), o = ordinal(d);
      const a = ['the ' + o + ' of ' + MONTHS[mo], MONTHS[mo] + ' ' + o];
      return { t: 'i', q: 'Напишіть дату словами (як її кажуть): <b>' + d + ' ' + MONTHS[mo] + '</b>', a, check: sameWords(a),
        e: 'Британці: [[' + a[0] + ']]; американці: [[' + a[1] + ']]. Дату кажуть порядковим числом (first, second, third…)' };
    }
  };

  EN.gen = {
    words, ordinal, yearWords, timeVariants, MONTHS, list: G,
    make(spec) {
      const f = G[spec.g];
      if (!f) throw new Error('Невідомий генератор вправ: ' + spec.g);
      return f(spec);
    }
  };
})(window.EN);

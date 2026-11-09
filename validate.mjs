// Перевірка даних уроків: структура вправ, дублікати, дужки [[ ]], відповіді й генератори.
// node validate.mjs                         — усі файли даних з src/index.html
// node validate.mjs data/lessons-a2a.js     — лише цей файл уроків (поки інші файли ще пишуться)
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const src = join(dirname(fileURLToPath(import.meta.url)), 'src');
const only = process.argv[2] ? process.argv[2].replace(/\\/g, '/').replace(/^(\.\/)?src\//, '') : null;
// core.js і dict.js потрібні заради EN.check і розбору імпорту; браузерні об'єкти тут — порожні заглушки
const ctx = { window: { addEventListener() {} }, navigator: {}, document: {}, localStorage: { getItem: () => null, setItem() {} }, console };
ctx.EN = ctx.window.EN = {};
vm.createContext(ctx);
for (const f of ['core.js', 'gen.js', 'dict.js']) vm.runInContext(readFileSync(join(src, f), 'utf8'), ctx, { filename: f });
// Порядок файлів — як у src/index.html: він же порядок уроків у тренажері
const dataFiles = [...readFileSync(join(src, 'index.html'), 'utf8').matchAll(/<script src="(data\/[^"]+)"><\/script>/g)].map((m) => m[1]);
if (only && !dataFiles.includes(only)) { console.log('Файл ' + only + ' не підключено в src/index.html'); process.exit(1); }
for (const f of dataFiles) {
  if (only && /^data\/lessons-/.test(f) && f !== only) continue;
  const code = readFileSync(join(src, f), 'utf8');
  if (/<\/script/i.test(code)) { console.log(f + ': містить «</script» — збирання впаде'); process.exit(1); }
  vm.runInContext(code, ctx, { filename: f });
}
const EN = ctx.window.EN;
const errs = [], warns = [], dups = [];
const ids = new Set(), words = new Map();
const CYR = /[а-яіїєґё]/i;
const brackets = (s, where) => {
  const open = (String(s).match(/\[\[/g) || []).length, close = (String(s).match(/\]\]/g) || []).length;
  if (open !== close) errs.push(where + ': [[ ]] не збалансовано (' + open + '/' + close + ')');
  for (const m of String(s).matchAll(/\[\[([^\]]*)\]\]/g)) if (CYR.test(m[1].split('|').pop())) errs.push(where + ': у [[' + m[1] + ']] кирилиця — англійський голос її не прочитає');
};
const LIMITS = { a0: [12, 25, 10, 16], a1: [15, 25, 12, 16], a2: [15, 25, 12, 18], b1: [15, 25, 12, 18], b2: [15, 25, 12, 18] };
let exCount = 0, vocabCount = 0;
for (const l of EN.lessons) {
  const w = 'урок ' + l.id;
  if (ids.has(l.id)) errs.push(w + ': дубль id');
  if (!EN.program.stages.some((s) => s.id === l.stage)) errs.push(w + ': невідомий stage ' + l.stage);
  if (!l.id.startsWith(l.stage + '-')) errs.push(w + ': id має починатися з «' + l.stage + '-»');
  ids.add(l.id);
  for (const k of ['id', 'stage', 'num', 'title', 'dur', 'goals', 'theory', 'vocab', 'ex', 'say', 'speak', 'mission']) if (l[k] == null) errs.push(w + ': немає поля ' + k);
  if (!Array.isArray(l.vocab) || !Array.isArray(l.ex) || !Array.isArray(l.say) || !Array.isArray(l.speak)) continue;
  brackets(l.theory, w + ' теорія');
  const [vMin, vMax, eMin, eMax] = LIMITS[l.stage] || [10, 30, 10, 20];
  if (l.vocab.length < vMin || l.vocab.length > vMax) warns.push(w + ': слів ' + l.vocab.length + ' (рекомендовано ' + vMin + '–' + vMax + ')');
  if (l.ex.length < eMin || l.ex.length > eMax) warns.push(w + ': вправ ' + l.ex.length + ' (рекомендовано ' + eMin + '–' + eMax + ')');
  if (l.ex.filter((e) => e.t === 'l').length < 2) warns.push(w + ': менше двох диктантів');
  const seen = new Set();
  for (const v of l.vocab) {
    vocabCount++;
    if (!Array.isArray(v) || v.length < 2 || !v[0] || !v[1]) { errs.push(w + ': погане слово ' + JSON.stringify(v)); continue; }
    if (CYR.test(v[0])) errs.push(w + ': кирилиця в англійському слові ' + v[0]);
    if (seen.has(v[0])) errs.push(w + ': дубль слова ' + v[0]);
    seen.add(v[0]);
    const key = v[0].toLowerCase();
    if (words.has(key)) dups.push(v[0] + ' (' + words.get(key) + ' → ' + l.id + ')');
    else words.set(key, l.id);
  }
  l.ex.forEach((e, i) => {
    exCount++;
    const we = w + ' вправа ' + (i + 1);
    if (!['c', 'i', 'o', 'l', 'g'].includes(e.t)) errs.push(we + ': невідомий тип ' + e.t);
    if (e.t === 'g') {
      if (!EN.gen.list[e.g]) errs.push(we + ': невідомий генератор ' + e.g);
    } else if (e.t === 'c') {
      if (!e.q) errs.push(we + ': немає питання');
      if (!Array.isArray(e.o) || e.o.length < 2) errs.push(we + ': мало варіантів');
      else {
        if (new Set(e.o).size !== e.o.length) errs.push(we + ': однакові варіанти');
        // Варіант, що після нормалізації (регістр, скорочення, правопис) збігається з правильним, учень вважатиме теж правильним.
        // Якщо різниця навмисна (Yes, she is / Yes, she's; Ukrainian / ukrainian), вправа позначається exact: true
        if (!e.exact) e.o.slice(1).forEach((x) => { if (EN.norm(x) && EN.check(x, e.o[0]) === 'ok') errs.push(we + ': варіант «' + x + '» рівнозначний правильному «' + e.o[0] + '» (якщо різниця навмисна — додайте exact: true)'); });
      }
    } else {
      const a = Array.isArray(e.a) ? e.a : [e.a];
      if (!a.length || a.some((x) => !x || typeof x !== 'string')) { errs.push(we + ': немає відповіді'); return; }
      if (a.some((x) => CYR.test(x))) errs.push(we + ': відповідь має бути англійською: ' + a.join(' | '));
      if ((e.t === 'i' || e.t === 'o') && !e.q) errs.push(we + ': немає питання');
      if (e.t === 'l' && !e.tr) warns.push(we + ': у диктанті немає перекладу tr');
      if (e.t === 'o' && a[0].split(' ').length < 2) errs.push(we + ': замало слів для порядку');
      if (e.t === 'o') {
        const sortTok = (s) => s.split(' ').map((t) => t.toLowerCase().replace(/[.,!?]/g, '')).sort().join('|');
        a.slice(1).forEach((alt) => { if (sortTok(alt) !== sortTok(a[0])) errs.push(we + ': альтернатива має інші слова: ' + alt); });
      }
      if (e.t === 'i' && /_{2,}/.test(e.q) && a.some((x) => /_{2,}/.test(x))) errs.push(we + ': пропуск ___ у відповіді');
      a.forEach((x) => { if (EN.check(x, e.a, e.exact) !== 'ok') errs.push(we + ': відповідь «' + x + '» не проходить власну перевірку'); });
    }
    if (e.e) brackets(e.e, we + ' пояснення');
  });
  l.say.forEach((p, i) => {
    if (!Array.isArray(p) || p.length !== 2) errs.push(w + ': say[' + i + '] має бути [en, uk]');
    else if (CYR.test(p[0])) errs.push(w + ': say[' + i + '] — фраза має бути англійською');
  });
  brackets(l.mission, w + ' місія');
}
for (const r of EN.ref || []) brackets(r.html, 'довідник ' + r.id);

// Еталонні форми генератора і перевірка, що кожна згенерована вправа приймає власну відповідь
const g = EN.gen;
[[0, 'zero'], [13, 'thirteen'], [21, 'twenty-one'], [40, 'forty'], [99, 'ninety-nine'], [100, 'one hundred'], [105, 'one hundred and five'],
  [134, 'one hundred and thirty-four'], [1000, 'one thousand'], [2026, 'two thousand and twenty-six'], [15000, 'fifteen thousand'],
  [250300, 'two hundred and fifty thousand three hundred'], [1000000, 'one million']]
  .forEach(([n, s]) => { if (g.words(n) !== s) errs.push('gen.words(' + n + ') = ' + g.words(n) + ', очікувалось ' + s); });
if (g.words(134, false) !== 'one hundred thirty-four') errs.push('gen.words(134, false) = ' + g.words(134, false));
[[1, 'first'], [2, 'second'], [3, 'third'], [5, 'fifth'], [8, 'eighth'], [9, 'ninth'], [12, 'twelfth'], [20, 'twentieth'], [21, 'twenty-first'], [30, 'thirtieth'], [31, 'thirty-first']]
  .forEach(([n, s]) => { if (g.ordinal(n) !== s) errs.push('gen.ordinal(' + n + ') = ' + g.ordinal(n)); });
[[1990, 'nineteen ninety'], [1905, 'nineteen oh five'], [1900, 'nineteen hundred'], [2000, 'two thousand'], [2006, 'two thousand and six'], [2026, 'twenty twenty-six']]
  .forEach(([n, s]) => { if (g.yearWords(n) !== s) errs.push('gen.yearWords(' + n + ') = ' + g.yearWords(n)); });
if (!g.timeVariants(3, 15).includes('quarter past three') || !g.timeVariants(5, 40).includes('twenty to six') || !g.timeVariants(7, 5).includes('seven oh five'))
  errs.push('gen.timeVariants: немає очікуваних форм');
for (const name of Object.keys(g.list)) {
  for (let k = 0; k < 300; k++) {
    const it = g.make({ g: name });
    if (!['l', 'i'].includes(it.t) || !it.a) { errs.push('генератор ' + name + ': погана вправа'); break; }
    const answers = Array.isArray(it.a) ? it.a : [it.a];
    if (it.check && answers.some((x) => it.check(x) !== 'ok')) { errs.push('генератор ' + name + ': не приймає власну відповідь ' + answers.join(' | ')); break; }
    if (it.t === 'l' && !/^[a-z ,'-]+$/i.test(it.say)) { errs.push('генератор ' + name + ': дивний текст для озвучення «' + it.say + '»'); break; }
  }
}
// Перевірка відповідей (core.js): скорочення, британський правопис, описки
const C = (a, b, exact) => EN.check(a, b, exact);
[['I\'m from Ukraine', 'I am from Ukraine', 'ok'], ['He doesn\'t work', 'He does not work', 'ok'], ['She\'s got a car', 'She has got a car', 'ok'],
  ['It\'s cold', 'It is cold', 'ok'], ['colour', 'color', 'ok'], ['organise', 'organize', 'ok'], ['travelling', 'traveling', 'ok'],
  ['beatiful', 'beautiful', 'near'], ['work', 'works', 'bad'], ['studies', 'studied', 'bad'], ['four', 'for', 'bad'], ['I am', 'I\'m', 'bad', true],
  ['can not', 'can\'t', 'ok'], ['Let\'s go', 'Let us go', 'ok'], ['John\'s car', 'Johns car', 'ok']]
  .forEach(([a, b, want, exact]) => { const got = C(a, b, exact); if (got !== want) errs.push('EN.check(«' + a + '», «' + b + '»' + (exact ? ', exact' : '') + ') = ' + got + ', очікувалось ' + want); });

// Мій словник: розбір імпорту, злиття, скасування й експорт (без браузера)
{
  const D = EN.Dict, E = (msg) => errs.push('словник: ' + msg);
  EN.S.dict = []; EN.S.cards = {};
  const t = D.parse('1. apple — яблуко\nto reschedule - перенести (зустріч), відкласти\nqueue; черга\nflat = квартира\n\nнічого тут\n# коментар\nlook up\tшукати');
  if (t.kind !== 'text' || t.rows.length !== 5 || t.bad.length !== 1) E('текст: ' + t.rows.length + ' слів, ' + t.bad.length + ' помилок (очікувалось 5 і 1)');
  if (!t.rows[1] || t.rows[1].en !== 'to reschedule' || t.rows[1].uk !== 'перенести (зустріч), відкласти') E('текст: погано розібрано рядок з « - » і комою в перекладі');
  const c = D.parse('english,ukrainian,note\n"look forward to","чекати з нетерпінням, радіти",phrasal\napple,"яблуко ""червоне"""\n', 'my.csv');
  if (c.kind !== 'csv' || c.rows.length !== 2 || c.rows[0].note !== 'phrasal' || c.rows[1].uk !== 'яблуко "червоне"') E('CSV з лапками й заголовком: ' + JSON.stringify(c.rows));
  const sc = D.parse('слово;переклад\nbook;книжка\n', 'x.csv');
  if (sc.rows.length !== 1 || sc.rows[0].en !== 'book') E('CSV з «;» і українським заголовком');
  EN.S.dict = [{ en: 'apple', uk: 'яблуко' }, { en: 'Queue', uk: 'черга в магазині' }];
  const p = D.plan(t);
  if (p.fresh.length !== 3 || p.same.length !== 1 || p.conflict.length !== 1) E('план: нових ' + p.fresh.length + ', однакових ' + p.same.length + ', конфліктів ' + p.conflict.length);
  const r = D.apply(p, { conflict: 'merge' });
  if (r.added !== 3 || EN.S.dict.length !== 5 || D.get('queue').uk !== 'черга в магазині; черга') E('злиття: ' + JSON.stringify(EN.S.dict));
  D.undo(r.snapshot);
  if (EN.S.dict.length !== 2 || D.get('queue').uk !== 'черга в магазині') E('скасування імпорту не відновило словник');
  D.add({ en: 'colleague', uk: 'колега', ipa: '/ˈkɒliːɡ/' });
  EN.S.cards['my|colleague'] = { due: 20000, int: 4, ease: 2.6, reps: 2, lapses: 0 };
  const back = D.parse(D.toJson(true));
  if (back.kind !== 'json' || back.rows.length !== 3 || !back.rows[2].card || back.rows[2].card.reps !== 2 || back.rows[2].ipa !== '/ˈkɒliːɡ/') E('JSON туди й назад: ' + JSON.stringify(back.rows));
  EN.S.dict = []; EN.S.cards = {};
  D.apply(D.plan(back), { progress: true });
  if (EN.S.dict.length !== 3 || !EN.S.cards['my|colleague'] || EN.S.cards['my|colleague'].reps !== 2) E('імпорт JSON з прогресом');
  const csv = D.parse(D.toCsv(), 'x.csv'), tsv = D.parse(D.toTsv());
  if (csv.rows.length !== 3 || tsv.rows.length !== 3 || tsv.kind !== 'tsv') E('CSV/TSV туди й назад: ' + csv.rows.length + ' / ' + tsv.rows.length);
  const evil = D.parse(JSON.stringify({ words: [{ en: 'x<img src=x onerror=alert(1)>', uk: 'y', au: { us: 'https://evil.example/a.mp3' }, card: { due: 'NaN' } }] }));
  if (evil.rows.length !== 1 || evil.rows[0].au || evil.rows[0].card) E('шкідливий запис імпорту не знешкоджено: ' + JSON.stringify(evil.rows));
  const arr = D.parse('[["cat","кіт"],{"word":"dog","translation":"пес"}]');
  if (arr.rows.length !== 2 || arr.rows[1].en !== 'dog') E('JSON-масив з іншими назвами полів');
  if (D.update('colleague', { en: 'co-worker' }).ok !== true || !EN.S.cards['my|co-worker'] || EN.S.cards['my|colleague']) E('перейменування не перенесло прогрес');
  const ans = D.answers('to book (a table) / to reserve');
  if (!['book', 'to book', 'reserve', 'to reserve'].every((x) => EN.check(x, ans) === 'ok')) E('варіанти відповідей словника: ' + ans.join(' | '));
  const lk = D.parseLookup([{ phonetic: '/ˈskedʒuːl/', phonetics: [{ text: '/ˈʃɛdjuːl/', audio: 'https://api.dictionaryapi.dev/media/pronunciations/en/schedule-uk.mp3' }, { text: '/ˈskɛdʒul/', audio: 'https://api.dictionaryapi.dev/media/pronunciations/en/schedule-us.mp3' }] }]);
  if (!lk || !lk.au || !lk.au.us || !lk.au.gb || lk.ipa !== '/ˈskɛdʒul/') E('розбір відповіді словникового сервісу: ' + JSON.stringify(lk));
  EN.S.dict = []; EN.S.cards = {};
}

for (const s of EN.program.stages) (s.modules || []).forEach((m) => {
  for (const k of ['id', 'title', 'weeks', 'grammar', 'vocab', 'speak', 'listen', 'read', 'write', 'mission']) if (!m[k]) errs.push('модуль ' + m.id + ': немає ' + k);
  if (m.lesson && !only) {
    const l = EN.lessons.find((x) => x.id === m.lesson);
    if (!l) errs.push('модуль ' + m.id + ': lesson «' + m.lesson + '» не знайдено (файл підключено в index.html?)');
    else if (l.stage !== s.id) errs.push('модуль ' + m.id + ': урок ' + l.id + ' має stage ' + l.stage + ', а модуль — у ' + s.id);
  }
});

console.log((only ? only + ' — ' : '') + 'уроків: ' + EN.lessons.length + ', вправ: ' + exCount + ', слів: ' + vocabCount + ', розділів довідника: ' + (EN.ref || []).length);
if (warns.length) console.log('Зауваження (' + warns.length + '):\n  ' + warns.join('\n  '));
// Повтор слова в іншому уроці — не помилка: у повторенні це одна картка (core.js → firstLesson), але новому уроку краще дати нові слова
if (dups.length) console.log('Слова, що повторюються в кількох уроках (' + dups.length + '; у повторенні — одна картка): ' + dups.join(', '));
if (errs.length) { console.log('ПОМИЛКИ:\n' + errs.join('\n')); process.exit(1); }
console.log('Дані в порядку ✓');

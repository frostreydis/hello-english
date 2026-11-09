/*
 * Самоперевірка тренажера в браузері.
 * 1) Відкрийте тренажер: локально — `python -m http.server 8000 -d docs` і http://127.0.0.1:8000/, або сайт на GitHub Pages;
 * 2) F12 → Console; 3) вставте цей файл повністю й натисніть Enter.
 * Скрипт відкриває всі екрани, проходить УСІ вправи всіх уроків (і тренажера чисел) правильними відповідями через справжній
 * інтерфейс, перевіряє сценарії прогресу й словника (додати, редагувати, експорт → імпорт → скасування) і показує таблицю.
 * Поточну вправу бере з EN._exCurrent (його виставляє exercises.js). Ваш прогрес і словник зберігаються перед тестом і відновлюються після.
 */
(async () => {
  const backup = JSON.stringify(EN.S);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const first = (a) => (Array.isArray(a) ? a[0] : a);
  const report = {};

  async function answerCurrent(box) {
    const it = EN._exCurrent;
    if (it.t === 'c') [...box.querySelectorAll('.opt')].find((o) => o.dataset.v === it.o[it.a || 0]).click();
    else if (it.t === 'o') {
      for (const w of first(it.a).split(' ')) [...box.querySelectorAll('.pool .tok')].find((t) => t.textContent === w).click();
      box.querySelector('.act').click();
    } else {
      box.querySelector('.ans').value = first(it.a);
      box.querySelector('.act').click();
    }
    return it;
  }
  async function solveAll(label) {
    const bad = []; let fin = '';
    for (let step = 0; step < 300; step++) {
      const box = document.querySelector('.ex-box'); if (!box) { bad.push('немає вправи'); break; }
      if (box.querySelector('.again')) { fin = box.querySelector('.stat').textContent; break; }
      let it;
      try { it = await answerCurrent(box); } catch (e) { it = EN._exCurrent; bad.push(it.t + ' «' + String(it.q || it.say || '').slice(0, 40) + '»: ' + e.message); break; }
      const fb = box.querySelector('.feedback');
      if (!fb || !fb.classList.contains('ok')) bad.push(it.t + ' «' + String(it.q || it.say || '').replace(/<[^>]+>/g, '').slice(0, 40) + '»');
      box.querySelector('.act').click(); await wait(10);
    }
    report[label] = bad.length ? 'ПРОБЛЕМИ: ' + bad.join('; ') : fin;
  }
  const go = async (h, ms) => { location.hash = '#/today'; await wait(30); location.hash = h; await wait(ms || 150); };

  // Сценарії прогресу: продовження підходу, пропуск завдання й уроку, «почати з цього уроку», «пройти наново», сховище
  async function scenarios() {
    const res = {};
    const step = async () => { const box = document.querySelector('.ex-box'); await answerCurrent(box); box.querySelector('.act').click(); await wait(20); };
    await go('#/lesson/a1-1/ex'); await step(); await step();
    await go('#/lesson/a1-1/ex');
    const cont = document.querySelector('.ex-box .cont');
    res['продовження: є запит'] = !!cont;
    if (cont) { cont.click(); await wait(50); res['продовження: з 3-го завдання'] = /Завдання 3 з/.test(document.querySelector('.ex-box').textContent); }
    document.querySelector('.ex-box .skip').click(); await wait(20);
    res['пропуск завдання'] = /Пропущено/.test(document.querySelector('.fb').textContent) && !!EN.S.lessons['a1-1'].run.sk[EN._exCurrent._i];
    await go('#/lesson/a0-1');
    document.getElementById('lc-skip').click(); await wait(100);
    res['пропуск уроку'] = EN.lessonSkipped('a0-1') && EN.currentLesson().id !== 'a0-1';
    await go('#/lesson/a1-3');
    const from = document.getElementById('lc-from'); from.click(); from.click(); await wait(100);
    res['почати з уроку'] = EN.currentLesson().id === 'a1-3' && EN.lessons.slice(0, EN.lessons.findIndex((l) => l.id === 'a1-3')).every((l) => EN.lessonClosed(l.id));
    await go('#/lesson/a1-1');
    const rs = document.getElementById('lc-reset'); rs.click(); rs.click(); await wait(100);
    res['пройти наново'] = !EN.S.lessons['a1-1'].run && !EN.S.lessons['a1-1'].skipped && !EN.S.lessons['a1-1'].ex;
    const setItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function () { throw new DOMException('самоперевірка', 'QuotaExceededError'); };
    try { EN.save(); } finally { Storage.prototype.setItem = setItem; }
    res['збій запису помічено'] = !!EN.store.failed;
    EN.save();
    res['запис після збою'] = !EN.store.failed;
    const fromTab = (mutate) => {
      const raw = mutate(JSON.parse(localStorage.getItem(EN.store.key)));
      localStorage.setItem(EN.store.key, typeof raw === 'string' ? raw : JSON.stringify(raw));
      window.dispatchEvent(new StorageEvent('storage', { key: EN.store.key }));
    };
    fromTab((s) => { s.dict = [{ en: 'selftest', uk: 'тест' }]; return s; });
    res['зміна з іншої вкладки'] = EN.S.dict.length === 1 && EN.S.dict[0].en === 'selftest';
    fromTab((s) => { s.settings.rate = '<img src=x onerror=alert(1)>'; s.dict = [{ en: '<b>x</b>', uk: 'y', au: { us: 'javascript:alert(1)' } }]; return JSON.stringify(s).replace('{', '{"__proto__":{"polluted":1},'); });
    res['шкідливі дані знешкоджено'] = typeof EN.S.settings.rate === 'number' && ({}).polluted === undefined && !EN.S.dict[0].au;
    for (const [k, v] of Object.entries(res)) report['стан: ' + k] = v ? 'ok' : 'ПОМИЛКА';
    EN.resetState();
  }

  // Словник через інтерфейс: додати, дубль, редагувати з перенесенням прогресу, експорт JSON → очистити → імпорт → скасувати
  async function dictionary() {
    const res = {};
    const D = EN.Dict, files = [];
    const download = D.download;
    D.download = (name, text) => files.push({ name, text });
    try {
      await go('#/dict');
      const add = (en, uk) => { document.getElementById('d-en').value = en; document.getElementById('d-uk').value = uk; document.getElementById('d-add-btn').click(); };
      add('reschedule', 'перенести (зустріч)'); await wait(30);
      add('queue', 'черга'); await wait(30);
      add('Queue', 'черга знову'); await wait(30);
      res['додавання і дубль'] = EN.S.dict.length === 2 && document.querySelectorAll('#d-list .dict-row').length === 2;
      const row = [...document.querySelectorAll('#d-list .dict-row')].find((r) => r.dataset.text.startsWith('queue'));
      row.querySelector('[data-act="say"]').click();
      row.querySelector('[data-act="edit"]').click(); await wait(20);
      EN.S.cards['my|queue'] = { due: EN.today() + 3, int: 3, ease: 2.5, reps: 1, lapses: 0 };
      row.querySelector('.e-en').value = 'queue (UK)';
      row.querySelector('.e-uk').value = 'черга';
      row.querySelector('[data-act="save"]').click(); await wait(30);
      res['редагування з прогресом'] = !!D.get('queue (UK)') && !!EN.S.cards['my|queue (UK)'] && !EN.S.cards['my|queue'];
      await go('#/dict/io');
      document.getElementById('x-json').click(); await wait(20);
      const json = files.length && files[files.length - 1].text;
      res['експорт JSON'] = !!json && JSON.parse(json).words.length === 2 && !!JSON.parse(json).words.find((w) => w.card);
      D.clear();
      await go('#/dict/io');
      document.getElementById('i-text').value = json;
      document.getElementById('i-parse').click(); await wait(30);
      document.getElementById('i-go').click(); await wait(50);
      res['імпорт JSON з прогресом'] = EN.S.dict.length === 2 && !!EN.S.cards['my|queue (UK)'];
      document.getElementById('i-text').value = 'apple — яблуко\nqueue (UK); черга, лінія\nбез перекладу';
      document.getElementById('i-parse').click(); await wait(30);
      const prev = document.getElementById('i-preview').textContent;
      res['перегляд імпорту'] = /нових: 1/.test(prev) && /з іншим перекладом: 1/.test(prev) && /не розпізнано: 1/.test(prev);
      document.querySelector('input[name="i-conf"][value="merge"]').click();
      document.getElementById('i-go').click(); await wait(50);
      res['злиття перекладів'] = EN.S.dict.length === 3 && D.get('queue (UK)').uk === 'черга; черга, лінія';
      document.getElementById('i-undo').click(); await wait(50);
      res['скасування імпорту'] = EN.S.dict.length === 2 && D.get('queue (UK)').uk === 'черга';
      document.getElementById('x-csv').click(); await wait(20);
      res['експорт CSV'] = files.length >= 2 && /^﻿english,ukrainian/.test(files[files.length - 1].text);
      await go('#/dict/practice');
      await solveAll('словник: тренування');
      await go('#/words/review/my');
      res['повторення лише словника'] = !!document.querySelector('.flash');
    } finally { D.download = download; }
    for (const [k, v] of Object.entries(res)) report['словник: ' + k] = v ? 'ok' : 'ПОМИЛКА';
    EN.resetState();
  }

  // Без звуку й мережі: сотні диктантів підряд — це сотні запитів до онлайн-голосу, сервіс може тимчасово заблокувати
  const say = EN.TTS.say, playUrl = EN.TTS.playUrl, lookup = EN.Dict.lookup;
  EN.TTS.say = () => {}; EN.TTS.playUrl = () => {}; EN.Dict.lookup = async () => null;
  try {
    EN.resetState(); // тест іде на чистому стані; ваш прогрес повернеться в кінці
    await scenarios();
    await dictionary();
    for (const p of ['today', 'program', 'lessons', 'words', 'words/list', 'words/review/my', 'dict', 'dict/io', 'dict/practice', 'speak', 'ref', 'settings', 'drill']) {
      location.hash = '#/' + p; await wait(120);
      report['екран ' + p] = document.querySelector('#view pre') ? 'ПОМИЛКА: ' + document.querySelector('#view pre').textContent.slice(0, 150) : 'ok';
    }
    for (const L of EN.lessons) {
      for (const tab of ['theory', 'words', 'speak', 'mission']) {
        location.hash = '#/lesson/' + L.id + '/' + tab; await wait(40);
        if (document.querySelector('#view pre')) report[L.id + ' ' + tab] = 'ПОМИЛКА екрана';
      }
      await go('#/lesson/' + L.id + '/ex', 120);
      await solveAll(L.id + ' вправи');
    }
    for (const mode of ['n20', 'teen', 'n100', 'n999', 'big', 'price', 'time', 'date', 'year', 'phone', 'spell', 'nw', 'tw', 'dw', 'mix']) {
      await go('#/drill/' + mode, 120);
      await solveAll('тренажер ' + mode);
    }
  } finally {
    EN.TTS.say = say; EN.TTS.playUrl = playUrl; EN.Dict.lookup = lookup;
    EN.TTS.stop();
    EN.replaceState(JSON.parse(backup));
    location.hash = '#/today';
  }
  console.table(report);
  const problems = Object.entries(report).filter(([, v]) => v !== 'ok' && v !== '100%');
  console.log(problems.length ? '❌ Знайдено проблем: ' + problems.length : '✅ Усе гаразд: усі екрани відкриваються, усі вправи розв\'язуються, словник працює.');
  return problems;
})();

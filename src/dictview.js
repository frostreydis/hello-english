/* Екрани словника: #/dict — список і додавання, #/dict/io — імпорт та експорт, #/dict/practice — тренування */
(function (EN) {
  'use strict';
  const esc = EN.esc, $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const view = () => document.getElementById('view');
  const D = EN.Dict;
  // Текст, а не емодзі-прапори: Windows показує прапори як дві літери «us», «gb»
  const FLAG = { us: 'US', gb: 'UK' };
  const other = (acc) => (acc === 'gb' ? 'us' : 'gb');
  // autocorrect / spellcheck вимкнено: телефон «виправляв» би англійські слова, а підкреслення заважало б
  const INP = 'autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"';
  // Знімок для «Скасувати імпорт» живе лише до перезавантаження сторінки: це страховка на хвилину, а не історія змін
  let lastImport = null;

  const cambridge = (en) => 'https://dictionary.cambridge.org/dictionary/english/' + encodeURIComponent(EN.sayText(en).toLowerCase().replace(/^to\s+/, '').trim().replace(/\s+/g, '-'));
  const youglish = (en) => 'https://youglish.com/pronounce/' + encodeURIComponent(EN.sayText(en).replace(/^to\s+/i, '').trim()) + '/english/' + (EN.S.settings.accent === 'gb' ? 'uk' : 'us');

  function statusPill(w) {
    const c = D.card(w.en);
    if (!c) return '<span class="pill gray">нове</span>';
    const d = c.due - EN.today();
    return d <= 0 ? '<span class="pill amber">повторити сьогодні</span>' : '<span class="pill green">через ' + d + ' дн.</span>';
  }
  function order() {
    const idx = EN.S.dict.map((_, i) => i), how = EN.S.ui.dictSort, w = EN.S.dict;
    if (how === 'az') idx.sort((a, b) => w[a].en.localeCompare(w[b].en, 'en', { sensitivity: 'base' }));
    else if (how === 'due') {
      const due = (i) => { const c = D.card(w[i].en); return c ? c.due : -1e9; };
      idx.sort((a, b) => due(a) - due(b));
    } else idx.sort((a, b) => (w[b].added || '').localeCompare(w[a].added || '') || b - a);
    return idx;
  }
  function rowHtml(w, i) {
    const acc = EN.S.settings.accent;
    return '<div class="dict-row" data-i="' + i + '" data-text="' + esc((w.en + ' ' + w.uk + ' ' + (w.note || '') + ' ' + (w.ex || '')).toLowerCase()) + '">' +
      '<div class="dict-main"><div class="dict-en">' + EN.sayHtml(w.en, EN.sayText(w.en)) + (w.ipa ? ' <span class="ipa">' + esc(w.ipa) + '</span>' : '') + ' ' + statusPill(w) + '</div>' +
      '<div class="dict-uk">' + esc(w.uk) + (w.note ? ' <span class="small muted">· ' + esc(w.note) + '</span>' : '') + '</div>' +
      (w.ex ? '<div class="dict-ex small">' + EN.sayHtml(w.ex) + '</div>' : '') + '</div>' +
      '<div class="dict-actions"><button class="ic" data-act="say" title="Послухати">🔊</button><button class="ic" data-act="slow" title="Повільно">🐢</button>' +
      '<button class="ic" data-act="alt" title="Послухати з ' + (acc === 'gb' ? 'американською' : 'британською') + ' вимовою">' + FLAG[other(acc)] + '</button>' +
      (D.nativeUrl(w, acc) ? '<button class="ic" data-act="native" title="Запис живої людини">🎙️</button>' : '') +
      '<button class="ic" data-act="edit" title="Редагувати, транскрипція, Cambridge, YouGlish">✎</button></div></div>';
  }
  function editHtml(w) {
    return '<div class="dict-edit"><div class="grid g2">' +
      '<label class="small muted">Англійською<input type="text" class="e-en" lang="en" ' + INP + ' value="' + esc(w.en) + '"></label>' +
      '<label class="small muted">Переклад<input type="text" class="e-uk" lang="uk" value="' + esc(w.uk) + '"></label>' +
      '<label class="small muted">Примітка<input type="text" class="e-note" lang="uk" value="' + esc(w.note || '') + '"></label>' +
      '<label class="small muted">Транскрипція<input type="text" class="e-ipa" ' + INP + ' value="' + esc(w.ipa || '') + '"></label></div>' +
      '<label class="small muted">Приклад<input type="text" class="e-ex" lang="en" ' + INP + ' value="' + esc(w.ex || '') + '"></label>' +
      '<div class="row" style="margin-top:8px"><button class="btn primary small" data-act="save">Зберегти</button><button class="btn small" data-act="cancel">Скасувати</button>' +
      '<button class="btn small" data-act="lookup" title="Знайти транскрипцію й запис носія">🔎 Транскрипція</button>' +
      '<a class="btn small" href="' + cambridge(w.en) + '" target="_blank" rel="noopener noreferrer">📖 Cambridge</a>' +
      '<a class="btn small" href="' + youglish(w.en) + '" target="_blank" rel="noopener noreferrer" title="Слово у відео з реальними людьми">▶ YouGlish</a>' +
      '<span class="spacer"></span><button class="btn small danger" data-act="del">✕ Видалити</button></div></div>';
  }

  function renderDict(sub) {
    if (sub === 'io') return renderIO();
    if (sub === 'practice') return renderPractice();
    const n = EN.S.dict.length, q = EN.srsQueue('my'), acc = EN.S.settings.accent;
    view().innerHTML = EN.views.voiceBanner() +
      '<div class="card"><div class="row"><h1 style="margin:0">📒 Мій словник</h1><span class="spacer"></span><span class="pill">' + n + ' ' + plural(n, 'слово', 'слова', 'слів') + '</span></div>' +
      '<p class="small muted">Слова з роботи, серіалів, пісень. 🔊 — вимова, 🐢 — повільно, ' + FLAG[other(acc)] + ' — інший акцент, 🎙️ — запис живої людини (якщо є). ✎ — редагувати, транскрипція, Cambridge і YouGlish.</p>' +
      '<div class="row"><a class="btn primary" href="#/words/review/my">🃏 Повторити (' + q.total + ')</a><a class="btn" href="#/dict/practice">🎯 Тренування</a><a class="btn" href="#/dict/io">⇅ Імпорт / експорт</a>' +
      (D.missing().length ? '<button class="btn" id="d-fill" title="Знайти транскрипцію й записи носіїв для слів, у яких їх ще немає">🔎 Транскрипція (' + D.missing().length + ')</button>' : '') +
      '<span class="spacer"></span><span class="small muted">Вимова:</span><span class="seg" role="group" title="Вимова за замовчуванням">' + ['us', 'gb'].map((a) => '<button data-acc="' + a + '" class="' + (a === acc ? 'active' : '') + '" title="' + (a === 'gb' ? 'Британська вимова' : 'Американська вимова') + '">' + FLAG[a] + '</button>').join('') + '</span></div></div>' +
      '<div class="card" id="d-add"><h3 style="margin-top:0">＋ Додати слово</h3><div class="grid g2">' +
      '<label class="small muted">Англійською<span class="row nowrap"><input type="text" id="d-en" lang="en" ' + INP + ' placeholder="напр. reschedule" maxlength="200"><button class="btn" id="d-en-say" title="Послухати">🔊</button></span></label>' +
      '<label class="small muted">Переклад<input type="text" id="d-uk" lang="uk" placeholder="напр. перенести (зустріч)" maxlength="300"></label></div>' +
      '<details id="d-more"><summary class="small">Примітка, приклад, транскрипція</summary><div class="grid g2" style="margin-top:6px">' +
      '<input type="text" id="d-note" lang="uk" placeholder="Примітка: дієслово, сленг, US…" maxlength="300"><input type="text" id="d-ipa" ' + INP + ' placeholder="Транскрипція, напр. /ˌriːˈskedʒuːl/" maxlength="100"></div>' +
      '<input type="text" id="d-ex" lang="en" ' + INP + ' placeholder="Приклад: Can we reschedule the call?" maxlength="500" style="margin-top:8px"></details>' +
      '<div class="row" style="margin-top:10px"><button class="btn primary" id="d-add-btn">Додати</button><button class="btn" id="d-look" title="Знайти транскрипцію й запис носія у словниковій базі">🔎 Транскрипція</button><span id="d-look-res" class="small muted"></span></div>' +
      (EN.S.settings.autoIpa ? '<p class="small muted" style="margin:6px 0 0">Транскрипція й записи носіїв шукаються автоматично після додавання (сервіс dictionaryapi.dev отримує лише англійське слово). Вимкнути — в ⚙️ «Налаштування».</p>' : '') + '</div>' +
      '<div class="card"><div class="row"><input type="text" id="d-q" placeholder="Пошук англійською чи українською…" style="flex:1;min-width:180px"><select id="d-sort" style="width:auto">' +
      [['new', 'Нові спершу'], ['az', 'A–Z'], ['due', 'За повторенням']].map((o) => '<option value="' + o[0] + '"' + (EN.S.ui.dictSort === o[0] ? ' selected' : '') + '>' + o[1] + '</option>').join('') + '</select></div><div id="d-list"></div></div>';
    if (!n) $('#d-more').open = false;
    drawList();
    bindAdd();
    $$('[data-acc]').forEach((b) => b.onclick = () => {
      EN.S.settings.accent = b.dataset.acc;
      EN.save(); renderDict();
      EN.TTS.say('Hello! This is how it sounds.');
    });
    const fill = $('#d-fill');
    if (fill) fill.onclick = async () => {
      if (fill.dataset.busy) { fill.dataset.stop = '1'; return; }
      fill.dataset.busy = '1';
      const r = await D.enrichAll((i, n, found) => { fill.textContent = '🔎 ' + i + ' / ' + n + ' (знайдено ' + found + ') · стоп'; }, () => !!fill.dataset.stop || !document.body.contains(fill));
      if (!document.body.contains(fill)) return;
      EN.toast(r.offline ? 'Словниковий сервіс не відповідає (немає інтернету?)' : 'Знайдено транскрипцію для ' + r.found + ' з ' + r.total + ' слів', 4000);
      renderDict();
    };
    $('#d-sort').onchange = (e) => { EN.S.ui.dictSort = e.target.value; EN.save(); drawList(); };
    $('#d-q').oninput = filter;
    $('#d-list').addEventListener('click', onListClick);
  }
  function plural(n, one, few, many) {
    const m10 = n % 10, m100 = n % 100;
    return m10 === 1 && m100 !== 11 ? one : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? few : many;
  }
  function drawList() {
    const el = $('#d-list');
    if (!el) return;
    el.innerHTML = EN.S.dict.length ? order().map((i) => rowHtml(EN.S.dict[i], i)).join('')
      : '<p class="muted">Словник порожній. Додайте перше слово вгорі або <a href="#/dict/io">імпортуйте список</a> з файлу, таблиці чи тексту.</p>';
    filter();
  }
  function filter() {
    const inp = $('#d-q');
    const v = inp ? inp.value.trim().toLowerCase() : '';
    $$('#d-list .dict-row').forEach((r) => { r.style.display = !v || r.dataset.text.includes(v) ? '' : 'none'; });
  }
  function bindAdd() {
    const en = $('#d-en'), uk = $('#d-uk'), res = $('#d-look-res');
    $('#d-en-say').onclick = () => { if (en.value.trim()) EN.TTS.say(EN.sayText(en.value)); else en.focus(); };
    $('#d-look').onclick = async () => {
      const w = en.value.trim();
      if (!w) { EN.toast('Спершу введіть англійське слово'); en.focus(); return; }
      res.textContent = 'Шукаю…';
      const r = await D.lookup(w);
      if (r === undefined) { res.textContent = 'Сервіс не відповів (немає інтернету?)'; return; }
      if (!r || (!r.ipa && !r.au)) { res.textContent = 'У словниковій базі цього слова немає — звучатиме синтезований голос.'; return; }
      if (r.ipa) { $('#d-ipa').value = r.ipa; $('#d-more').open = true; }
      res.innerHTML = (r.ipa ? esc(r.ipa) + ' · ' : '') + (r.au ? 'є запис носія: ' + Object.keys(r.au).map((k) => '<button class="btn small" data-native="' + k + '">🎙️ ' + k.toUpperCase() + '</button>').join(' ') : 'запису носія немає');
      $$('[data-native]', res).forEach((b) => b.onclick = () => EN.TTS.playUrl(r.au[b.dataset.native]));
    };
    const add = () => {
      const fields = { en: en.value, uk: uk.value, note: $('#d-note').value, ex: $('#d-ex').value, ipa: $('#d-ipa').value };
      if (!fields.en.trim() || !fields.uk.trim()) { EN.toast('Заповніть англійське слово і переклад'); (fields.en.trim() ? uk : en).focus(); return; }
      const r = D.add(fields);
      if (!r.ok) {
        if (r.reason === 'dup') { EN.toast('«' + r.word.en + '» уже є у словнику: ' + r.word.uk, 3500); highlight(r.word.en); }
        else if (r.reason === 'full') EN.toast('У словнику вже ' + D.MAX_WORDS + ' слів — більше не вміщується');
        return;
      }
      ['#d-en', '#d-uk', '#d-note', '#d-ex', '#d-ipa'].forEach((s) => { $(s).value = ''; });
      res.textContent = '';
      EN.toast('Додано: ' + r.word.en + ' ✓');
      drawList();
      highlight(r.word.en);
      if (!EN.touch()) en.focus();
      if (EN.S.settings.autoIpa && !r.word.ipa) D.enrich(r.word.en).then((x) => { if (x && (x.ipa || x.au) && $('#d-list')) drawList(); });
    };
    $('#d-add-btn').onclick = add;
    [en, uk, $('#d-note'), $('#d-ex'), $('#d-ipa')].forEach((i) => i.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }));
  }
  function highlight(en) {
    const i = D.index(en);
    const row = $('#d-list .dict-row[data-i="' + i + '"]');
    if (!row) return;
    row.classList.add('flash-row');
    row.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    setTimeout(() => row.classList.remove('flash-row'), 1600);
  }
  function onListClick(e) {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    const row = b.closest('.dict-row'), w = EN.S.dict[+row.dataset.i];
    if (!w) return;
    const acc = EN.S.settings.accent, act = b.dataset.act;
    if (act === 'say') EN.TTS.say(EN.sayText(w.en));
    else if (act === 'slow') EN.TTS.say(EN.sayText(w.en), 0.6);
    else if (act === 'alt') EN.TTS.say(EN.sayText(w.en), null, other(acc));
    else if (act === 'native') EN.TTS.playUrl(D.nativeUrl(w, acc));
    else if (act === 'edit') {
      row.innerHTML = editHtml(w);
      row.classList.add('editing');
      const del = $('[data-act="del"]', row);
      EN.confirmClick(del, '✕ Точно видалити?', () => { D.remove(w.en); EN.toast('Видалено: ' + w.en); drawList(); });
      if (!EN.touch()) $('.e-uk', row).focus();
    } else if (act === 'cancel') drawList();
    else if (act === 'save') {
      const r = D.update(w.en, { en: $('.e-en', row).value, uk: $('.e-uk', row).value, note: $('.e-note', row).value, ex: $('.e-ex', row).value, ipa: $('.e-ipa', row).value });
      if (!r.ok) { EN.toast(r.reason === 'dup' ? 'Таке слово вже є: ' + r.word.en : 'Заповніть англійське слово і переклад'); return; }
      EN.toast('Збережено ✓');
      drawList(); highlight(r.word.en);
    } else if (act === 'lookup') {
      b.textContent = '🔎 Шукаю…';
      D.lookup($('.e-en', row).value || w.en).then((r) => {
        b.textContent = '🔎 Транскрипція';
        if (r === undefined) { EN.toast('Сервіс не відповів (немає інтернету?)'); return; }
        if (!r || (!r.ipa && !r.au)) { EN.toast('У словниковій базі цього слова немає'); return; }
        if (r.ipa) $('.e-ipa', row).value = r.ipa;
        // Запис носія зберігаємо одразу, а транскрипцію учень бачить у полі й може виправити перед «Зберегти»
        if (r.au) D.update(w.en, { au: r.au });
        EN.toast(r.au ? 'Знайдено транскрипцію і запис носія 🎙️' : 'Знайдено транскрипцію');
      });
    }
  }

  function renderIO() {
    const n = EN.S.dict.length, share = D.canShareFiles();
    view().innerHTML = '<div class="card"><div class="row small muted"><a href="#/dict">← Мій словник</a></div><h1>⇅ Імпорт та експорт словника</h1>' +
      '<p class="small muted">Словник живе в браузері на цьому пристрої. Щоб перенести його на телефон чи інший браузер — експортуйте файл тут і імпортуйте його там. Прогрес уроків не переноситься, лише словник.</p></div>' +
      '<div class="card"><h2>⬇️ Експорт</h2><p>У словнику <b>' + n + '</b> ' + plural(n, 'слово', 'слова', 'слів') + '.</p>' +
      '<label class="row small"><input type="checkbox" id="x-prog" checked> Разом із прогресом повторення (коли яке слово повторювати)</label>' +
      '<div class="row" style="margin-top:8px"><button class="btn primary" id="x-json"' + (n ? '' : ' disabled') + '>⬇️ Файл словника (.json)</button>' +
      (share ? '<button class="btn" id="x-share"' + (n ? '' : ' disabled') + '>📤 Поділитися файлом</button>' : '') +
      '<button class="btn" id="x-csv"' + (n ? '' : ' disabled') + '>⬇️ Таблиця (.csv)</button><button class="btn" id="x-tsv"' + (n ? '' : ' disabled') + '>📋 Копіювати як таблицю</button></div>' +
      '<ul class="small muted"><li><b>.json</b> — повна копія (з транскрипцією, записами носіїв і прогресом). Для перенесення на інший пристрій і резервної копії.</li>' +
      '<li><b>.csv</b> — для Excel, Google Таблиць, Anki, Quizlet. <b>📋 Копіювати як таблицю</b> — вставте в Google Таблиці чи Excel (Ctrl+V), колонки розкладуться самі.</li>' +
      '<li>Перенести на телефон: «Поділитися» → надішліть файл собі в Telegram чи пошту → на телефоні збережіть його → тут «📂 Вибрати файл».</li></ul></div>' +
      '<div class="card"><h2>⬆️ Імпорт</h2><p class="small muted">Файл цього тренажера (.json), таблиця (.csv, .tsv) або текст (.txt). Перед імпортом ви побачите, що саме додасться.</p>' +
      '<div class="row"><label class="btn primary file-btn">📂 Вибрати файл<input type="file" id="i-file" accept=".json,.csv,.tsv,.txt,application/json,text/csv,text/plain,text/tab-separated-values" hidden></label></div>' +
      '<p class="small" style="margin:12px 0 4px">…або вставте список, по слову на рядок:</p>' +
      '<textarea id="i-text" rows="6" lang="en" ' + INP + ' placeholder="apple — яблуко\nto reschedule - перенести (зустріч)\nqueue; черга\n(можна вставити клітинки з Excel чи Google Таблиць: англійське слово і переклад у сусідніх колонках)"></textarea>' +
      '<div class="row" style="margin-top:8px"><button class="btn" id="i-parse">Розібрати текст</button></div><div id="i-preview"></div></div>' +
      '<div class="card"><h3>🗑️ Очистити словник</h3><p class="small muted">Видаляє всі слова словника і їхній прогрес повторення на цьому пристрої. Спершу збережіть файл словника. Уроки й налаштування не зачіпаються.</p>' +
      '<button class="btn danger" id="i-clear"' + (n ? '' : ' disabled') + '>Очистити словник</button></div>';
    const prog = () => $('#x-prog').checked;
    $('#x-json').onclick = () => { D.download(D.fileName('json'), D.toJson(prog()), 'application/json'); EN.toast('Файл збережено в «Завантаження»'); };
    if (share) $('#x-share').onclick = () => D.share(D.fileName('json'), D.toJson(prog()), 'application/json').catch((e) => { if (e && e.name !== 'AbortError') EN.toast('Не вдалося поділитися: ' + (e.name || e)); });
    // BOM потрібен Excel, інакше він відкриє UTF-8 як кракозябри
    $('#x-csv').onclick = () => { D.download(D.fileName('csv'), '﻿' + D.toCsv(), 'text/csv;charset=utf-8'); EN.toast('Таблицю збережено в «Завантаження»'); };
    $('#x-tsv').onclick = async () => { EN.toast(await D.copy(D.toTsv()) ? 'Скопійовано — вставте в таблицю (Ctrl+V)' : 'Не вдалося скопіювати'); };
    $('#i-file').onchange = (e) => {
      const f = e.target.files[0];
      if (!f) return;
      if (f.size > 10 * 1024 * 1024) { EN.toast('Файл завеликий (понад 10 МБ)'); return; }
      const rd = new FileReader();
      rd.onload = () => preview(D.parse(rd.result, f.name), f.name);
      rd.onerror = () => EN.toast('Не вдалося прочитати файл');
      rd.readAsText(f, 'utf-8');
      e.target.value = '';
    };
    $('#i-parse').onclick = () => {
      const t = $('#i-text').value;
      if (!t.trim()) { EN.toast('Вставте текст у поле'); return; }
      preview(D.parse(t), '');
    };
    EN.confirmClick($('#i-clear'), 'Точно видалити всі ' + n + ' ' + plural(n, 'слово', 'слова', 'слів') + '?', () => { D.clear(); EN.toast('Словник очищено'); renderIO(); });
    if (lastImport) showUndo();
  }
  const KIND = { json: 'файл словника', csv: 'таблиця CSV', tsv: 'таблиця', text: 'текст', empty: 'порожньо' };
  function preview(parsed, source) {
    const p = D.plan(parsed), el = $('#i-preview');
    const total = p.fresh.length + p.same.length + p.conflict.length;
    if (!total) {
      el.innerHTML = '<div class="note">Не знайдено жодного слова з перекладом' + (p.bad.length ? ': ' + p.bad.length + ' ' + plural(p.bad.length, 'рядок', 'рядки', 'рядків') + ' не розпізнано. Приклад: <code>' + esc(p.bad[0].text) + '</code>' : '') +
        '. Кожен рядок має містити англійське слово і переклад через «—», «-», «;», «=» чи табуляцію.</div>';
      return;
    }
    const row = (r, st, cls) => '<tr><td>' + esc(r.en) + '</td><td>' + esc(r.uk) + '</td><td><span class="pill ' + cls + '">' + st + '</span></td></tr>';
    const sample = [].concat(p.conflict.map((x) => row(x.row, 'інший переклад: ' + esc(x.cur.uk), 'amber')), p.fresh.map((r) => row(r, 'нове', 'green')), p.same.map((x) => row(x.row, 'вже є', 'gray'))).slice(0, 40);
    el.innerHTML = '<div class="card inner"><h3>Перегляд: ' + (source ? esc(source) + ' (' + KIND[p.kind] + ')' : 'вставлений ' + KIND[p.kind]) + '</h3><div class="row small">' +
      '<span class="pill green">нових: ' + p.fresh.length + '</span><span class="pill gray">вже є: ' + p.same.length + '</span><span class="pill amber">з іншим перекладом: ' + p.conflict.length + '</span>' +
      (p.dup ? '<span class="pill gray">повторів у файлі: ' + p.dup + '</span>' : '') + (p.bad.length ? '<span class="pill red">не розпізнано: ' + p.bad.length + '</span>' : '') + '</div>' +
      (p.conflict.length ? '<p class="small" style="margin-bottom:4px"><b>Слова з іншим перекладом:</b></p><div class="row small">' +
        [['keep', 'залишити мій переклад'], ['replace', 'замінити перекладом з файлу'], ['merge', 'об\'єднати переклади']].map((o, k) => '<label><input type="radio" name="i-conf" value="' + o[0] + '"' + (k ? '' : ' checked') + '> ' + o[1] + '</label>').join('') + '</div>' : '') +
      (p.withCards ? '<label class="row small" style="margin-top:6px"><input type="checkbox" id="i-prog" checked> Узяти прогрес повторення з файлу (для слів, яких ви ще не повторювали)</label>' : '') +
      '<div class="tblwrap" style="max-height:320px;overflow:auto;margin-top:8px"><table><tr><th>Англійською</th><th>Переклад</th><th>Стан</th></tr>' + sample.join('') + '</table></div>' +
      (total > 40 ? '<p class="small muted">Показано 40 з ' + total + '.</p>' : '') +
      (p.bad.length ? '<details class="small"><summary>Нерозпізнані рядки (' + p.bad.length + ')</summary><ul>' + p.bad.slice(0, 20).map((b) => '<li>рядок ' + b.line + ': <code>' + esc(b.text) + '</code></li>').join('') + '</ul></details>' : '') +
      '<div class="row" style="margin-top:10px"><button class="btn primary" id="i-go"' + (p.fresh.length || p.conflict.length || p.same.length ? '' : ' disabled') + '>Імпортувати</button><button class="btn" id="i-cancel">Скасувати</button></div></div>';
    $('#i-cancel').onclick = () => { el.innerHTML = ''; };
    $('#i-go').onclick = () => {
      const conf = $('input[name="i-conf"]:checked'), progEl = $('#i-prog');
      const r = D.apply(p, { conflict: conf ? conf.value : 'keep', progress: progEl ? progEl.checked : true });
      lastImport = r;
      el.innerHTML = '';
      $('#i-text').value = '';
      renderIO();
      EN.toast('Імпортовано ✓');
    };
  }
  function showUndo() {
    const r = lastImport;
    $('#i-preview').innerHTML = '<div class="good"><b>Імпорт завершено.</b> Додано слів: ' + r.added + ', оновлено перекладів: ' + r.updated + ', доповнено полів: ' + r.filled +
      (r.skipped ? ', не вмістилося: ' + r.skipped : '') + '.<div class="row" style="margin-top:8px"><a class="btn primary small" href="#/dict">📒 До словника</a><button class="btn small" id="i-undo">↩ Скасувати імпорт</button></div></div>';
    $('#i-undo').onclick = () => { D.undo(r.snapshot); lastImport = null; EN.toast('Імпорт скасовано'); renderIO(); };
  }

  function renderPractice() {
    const n = EN.S.dict.length;
    view().innerHTML = EN.views.voiceBanner() + '<div class="card"><div class="row small muted"><a href="#/dict">← Мій словник</a></div><h1>🎯 Тренування словника</h1>' +
      '<p class="muted">10 завдань зі слів словника: диктант (почути й написати), переклад українською → англійською, вибір перекладу. Спершу — слова, які пора повторити, і нові.</p></div><div id="dp-body"></div>';
    if (!n) { $('#dp-body').innerHTML = '<div class="card center"><p>Словник порожній.</p><a class="btn primary" href="#/dict">＋ Додати слова</a></div>'; return; }
    EN.runExercises($('#dp-body'), D.practiceSpecs(10), { drill: true });
  }

  EN.renderDict = renderDict;
})(window.EN);

/* Екрани «Слова», «Тренажер чисел», «Розмова», «Довідник», «Налаштування»; маршрутизація та запуск */
(function (EN) {
  'use strict';
  const esc = EN.esc, $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const view = () => document.getElementById('view');

  // only: 'my' — повторювати лише слова мого словника (#/words/review/my)
  function renderWords(sub, only) {
    sub = sub || 'review';
    only = only === 'my' ? 'my' : '';
    const c = EN.srsCounts(only);
    view().innerHTML = EN.views.voiceBanner() + '<div class="card"><h1>🃏 Слова' + (only ? ': мій словник' : '') + '</h1><div class="row small"><span class="pill">' + c.due + ' на повторення</span><span class="pill green">' + c.known + ' у пам\'яті</span><span class="pill gray">' + c.unseen + ' нових чекають</span></div>' +
      '<div class="subtabs"><button data-s="review" class="' + (sub === 'review' && !only ? 'active' : '') + '">Повторення</button><button data-s="review/my" class="' + (sub === 'review' && only ? 'active' : '') + '">Лише мій словник</button><button data-s="list" class="' + (sub === 'list' ? 'active' : '') + '">Усі слова</button><button data-go="dict">📒 Мій словник →</button></div></div><div id="w-body"></div>';
    $$('[data-s]').forEach((b) => b.onclick = () => { location.hash = '#/words/' + b.dataset.s; });
    $('[data-go]').onclick = () => { location.hash = '#/dict'; };
    const body = $('#w-body');
    if (sub === 'list') wordList(body);
    else review(body, only);
  }
  function review(body, only) {
    const q = EN.srsQueue(only);
    const queue = q.due.concat(q.fresh);
    if (!queue.length) {
      const any = EN.srsCounts(only).all;
      body.innerHTML = '<div class="card center"><h2>🎉 На сьогодні все!</h2><p class="muted">' + (any ? 'Повертайтеся завтра. Нові слова з\'являються, коли ви відкриваєте нові уроки або додаєте слова в словник.'
        : only ? 'У словнику ще немає слів.' : 'Відкрийте перший урок або додайте слова в «📒 Мій словник».') + '</p>' +
        (only ? '<a class="btn primary" href="#/dict">📒 До словника</a>' : '<a class="btn primary" href="#/lesson/' + EN.currentLesson().id + '">До уроку</a>') + '</div>';
      return;
    }
    let i = 0;
    const again = [];
    const show = () => {
      const w = queue[i] || again.shift();
      if (!w) return review(body, only);
      const dirSet = EN.S.settings.dir;
      const toEn = dirSet === 'uk' ? true : dirSet === 'en' ? false : Math.random() < 0.5;
      const isNew = !EN.S.cards[w.id];
      const said = EN.sayText(w.en);
      body.innerHTML = '<div class="card ex-box"><div class="row small muted"><span>' + (isNew ? '<span class="pill amber">нове</span>' : '') + (w.lesson === 'my' ? ' <span class="pill">📒</span>' : '') + ' ' + (toEn ? 'Як це англійською?' : 'Що це означає?') + '</span><span class="spacer"></span>залишилось: ' + (queue.length - i + again.length) + '</div>' +
        '<div class="flash"><div class="front">' + (toEn ? esc(w.uk) : esc(w.en)) + '</div>' + (!toEn && w.ipa ? '<div class="ipa">' + esc(w.ipa) + '</div>' : '') +
        '<div class="back" style="display:none"><div class="big-phrase">' + esc(w.en) + '</div>' + (toEn && w.ipa ? '<div class="ipa">' + esc(w.ipa) + '</div>' : '') + (toEn ? '' : '<div>' + esc(w.uk) + '</div>') +
        (w.note ? '<div class="small muted">' + esc(w.note) + '</div>' : '') + (w.ex ? '<div class="small">' + EN.sayHtml(w.ex) + '</div>' : '') + '</div></div>' +
        '<div class="row" style="justify-content:center"><button class="btn" id="fl-say">🔊</button><button class="btn primary" id="fl-show">Показати відповідь<span class="kbd"> (пробіл)</span></button></div>' +
        '<div class="srs-btns" style="display:none">' + [[1, 'Знову'], [2, 'Важко'], [3, 'Добре'], [4, 'Легко']].map((g) => '<button class="btn" data-g="' + g[0] + '">' + g[1] + '<small>' + EN.nextIntervalLabel(w, g[0]) + '<span class="kbd"> · ' + g[0] + '</span></small></button>').join('') + '</div></div>';
      const reveal = () => { $('.back', body).style.display = ''; $('#fl-show').style.display = 'none'; $('.srs-btns', body).style.display = ''; EN.TTS.say(said); };
      $('#fl-say').onclick = () => EN.TTS.say(said);
      if (!toEn) EN.TTS.say(said);
      $('#fl-show').onclick = reveal;
      $$('[data-g]', body).forEach((b) => b.onclick = () => grade(+b.dataset.g));
      const grade = (g) => { EN.srsGrade(w, g); if (g === 1) again.push(w); if (queue[i] === w) i++; show(); };
      body._key = (e) => {
        if (e.code === 'Space' && $('#fl-show') && $('#fl-show').style.display !== 'none') { e.preventDefault(); reveal(); }
        else if (/^[1-4]$/.test(e.key) && $('.srs-btns', body).style.display !== 'none') grade(+e.key);
      };
    };
    document.onkeydown = (e) => { if (body._key && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) body._key(e); };
    show();
  }
  function wordList(body) {
    const words = EN.allWords();
    body.innerHTML = '<div class="card"><input type="text" id="w-q" placeholder="Пошук англійською чи українською…"><div class="tblwrap" style="margin-top:10px"><table id="w-t"><tr><th>Англійською</th><th>Українською</th><th>Наступне повторення</th></tr>' +
      words.map((w) => { const c = EN.S.cards[w.id]; const d = c ? c.due - EN.today() : null;
        return '<tr><td>' + EN.sayHtml(w.en, EN.sayText(w.en)) + (w.lesson === 'my' ? ' <span class="small">📒</span>' : '') + '</td><td>' + esc(w.uk) + '</td><td class="small muted">' + (c ? (d <= 0 ? 'сьогодні' : 'через ' + d + ' дн.') : 'нове') + '</td></tr>'; }).join('') +
      '</table></div>' + (words.length ? '' : '<p class="muted">Поки порожньо — відкрийте урок або додайте слова в словник.</p>') + '</div>';
    $('#w-q').oninput = (e) => { const v = e.target.value.toLowerCase(); $$('#w-t tr').slice(1).forEach((tr) => { tr.style.display = tr.textContent.toLowerCase().includes(v) ? '' : 'none'; }); };
  }

  const DRILLS = [
    ['n20', '🎧 Числа 0–20', { g: 'numListen', min: 0, max: 20 }],
    ['teen', '🎧 -teen чи -ty (13 / 30)', { g: 'teenListen' }],
    ['n100', '🎧 Числа 20–100', { g: 'numListen', min: 20, max: 100 }],
    ['n999', '🎧 Числа 100–999', { g: 'numListen', min: 100, max: 999 }],
    ['big', '🎧 Тисячі й мільйони', { g: 'numListen', min: 1000, max: 2000000 }],
    ['price', '🎧 Ціни (£, $, €)', { g: 'priceListen', min: 1, max: 99 }],
    ['time', '🎧 Час', { g: 'timeListen' }],
    ['date', '🎧 Дати', { g: 'dateListen' }],
    ['year', '🎧 Роки', { g: 'yearListen' }],
    ['phone', '🎧 Номери телефонів', { g: 'phoneListen' }],
    ['spell', '🎧 Слова по буквах (spelling)', { g: 'spellListen' }],
    ['nw', '✍️ Число → словами', { g: 'numWords', min: 0, max: 999 }],
    ['tw', '✍️ Час → словами', { g: 'timeWords' }],
    ['dw', '✍️ Дата → словами', { g: 'dateWords' }],
    ['mix', '🎲 Мікс усього', null]
  ];
  function renderDrill(mode) {
    view().innerHTML = EN.views.voiceBanner() + '<div class="card"><div class="row small muted"><a href="#/lessons">← Уроки</a></div><h1>🔢 Тренажер чисел, цін, часу, дат і spelling</h1>' +
      '<p class="muted">Вправи щоразу нові, по 10 за підхід. На слух — записуєте цифрами (чи слово, яке продиктували по буквах); «словами» — пишете англійською (дефіси й «and» не важливі). Почніть із «Числа 0–20», «-teen чи -ty» і «Ціни».</p>' +
      '<div class="row">' + DRILLS.map((d) => '<a class="btn small' + (d[0] === mode ? ' primary' : '') + '" href="#/drill/' + d[0] + '">' + d[1] + '</a>').join('') + '</div></div><div id="dr-body"></div>';
    const d = DRILLS.find((x) => x[0] === mode);
    if (!d) { $('#dr-body').innerHTML = '<div class="card center muted">Виберіть режим угорі.</div>'; return; }
    const pool = DRILLS.filter((x) => x[2]).map((x) => x[2]);
    const specs = Array.from({ length: 10 }, () => Object.assign({ t: 'g' }, d[2] || pool[Math.floor(Math.random() * pool.length)]));
    EN.runExercises($('#dr-body'), specs, { drill: true });
  }

  function renderSpeak() {
    const opened = EN.lessons.filter((l) => EN.S.lessons[l.id] && EN.S.lessons[l.id].opened);
    const pool = (opened.length ? opened : EN.lessons.slice(0, 1));
    const phrases = pool.flatMap((l) => l.say.map((p) => ({ en: p[0], uk: p[1], l: l.num })));
    const prompts = pool.flatMap((l) => l.speak.map((s) => ({ s, l: l.num })));
    if (!phrases.length || !prompts.length) { view().innerHTML = '<div class="card"><h1>🎙️ Розмова</h1><p class="muted">Відкрийте перший урок — тут з\'являться фрази для практики.</p></div>'; return; }
    view().innerHTML = EN.views.voiceBanner() + '<div class="card"><h1>🎙️ Розмова</h1><p class="muted">Розмова — ваш пріоритет №1. Тут фрази з уроків, які ви вже відкрили. Слухайте, повторюйте, записуйте себе й порівнюйте з диктором.</p></div>' +
      '<div class="card"><h3>🔁 Shadowing</h3><div class="center"><div class="big-phrase" id="sh-en"></div><div class="muted" id="sh-uk"></div><div class="small muted" id="sh-l"></div></div>' +
      '<div class="row" style="justify-content:center;margin-top:10px"><button class="btn" id="sh-play">🔊 Слухати</button><button class="btn" id="sh-slow">🐢 Повільно</button><span id="sh-rec"></span><button class="btn primary" id="sh-next">Наступна →</button></div>' +
      '<p class="small muted center">Схема: послухайте 2 рази → скажіть разом із диктором → скажіть самі → запишіть → порівняйте. Слідкуйте за наголосом та інтонацією, а не лише за звуками.</p></div>' +
      '<div class="card"><h3>🗣️ Говоріть 1 хвилину</h3><p id="pr-text" style="font-size:1.1rem"></p><div class="row"><span class="timer" id="pr-t">1:00</span><button class="btn primary" id="pr-go">▶ Старт</button><button class="btn" id="pr-next">Інше завдання</button><span id="pr-rec"></span></div>' +
      '<p class="small muted">Не зупиняйтеся, навіть якщо помиляєтеся. Забули слово — опишіть його іншими словами: «It\'s a thing that…».</p></div>' +
      '<div class="card"><h3>🎯 Мої місії</h3>' + EN.lessons.map((l) => '<div class="lesson-item"><span class="num">' + esc(l.num) + '</span><span class="small">' + EN.rich(l.mission) + '</span><span class="spacer"></span>' + (EN.S.lessons[l.id] && EN.S.lessons[l.id].mission ? '<span class="done-mark">✓</span>' : '<a class="btn small" href="#/lesson/' + l.id + '/mission">→</a>') + '</div>').join('') + '</div>';
    let k = 0; const order = EN.shuffle(phrases);
    const cur = () => order[k % order.length];
    const drawPh = () => { $('#sh-en').textContent = cur().en; $('#sh-uk').textContent = cur().uk; $('#sh-l').textContent = 'урок ' + cur().l; };
    drawPh();
    $('#sh-play').onclick = () => EN.TTS.say(cur().en);
    $('#sh-slow').onclick = () => EN.TTS.say(cur().en, 0.6);
    $('#sh-next').onclick = () => { k++; drawPh(); EN.TTS.say(cur().en); };
    EN.recorderWidget($('#sh-rec'));
    EN.recorderWidget($('#pr-rec'));
    let pk = Math.floor(Math.random() * prompts.length), pInt = null;
    const drawPr = () => { $('#pr-text').innerHTML = EN.rich(prompts[pk % prompts.length].s); };
    drawPr();
    $('#pr-next').onclick = () => { pk++; drawPr(); };
    $('#pr-go').onclick = () => {
      clearInterval(pInt); const end = Date.now() + 60000, el = $('#pr-t');
      // Рахуємо від часу старту: на телефоні з вимкненим екраном тики setInterval зупиняються
      pInt = setInterval(() => {
        const left = Math.max(0, Math.ceil((end - Date.now()) / 1000));
        el.textContent = Math.floor(left / 60) + ':' + String(left % 60).padStart(2, '0');
        if (left <= 0) { clearInterval(pInt); EN.toast('Хвилина минула! 👏'); EN.logActivity('speak'); }
      }, 250);
    };
  }

  function renderRef() {
    if (!EN.ref.length) { view().innerHTML = '<div class="card"><h1>📚 Довідник</h1><p class="muted">Довідник ще порожній.</p></div>'; return; }
    view().innerHTML = '<div class="card"><h1>📚 Довідник</h1><input type="text" id="r-q" placeholder="Пошук у таблицях: напр. «bought», «magazine», «in / on / at»…">' +
      '<div class="row small" style="margin-top:8px">' + EN.ref.map((r) => '<a href="#/ref" data-jump="' + r.id + '">' + esc(r.title) + '</a>').join(' · ') + '</div></div>' +
      EN.ref.map((r) => '<div class="card" id="ref-' + r.id + '"><h2>' + esc(r.title) + '</h2>' + EN.rich(r.html) + '</div>').join('');
    $$('[data-jump]').forEach((a) => a.onclick = (e) => { e.preventDefault(); document.getElementById('ref-' + a.dataset.jump).scrollIntoView({ behavior: 'smooth' }); });
    $('#r-q').oninput = (e) => {
      const v = e.target.value.toLowerCase().trim();
      $$('#view table tr').forEach((tr) => { if (tr.querySelector('th')) return; tr.style.display = !v || tr.textContent.toLowerCase().includes(v) ? '' : 'none'; });
    };
  }

  function renderSettings() {
    const s = EN.S.settings;
    const T = EN.TTS, voices = T.voices, ONLINE = T.ONLINE;
    const known = s.voice === ONLINE || voices.some((v) => v.name === s.voice);
    const opt = (val, label, sel) => '<option value="' + esc(val) + '"' + (sel ? ' selected' : '') + '>' + esc(label) + '</option>';
    const group = (acc, title) => {
      const list = voices.filter((v) => T.accentOf(v) === acc);
      return list.length ? '<optgroup label="' + title + '">' + list.map((v) => opt(v.name, v.name + (v.localService === false && !/online/i.test(v.name) ? ' (онлайн)' : ''), known && v.name === s.voice)).join('') + '</optgroup>' : '';
    };
    const hasAccent = voices.some((v) => T.accentOf(v) === s.accent);
    view().innerHTML = '<div class="card"><h1>⚙️ Налаштування</h1>' +
      '<h3>🔊 Вимова й голос</h3><div class="row"><label>Акцент:</label><span class="seg">' + [['us', 'Американська (US)'], ['gb', 'Британська (UK)']].map((a) => '<button data-acc="' + a[0] + '" class="' + (s.accent === a[0] ? 'active' : '') + '">' + a[1] + '</button>').join('') + '</span></div>' +
      '<p class="small muted" style="margin:6px 0 10px">Акцент визначає, яким голосом звучать уроки, слова й словник. У словнику кожне слово можна послухати й з іншим акцентом.</p>' +
      '<label class="small muted">Голос</label><select id="st-voice">' +
        opt('', 'Автоматично: ' + (hasAccent ? 'найкращий голос системи' : 'онлайн-голос Google'), !known) +
        group('us', 'Американська (US)') + group('gb', 'Британська (UK)') + group('other', 'Інші англійські') +
        opt(ONLINE, 'Google — онлайн (' + (s.accent === 'gb' ? 'британська' : 'американська') + ')', s.voice === ONLINE) + '</select>' +
      '<p class="small muted" style="margin:6px 0 0">Зараз говорить: <b>' + esc(T.label()) + '</b>. ' +
        (hasAccent ? '' : 'Голосу цього акценту в системі немає, тому говорить онлайн-голос Google — потрібен інтернет. ') +
        'Найприродніше звучать голоси з позначкою «Natural» (Edge) і «Google» (Chrome). Онлайн-голосу надсилається лише англійський текст.</p>' +
      '<details class="small" style="margin-top:6px"' + (voices.length ? '' : ' open') + '><summary>Як додати англійський голос, що працює без інтернету</summary><ul>' +
        '<li><b>Windows</b>: Параметри → Час і мова → Мовлення → Додати голоси → English (United States) / English (United Kingdom). Потім перезапустіть браузер.</li>' +
        '<li><b>Microsoft Edge</b>: уже має природні голоси «Microsoft Aria / Jenny / Guy / Sonia / Ryan Online (Natural)» (потрібен інтернет).</li>' +
        '<li><b>Mac</b>: Системні параметри → Доступність → Вміст мовлення → Системний голос → «Керувати голосами…» → English → завантажте голоси з позначкою Premium чи Enhanced.</li>' +
        '<li><b>Android</b>: Налаштування → Спеціальні можливості → Синтез мовлення → Google → Мова → English (US / UK).</li>' +
        '<li><b>iPhone / iPad</b>: Параметри → Універсальний доступ → Усний вміст → Голоси → English → завантажте «Enhanced».</li></ul></details>' +
      '<div class="row" style="margin-top:8px"><label>Швидкість: <b id="st-rate-v">' + esc(s.rate) + '</b></label><input type="range" id="st-rate" min="0.5" max="1.2" step="0.05" value="' + esc(s.rate) + '" style="flex:1"><button class="btn small" id="st-test">Перевірити</button></div>' +
      '<h3>✍️ Вправи</h3><label class="row"><input type="checkbox" id="st-strict"' + (s.strict ? ' checked' : '') + '> Суворо перевіряти написання (відповідь з однією опискою не зараховується)</label>' +
      '<h3>🃏 Слова</h3><div class="row"><label>Нових слів на день:</label><input type="number" id="st-new" min="0" max="50" value="' + esc(s.newPerDay) + '" style="width:90px"></div>' +
      '<div class="row" style="margin-top:8px"><label>Напрям карток:</label><select id="st-dir" style="width:auto"><option value="mix">мікс</option><option value="en">англійська → українська</option><option value="uk">українська → англійська</option></select></div>' +
      '<h3>📒 Мій словник</h3><label class="row"><input type="checkbox" id="st-ipa"' + (s.autoIpa ? ' checked' : '') + '> Автоматично шукати транскрипцію й записи носіїв для нових слів (сервіс dictionaryapi.dev отримує лише англійське слово)</label>' +
      '</div><div class="card"><h3>💾 Збереження прогресу</h3><p class="small muted">Прогрес зберігається в браузері на цьому пристрої (у сховищі цього сайту). На іншому пристрої чи в іншому браузері прогрес окремий; мій словник можна перенести через <a href="#/dict/io">⇅ Імпорт / експорт</a>.</p>' +
      storageStatus() +
      progressSummary() +
      '<h3>↺ Почати наново</h3><p class="small muted">Скидання не можна скасувати. Кожна кнопка просить підтвердження (друге натискання). Мій словник ці кнопки не видаляють.</p>' +
      '<div class="row"><button class="btn" id="st-rl" title="Уроки, вправи, місії, пропуски">Скинути уроки</button><button class="btn" id="st-rw" title="Інтервали повторення; самі слова й словник лишаються">Скинути повторення слів</button>' +
      '<span class="spacer"></span><button class="btn danger" id="st-reset" title="Усе, крім налаштувань і мого словника">Почати навчання з нуля</button></div></div>' +
      '<div class="card"><h3>📲 Встановити як додаток</h3>' + (EN.isInstalled() ? '<p class="small"><span class="done-mark">✓</span> Тренажер відкрито як встановлений додаток.</p>' : installHelp()) +
      '<p class="small muted" style="margin:8px 0 0">Версія тренажера: ' + esc(EN.BUILD || 'розробка (src/)') + '</p></div>';
    $('#st-dir').value = s.dir;
    $$('[data-acc]').forEach((b) => b.onclick = () => {
      s.accent = b.dataset.acc;
      const chosen = voices.find((v) => v.name === s.voice);
      if (chosen && T.accentOf(chosen) !== s.accent) s.voice = '';
      EN.save(); renderSettings(); EN.TTS.say('Hello! How are you today?');
    });
    $('#st-voice').onchange = (e) => {
      s.voice = e.target.value;
      const chosen = voices.find((v) => v.name === s.voice);
      if (chosen && T.accentOf(chosen) !== 'other') s.accent = T.accentOf(chosen);
      EN.save(); renderSettings(); EN.TTS.say('Hello! How are you today?');
    };
    $('#st-rate').oninput = (e) => { s.rate = +e.target.value; $('#st-rate-v').textContent = s.rate; EN.save(); };
    $('#st-test').onclick = () => EN.TTS.say('Hello! My name is Alex. I\'m learning English, and it\'s going really well.');
    $('#st-strict').onchange = (e) => { s.strict = e.target.checked; EN.save(); };
    $('#st-ipa').onchange = (e) => { s.autoIpa = e.target.checked; EN.save(); };
    $('#st-new').onchange = (e) => { s.newPerDay = Math.max(0, Math.min(50, +e.target.value || 0)); EN.save(); };
    $('#st-dir').onchange = (e) => { s.dir = e.target.value; EN.save(); };
    bindInstall(view());
    const per = $('#st-persist');
    if (per) per.onclick = () => EN.Storage.check(true).then((p) => { EN.toast(p ? 'Постійне сховище увімкнено ✓' : 'Браузер поки не дозволив. Встановіть тренажер як додаток — це найнадійніше.', 5000); renderSettings(); });
    EN.confirmClick($('#st-rl'), 'Точно скинути уроки?', () => { EN.resetLessons(); EN.toast('Прогрес уроків скинуто'); renderSettings(); });
    EN.confirmClick($('#st-rw'), 'Точно скинути повторення?', () => { EN.resetWords(); EN.toast('Повторення слів скинуто'); renderSettings(); });
    EN.confirmClick($('#st-reset'), 'Точно почати з нуля?', () => {
      const keep = { settings: EN.S.settings, dict: EN.S.dict };
      EN.resetState(); Object.assign(EN.S, keep); EN.save();
      EN.toast('Прогрес скинуто — починаємо спочатку! Словник збережено.'); location.hash = '#/today';
    });
  }
  function storageStatus() {
    const p = EN.Storage.persisted, st = EN.store;
    const row = (k, v) => '<tr><td>' + k + '</td><td>' + v + '</td></tr>';
    const ok = '<span class="done-mark">✓</span> ';
    return '<div class="tblwrap"><table>' +
      row('Постійне сховище', p === true ? ok + 'увімкнено: браузер не видалить прогрес сам'
        : p === false ? '⚠️ ні: браузер може видалити дані сайту, коли на пристрої забракне місця. Найнадійніше — встановити тренажер як додаток (див. нижче). <button class="btn small" id="st-persist">Спробувати ввімкнути</button>'
          : 'невідомо: браузер про це не повідомляє') +
      row('Запис', st.newer ? '⚠️ прогрес записала новіша версія тренажера. Оновіть сторінку з інтернетом; доти зміни тут не зберігаються.'
        : st.failed ? '⚠️ останнє збереження не вдалося (' + esc(st.failed.name || st.failed) + '). Перевірте, чи не заблоковано для сайту файли cookie й дані сайтів і чи є місце на пристрої.'
          : st.broken ? '⚠️ збережений прогрес не вдалося прочитати (' + esc(st.broken.name || st.broken.message || st.broken) + '). Якщо він був, його копія лежить у сховищі сайту під ключем <code>' + esc(st.key) + '-broken</code>.'
            : ok + 'працює') +
      '</table></div><p class="small muted">Прогрес зникне, якщо в браузері очистити «Файли cookie та інші дані сайтів» для цього сайту. Тому час від часу зберігайте файл словника.</p>';
  }
  function installHelp() {
    return '<p class="small">Встановлений тренажер відкривається з головного екрана чи меню «Пуск» в окремому вікні й працює без інтернету (крім онлайн-голосу й пошуку транскрипції), а браузер надійніше зберігає його прогрес.</p>' +
      (EN.Install.prompt ? '<button class="btn primary install-btn">📲 Встановити</button>' : '') +
      '<ul class="small"><li><b>Android (Chrome)</b>: меню ⋮ → «Додати на головний екран» → «Установити».</li>' +
      '<li><b>Комп\'ютер (Chrome / Edge)</b>: значок «Установити» праворуч в адресному рядку (або в меню ⋮).</li>' +
      '<li><b>iPhone / iPad</b>: кнопка «Поділитися» → «На екран „Додому“».</li></ul>';
  }
  function bindInstall(root) {
    $$('.install-btn', root).forEach((b) => { b.onclick = () => EN.Install.run(); });
  }
  // persisted === null означає «ще не відповів або не підтримує» — тоді порада була б зайвим нагадуванням
  EN.fillInstallTip = function () {
    const el = document.getElementById('install-tip'); if (!el) return;
    const show = EN.S.ui.installTip && !EN.isInstalled() && EN.Storage.persisted === false;
    el.innerHTML = show ? '<div class="tip" style="margin:0 0 14px"><div class="row"><b>📲 Встановіть тренажер як додаток</b><span class="spacer"></span><button class="btn small" id="it-hide" title="Більше не показувати">✕</button></div>' +
      '<p class="small" style="margin:6px 0">Так браузер не видалить ваш прогрес і словник, коли на пристрої забракне місця, а тренажер відкриватиметься з головного екрана й без інтернету.</p>' +
      (EN.Install.prompt ? '<button class="btn primary small install-btn">📲 Встановити</button>'
        : '<p class="small muted" style="margin:0">Chrome: меню ⋮ → «Додати на головний екран» (телефон) або значок «Установити» в адресному рядку (комп\'ютер). Докладніше — у ⚙️ «Налаштування».</p>') + '</div>' : '';
    if (!show) return;
    bindInstall(el);
    $('#it-hide', el).onclick = () => { EN.S.ui.installTip = false; EN.save(); el.innerHTML = ''; };
  };

  function progressSummary() {
    const L = EN.lessons;
    const cur = EN.currentLesson();
    const done = L.filter((l) => EN.lessonDone(l.id)).length, skipped = L.filter((l) => EN.lessonSkipped(l.id)).length;
    const runs = L.filter((l) => EN.S.lessons[l.id] && EN.S.lessons[l.id].run).length;
    const c = EN.srsCounts();
    const days = Object.keys(EN.S.days).length;
    const mods = Object.values(EN.S.modules).filter(Boolean).length;
    return '<div class="tblwrap" style="margin-top:10px"><table><tr><th colspan="2">Що збережено зараз</th></tr>' +
      '<tr><td>Уроки</td><td>пройдено ' + done + ', пропущено ' + skipped + ' з ' + L.length + (runs ? '; незавершених підходів до вправ: ' + runs : '') + '</td></tr>' +
      (cur ? '<tr><td>Поточний урок</td><td>' + esc(cur.num + ' · ' + cur.title) + '</td></tr>' : '') +
      '<tr><td>Слова</td><td>у повторенні ' + c.known + ', на сьогодні ' + c.due + ', нових чекають ' + c.unseen + '</td></tr>' +
      '<tr><td>Мій словник</td><td>' + EN.S.dict.length + ' слів</td></tr>' +
      (mods ? '<tr><td>Модулі</td><td>позначено ' + mods + '</td></tr>' : '') +
      '<tr><td>Активність</td><td>днів із заняттями: ' + days + ', серія: ' + EN.streak() + '</td></tr></table></div>';
  }

  function route(keepScroll) {
    const y = window.scrollY;
    document.onkeydown = null;
    if (EN.Rec.active()) EN.Rec.stop();
    const parts = (location.hash || '#/today').replace(/^#\//, '').split('/');
    const page = parts[0] || 'today';
    const owner = { lesson: 'lessons', drill: 'lessons' }[page] || page;
    $$('nav.tabs a').forEach((a) => a.classList.toggle('active', a.dataset.page === owner));
    const V = EN.views;
    try {
      if (page === 'program') V.renderProgram();
      else if (page === 'lessons') V.renderLessons();
      else if (page === 'lesson') V.renderLesson(parts[1], parts[2]);
      else if (page === 'words') renderWords(parts[1], parts[2]);
      else if (page === 'dict') EN.renderDict(parts[1]);
      else if (page === 'speak') renderSpeak();
      else if (page === 'drill') renderDrill(parts[1]);
      else if (page === 'ref') renderRef();
      else if (page === 'settings') renderSettings();
      else V.renderToday();
    } catch (e) {
      console.error(e);
      view().innerHTML = '<div class="card"><h2>Щось пішло не так</h2><pre class="small">' + esc(e && e.stack || e) + '</pre></div>';
    }
    window.scrollTo(0, keepScroll ? y : 0);
  }
  const currentPage = () => (location.hash || '').replace(/^#\//, '').split('/')[0];
  // Учень, що саме набирає слово у формі словника чи імпорту, не має втратити текст через перемальовування
  const typing = () => { const a = document.activeElement; return !!(a && /^(INPUT|TEXTAREA)$/.test(a.tagName) && a.value); };

  // Нова версія вже керує сторінкою (sw.js робить skipWaiting), але відкритий екран ще зі старим кодом
  function showUpdateBar() {
    if (document.querySelector('.update-bar')) return;
    const bar = document.createElement('div');
    bar.className = 'update-bar';
    bar.innerHTML = '🔄 Вийшла нова версія тренажера <button class="btn small primary">Оновити</button>';
    bar.querySelector('button').onclick = () => location.reload();
    document.body.appendChild(bar);
  }
  // У src/ (розробка) EN.BUILD немає: там service worker закешував би окремі файли й ховав би свіжі правки
  function registerWorker() {
    if (!EN.BUILD || !('serviceWorker' in navigator) || !/^https?:$/.test(location.protocol)) return;
    navigator.serviceWorker.addEventListener('message', (e) => {
      if (e.data && e.data.type === 'activated' && e.data.version !== EN.BUILD) showUpdateBar();
    });
    navigator.serviceWorker.register('sw.js').then((reg) => {
      // Встановлений додаток на телефоні може жити днями без перезавантаження — перевіряємо оновлення при кожному поверненні
      document.addEventListener('visibilitychange', () => { if (!document.hidden) reg.update().catch(() => {}); });
    }).catch((e) => console.warn('Service worker не зареєстровано', e));
  }

  function init() {
    // Іконка вкладки береться з прапора в шапці (index.html), щоб малюнок жив лише в одному місці
    const logo = document.querySelector('.logo svg'), icon = document.querySelector('link[rel="icon"]');
    if (logo && icon) icon.href = 'data:image/svg+xml,' + encodeURIComponent(logo.outerHTML);
    const nav = document.getElementById('nav'), header = document.querySelector('header.top');
    nav.innerHTML = EN.views.NAV.map((n) => '<a href="#/' + n[0] + '" data-page="' + n[0] + '" title="' + n[2] + '"' + (n[4] ? ' class="wide-only"' : '') + '><span>' + n[1] + '</span> <span class="lbl">' + n[2] + '</span><span class="lbl-s">' + n[3] + '</span></a>').join('');
    // Ширина підписів залежить від шрифту й емодзі системи, тож місце не вгадується брейкпоінтом, а вимірюється
    const fitNav = () => {
      header.classList.remove('nav-compact', 'nav-tight');
      if (matchMedia('(max-width:700px)').matches) return;
      for (const c of ['nav-compact', 'nav-tight']) { if (nav.scrollWidth <= nav.clientWidth + 1) break; header.classList.add(c); }
    };
    fitNav();
    let fitting = 0;
    window.addEventListener('resize', () => { cancelAnimationFrame(fitting); fitting = requestAnimationFrame(fitNav); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitNav);
    document.addEventListener('click', (e) => {
      const el = e.target.closest('.say');
      if (el) EN.TTS.say(el.dataset.say);
    });
    // Список голосів і інтернет з'являються/зникають після рендеру. Повний перерендер — лише в налаштуваннях:
    // на інших екранах він збив би таймер або вправу, тож там лише додаємо чи прибираємо банер
    let lastState = null;
    EN.TTS.listeners.push(() => {
      const state = EN.TTS.voices.length + ':' + (EN.TTS.settled ? 1 : 0) + ':' + navigator.onLine;
      if (lastState === null) { lastState = state; return; }
      if (state === lastState) return;
      lastState = state;
      if (currentPage() === 'settings') { route(true); return; }
      const b = document.querySelector('.voice-banner'), show = EN.TTS.silent();
      if (show && !b) view().insertAdjacentHTML('afterbegin', EN.views.voiceBanner());
      else if (!show && b) b.remove();
    });
    EN.TTS.init();
    // Відповідь браузера про сховище й можливість встановлення приходять уже після першого рендеру
    const envChanged = () => { if (currentPage() === 'settings') route(true); else EN.fillInstallTip(); };
    EN.Storage.listeners.push(envChanged);
    EN.Install.listeners.push(envChanged);
    // Прогрес змінився в іншій вкладці. Прихована вкладка перемальовується, лише коли до неї повернуться:
    // інакше вона, наприклад, почала б озвучувати картку слова у фоні
    let stale = false;
    EN.onExternalChange = () => { if (document.hidden || typing()) stale = true; else route(true); };
    document.addEventListener('visibilitychange', () => { if (!document.hidden && stale) { stale = false; route(true); } });
    window.addEventListener('hashchange', () => route());
    if (!EN.S.start) { EN.S.start = EN.today(); EN.save(); }
    route();
    EN.Storage.check(true);
    registerWorker();
  }
  document.addEventListener('DOMContentLoaded', init);
})(window.EN);

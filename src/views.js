/* Екрани «Сьогодні», «Програма», «Уроки», «Урок» */
(function (EN) {
  'use strict';
  const esc = EN.esc, $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const view = () => document.getElementById('view');
  const P = EN.program;

  // [id, іконка, підпис, короткий підпис, лише на широкому екрані]. «Програма» на телефоні — посилання з «Уроків»:
  // восьма вкладка в нижній навігації не вміщується
  const NAV = [['today', '🏠', 'Сьогодні', 'Сьогодні'], ['program', '🗺️', 'Програма', 'План', true], ['lessons', '📘', 'Уроки', 'Уроки'], ['words', '🃏', 'Слова', 'Слова'],
    ['dict', '📒', 'Словник', 'Словник'], ['speak', '🎙️', 'Розмова', 'Мова'], ['ref', '📚', 'Довідник', 'Довідка'], ['settings', '⚙️', 'Налаштування', 'Опції']];

  function stageOf(id) { return P.stages.find((s) => s.id === id); }
  // Модуль програми може мати поле lesson: 'a2-1' — тоді він виконаний, коли пройдено урок
  const modLesson = (m) => (m.lesson && EN.lessonById(m.lesson)) || null;
  const modDone = (m) => (modLesson(m) ? EN.lessonClosed(m.lesson) : !!EN.S.modules[m.id]);
  function overall() {
    let done = 0, total = 0;
    P.stages.forEach((s) => {
      if (s.built) EN.lessons.filter((l) => l.stage === s.id).forEach((l) => { total++; if (EN.lessonClosed(l.id)) done++; });
      else (s.modules || []).forEach((m) => { total++; if (modDone(m)) done++; });
    });
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
  }
  // Що прогрес не зберігається чи озвучення не працює, учень має побачити на будь-якому екрані, а не лише в налаштуваннях
  function voiceBanner() {
    let h = '';
    if (EN.store.newer) h += '<div class="warn-banner">⚠️ Ваш прогрес збережено новішою версією тренажера. Оновіть сторінку з інтернетом — доти зміни не зберігаються.</div>';
    else if (EN.store.broken) h += '<div class="warn-banner">⚠️ Не вдалося прочитати збережений прогрес. Подробиці — у ⚙️ «Налаштування».</div>';
    if (EN.TTS.silent()) h += '<div class="warn-banner voice-banner">🔇 Немає інтернету, а англійського голосу в цій системі немає, тому озвучення не працюватиме. Як додати голос, що працює без інтернету, — див. ⚙️ «Налаштування».</div>';
    return h;
  }

  function renderToday() {
    const t = EN.today(), wd = EN.dayOfWeek(t);
    const cur = EN.currentLesson();
    const counts = EN.srsCounts();
    const q = EN.srsQueue();
    const o = overall();
    const isA0 = cur && cur.stage === 'a0';
    const plan = P.week.find((w) => w.d === wd);
    const date = new Date().toLocaleDateString('uk-UA', { weekday: 'long', day: 'numeric', month: 'long' });
    const dictN = EN.S.dict.length;
    view().innerHTML = voiceBanner() + '<div id="install-tip"></div>' +
      '<div class="card"><div class="row"><div><h1>Hello! 👋</h1><div class="muted">' + esc(date) + '</div></div><span class="spacer"></span>' +
      '<div class="center"><div class="stat">🔥 ' + EN.streak() + '</div><div class="small muted">днів поспіль<br>(вихідні не рахуються)</div></div></div></div>' +
      '<div class="grid g2">' +
      '<div class="card"><h3>📌 План на сьогодні</h3>' +
      (plan ? '<p><b>' + plan.name + ':</b> ' + esc(isA0 ? P.weekA0 : plan.full) + '</p><p class="small muted">Якщо є лише 15 хв: ' + esc(isA0 ? 'половина уроку' : plan.min) + '.</p>'
        : '<p>Вихідний 🙂 Навчання за бажанням: серіал чи подкаст англійською, пісні, гра з англійським інтерфейсом.</p>') +
      '<p class="small">' + esc(P.daily) + '</p>' +
      '<div class="row"><a class="btn primary" href="#/lesson/' + cur.id + '">📘 Урок ' + esc(cur.num) + '</a>' +
      '<a class="btn" href="#/words">🃏 Слова (' + q.total + ')</a><a class="btn" href="#/speak">🎙️ Розмова</a><a class="btn" href="#/drill">🔢 Числа</a></div></div>' +
      '<div class="card"><h3>⏱️ Таймер заняття</h3><div class="row"><span class="timer" id="tmr">15:00</span><span class="spacer"></span>' +
      '<button class="btn small" data-min="15">15 хв</button><button class="btn small" data-min="30">30 хв</button><button class="btn small" id="tmr-stop">Стоп</button></div>' +
      '<p class="small muted">Коротко, але щодня — це краще, ніж довго раз на тиждень.</p></div></div>' +
      '<div class="card"><h3>Поточний урок: ' + esc(cur.num + ' · ' + cur.title) + '</h3>' + lessonChecks(cur) + '</div>' +
      '<div class="card"><div class="row"><h3 style="margin:0">📒 Мій словник</h3><span class="spacer"></span><a class="btn small" href="#/dict">' + (dictN ? 'Відкрити (' + dictN + ')' : '＋ Додати перше слово') + '</a></div>' +
      '<p class="small muted" style="margin:6px 0 0">Почули нове слово на роботі, в серіалі чи пісні? Додайте його в словник — там його можна послухати з американською й британською вимовою, він потрапить у повторення, а словник можна експортувати й перенести на інший пристрій.</p></div>' +
      '<div class="grid g3">' +
      '<div class="card center"><div class="stat">' + o.pct + '%</div><div class="small muted">програми до B2 (' + o.done + ' з ' + o.total + ' уроків)</div><div class="bar" style="margin-top:8px"><i style="width:' + o.pct + '%"></i></div></div>' +
      '<div class="card center"><div class="stat">' + counts.known + '</div><div class="small muted">слів у повторенні</div></div>' +
      '<div class="card center"><div class="stat">' + counts.due + '</div><div class="small muted">слів на повторення сьогодні</div></div></div>';
    timerInit();
    if (EN.fillInstallTip) EN.fillInstallTip();
  }
  let tmrInt = null;
  function timerInit() {
    const el = $('#tmr'); if (!el) return;
    $$('[data-min]').forEach((b) => b.onclick = () => {
      clearInterval(tmrInt);
      // Рахуємо від часу старту: на телефоні з вимкненим екраном тики setInterval зупиняються
      const end = Date.now() + b.dataset.min * 60000;
      const draw = () => {
        const left = Math.max(0, Math.ceil((end - Date.now()) / 1000));
        el.textContent = String(Math.floor(left / 60)).padStart(2, '0') + ':' + String(left % 60).padStart(2, '0');
        return left;
      };
      draw();
      tmrInt = setInterval(() => { if (draw() <= 0) { clearInterval(tmrInt); EN.toast('⏰ Час вийшов! Well done — чудова робота!'); EN.TTS.say('Well done!'); } }, 250);
    });
    $('#tmr-stop').onclick = () => { clearInterval(tmrInt); el.textContent = '15:00'; };
  }
  function lessonChecks(l) {
    const s = EN.S.lessons[l.id] || {};
    const mk = (ok, txt) => '<span class="pill ' + (ok ? 'green' : 'gray') + '">' + (ok ? '✓ ' : '○ ') + txt + '</span>';
    const run = s.run && s.run.ft ? ' <span class="pill amber">⏸ вправи: ' + Object.keys(s.run.ft).length + ' з ' + (+s.run.n || 0) + '</span>' : '';
    return '<div class="row lesson-checks">' + (EN.lessonSkipped(l.id) ? '<span class="pill amber">⏭ пропущено</span>' : '') + mk(s.theory, 'Теорія') +
      mk(s.ex && s.ex.done, 'Вправи ≥ 80%' + (s.ex && s.ex.best != null ? ' (' + s.ex.best + '%)' : '')) + run +
      mk(s.speak, 'Розмова') + mk(s.mission, 'Місія') + '</div>';
  }
  function lessonBadge(l) {
    const st = EN.S.lessons[l.id] || {};
    if (EN.lessonDone(l.id)) return '<span class="pill green">✓ пройдено</span>';
    if (EN.lessonSkipped(l.id)) return '<span class="pill gray">⏭ пропущено</span>';
    if (st.run && st.run.ft) return '<span class="pill amber">⏸ ' + Object.keys(st.run.ft).length + '/' + (+st.run.n || 0) + '</span>';
    return st.opened ? '<span class="pill amber">у процесі</span>' : '';
  }

  function renderProgram() {
    const h = [];
    h.push('<div class="card"><h1>🗺️ Програма: від нуля до B2</h1><p>' + esc(P.intro) + '</p><p class="muted">' + esc(P.estimate) + '</p>' +
      '<button class="btn small no-print" onclick="window.print()">🖨️ Надрукувати / зберегти як PDF</button></div>');
    h.push('<div class="card"><h2>Принципи</h2><div class="grid g2">' + P.principles.map((p) => '<div><b>' + esc(p[0]) + '.</b> ' + esc(p[1]) + '</div>').join('') + '</div></div>');
    const wd = EN.dayOfWeek(EN.today());
    h.push('<div class="card"><h2>Тижневий ритм (15–30 хв)</h2><p class="small">' + esc(P.daily) + '</p><div class="tblwrap"><table class="week-plan"><tr><th>День</th><th>Повний варіант (30 хв)</th><th>Мінімум (15 хв)</th></tr>' +
      P.week.map((w) => '<tr' + (w.d === wd ? ' class="today-row"' : '') + '><td>' + w.name + '</td><td>' + esc(w.full) + '</td><td>' + esc(w.min) + '</td></tr>').join('') +
      '<tr><td>Сб–Нд</td><td colspan="2">Вільно. За бажанням — серіал, подкаст чи гра англійською.</td></tr></table></div><p class="small muted">' + esc(P.weekA0) + ' ' + esc(P.weekLong) + '</p></div>');
    P.stages.forEach((s, i) => {
      const items = s.built ? EN.lessons.filter((l) => l.stage === s.id) : s.modules;
      const done = s.built ? items.filter((l) => EN.lessonClosed(l.id)).length : items.filter(modDone).length;
      h.push('<details class="stage card"' + (i < 2 || done < items.length && done > 0 ? ' open' : '') + '><summary><div class="row"><span class="pill">' + esc(s.level) + '</span><h2 style="margin:0">' + esc(s.title) + '</h2><span class="spacer"></span><span class="small muted">тижні ' + esc(s.weeks) + ' · ' + done + '/' + items.length + '</span></div></summary>' +
        '<p><b>Після етапу я вмію:</b></p><ul class="check">' + s.cando.map((c) => '<li>' + esc(c) + '</li>').join('') + '</ul>' +
        (s.checkpoint ? '<p class="tip"><b>Контрольна точка:</b> ' + esc(s.checkpoint) + '</p>' : '') +
        (s.built ? (items.length ? items.map((l) => '<a class="lesson-item" href="#/lesson/' + l.id + '"><span class="num">' + esc(l.num) + '</span><span>' + esc(l.title) + '<br><span class="small muted">' + esc(l.dur) + ' · ' + esc(l.goals.join('; ')) + '</span></span><span class="spacer"></span>' + lessonBadge(l) + '</a>').join('') : '<p class="small muted">Уроки етапу ще не додано.</p>')
          : items.map((m) => '<details class="mod"><summary>' + (modDone(m) ? '<span class="done-mark">✓</span> ' : '') + esc(m.title) + ' <span class="small muted">· тижні ' + esc(m.weeks) + '</span></summary><div class="kv">' +
              [['Граматика', m.grammar], ['Лексика', m.vocab], ['Розмова', m.speak], ['Слухання', m.listen], ['Читання', m.read], ['Письмо', m.write], ['Місія', m.mission]].map((r) => '<b>' + r[0] + '</b><span>' + esc(r[1]) + '</span>').join('') +
              '</div><label class="row" style="margin-top:8px"><input type="checkbox" data-mod="' + m.id + '"' + (EN.S.modules[m.id] ? ' checked' : '') + '> Модуль виконано</label></details>').join('')) +
        '</details>');
    });
    const X = EN.exam;
    h.push('<div class="card"><h2>🎓 Іспити й сертифікати</h2><div class="tblwrap"><table>' + X.items.map((r) => '<tr><td><b>' + esc(r[0]) + '</b></td><td>' + esc(r[1]) + '</td></tr>').join('') + '</table></div>' +
      '<p class="small muted">' + esc(X.note) + ' Перевірено: ' + esc(X.checked) + '. ' + X.links.map((l) => '<a href="' + l[1] + '" target="_blank" rel="noopener">' + esc(l[0]) + '</a>').join(' · ') + '</p></div>');
    h.push('<div class="card"><h2>🔗 Ресурси</h2>' + EN.resources.map((g) => '<h3>' + esc(g.cat) + '</h3><ul>' + g.items.map((r) => '<li><a href="' + r[1] + '" target="_blank" rel="noopener"><b>' + esc(r[0]) + '</b></a> <span class="pill gray">' + esc(r[3]) + '</span> — ' + esc(r[2]) + '</li>').join('') + '</ul>').join('') + '</div>');
    view().innerHTML = h.join('');
    $$('[data-mod]').forEach((c) => c.onchange = () => { EN.S.modules[c.dataset.mod] = c.checked; EN.save(); EN.toast(c.checked ? 'Модуль позначено ✓' : 'Позначку знято'); });
  }

  function renderLessons() {
    const groups = P.stages.filter((s) => EN.lessons.some((l) => l.stage === s.id));
    view().innerHTML = '<div class="card"><h1>📘 Уроки</h1><p class="muted">Кожен урок складається з теорії з озвученням, слів, вправ, розмовної практики й місії в реальному житті. Урок зараховано, коли вправи виконано на ≥ 80%.</p>' +
      '<p class="small">Будь-який урок можна відкрити в будь-який момент. Усередині уроку є кнопки <b>«Пропустити урок»</b> (якщо тему вже знаєте), <b>«Почати з цього уроку»</b> (попередні позначаться як пропущені) і <b>«Пройти наново»</b>. Почати все з нуля можна в ⚙️ «Налаштуваннях».</p>' +
      '<div class="row"><a class="btn small" href="#/program">🗺️ Програма, іспити й ресурси</a></div></div>' +
      groups.map((s) => '<div class="card"><h2>' + esc(s.level + ' · ' + s.title) + '</h2>' + EN.lessons.filter((l) => l.stage === s.id).map((l) => {
        const st = EN.S.lessons[l.id] || {};
        const best = st.ex && st.ex.best != null ? st.ex.best + '%' : '—';
        return '<a class="lesson-item" href="#/lesson/' + l.id + '"><span class="num">' + esc(l.num) + '</span><span>' + esc(l.title) + '<br><span class="small muted">' + esc(l.dur) + ' · найкращий результат: ' + best + '</span></span><span class="spacer"></span>' +
          lessonBadge(l) + '</a>';
      }).join('') + '</div>').join('') +
      '<a class="card lesson-item" href="#/drill" style="text-decoration:none"><span class="num">🔢</span><span><b>Тренажер чисел, цін, часу, дат і spelling</b><br><span class="small muted">нескінченні диктанти на слух і письмо словами — для магазину, телефону, дзвінків і бронювань</span></span></a>' +
      '<a class="card lesson-item" href="#/dict/practice" style="text-decoration:none"><span class="num">📒</span><span><b>Тренування мого словника</b><br><span class="small muted">диктант і переклад зі слів, які ви додали самі</span></span></a>';
  }

  function lessonControls(l, idx) {
    const done = EN.lessonDone(l.id), skipped = EN.lessonSkipped(l.id);
    const st = EN.S.lessons[l.id] || {};
    const hasProgress = st.theory || st.ex || st.speak || st.mission || st.run || st.skipped;
    const earlierOpen = EN.lessons.slice(0, idx).some((x) => !EN.lessonClosed(x.id));
    return '<div class="row small" style="margin-top:8px">' +
      (!done && !skipped ? '<button class="btn small" id="lc-skip" title="Тему вже знаю — перейти до наступного уроку">⏭ Пропустити урок</button>' : '') +
      (skipped ? '<button class="btn small" id="lc-unskip">↩ Повернути урок</button>' : '') +
      (earlierOpen ? '<button class="btn small" id="lc-from" title="Усі попередні незавершені уроки позначаться як пропущені">▶ Почати з цього уроку</button>' : '') +
      (hasProgress ? '<button class="btn small" id="lc-reset" title="Скинути позначки й вправи цього уроку (слова лишаються)">↺ Пройти урок наново</button>' : '') +
      '</div>';
  }
  // Друге натискання підтверджує: незворотні дії не мають спрацьовувати від випадкового дотику
  function confirmClick(btn, label, action) {
    if (!btn) return;
    const orig = btn.textContent;
    btn.onclick = () => {
      if (!btn.dataset.sure) { btn.dataset.sure = '1'; btn.textContent = label; setTimeout(() => { btn.dataset.sure = ''; btn.textContent = orig; }, 3500); return; }
      action();
    };
  }
  EN.confirmClick = confirmClick;
  function bindLessonControls(l, tab, next) {
    const reload = () => renderLesson(l.id, tab);
    const sk = $('#lc-skip');
    if (sk) sk.onclick = () => { EN.skipLesson(l.id, true); EN.toast('Урок ' + l.num + ' пропущено'); location.hash = next ? '#/lesson/' + next.id : '#/lessons'; };
    const un = $('#lc-unskip');
    if (un) un.onclick = () => { EN.skipLesson(l.id, false); EN.toast('Урок повернуто в план'); reload(); };
    confirmClick($('#lc-from'), '▶ Так, попередні — пропустити', () => { EN.startFrom(l.id); EN.toast('Тепер навчання починається з уроку ' + l.num); reload(); });
    confirmClick($('#lc-reset'), '↺ Точно скинути прогрес уроку?', () => { EN.resetLesson(l.id); EN.toast('Прогрес уроку скинуто. Слова лишаються в повторенні.'); reload(); });
  }

  function renderLesson(id, tab) {
    const l = EN.lessonById(id);
    if (!l) { location.hash = '#/lessons'; return; }
    const st = EN.lessonState(id);
    if (!st.opened) { st.opened = true; EN.save(); }
    tab = tab || 'theory';
    const idx = EN.lessons.indexOf(l);
    const prev = EN.lessons[idx - 1], next = EN.lessons[idx + 1];
    const tabs = [['theory', 'Теорія'], ['words', 'Слова (' + l.vocab.length + ')'], ['ex', 'Вправи (' + l.ex.length + ')'], ['speak', 'Розмова'], ['mission', 'Місія']];
    // На телефоні повна шапка уроку займала б увесь перший екран, і вправа опинялася б під екранною клавіатурою
    const narrow = window.matchMedia && matchMedia('(max-width:700px)').matches;
    view().innerHTML = voiceBanner() + '<div class="card lesson-head tab-' + tab + '"><div class="row small muted"><a href="#/lessons">← Уроки</a><span class="spacer"></span>' + esc(stageOf(l.stage).level) + ' · ' + esc(l.dur) + '</div>' +
      '<h1>' + esc(l.num + ' · ' + l.title) + '</h1><p class="small lesson-goals"><b>Мета:</b> ' + esc(l.goals.join(' · ')) + '</p>' + lessonChecks(l) +
      (narrow ? '<details class="lc-more"><summary class="small muted">⋯ Керування уроком</summary>' + lessonControls(l, idx) + '</details>' : lessonControls(l, idx)) +
      '<div class="subtabs">' + tabs.map((t) => '<button data-tab="' + t[0] + '" class="' + (t[0] === tab ? 'active' : '') + '">' + t[1] + '</button>').join('') + '</div></div>' +
      '<div id="lesson-body"></div>' +
      '<div class="row" style="margin-top:6px">' + (prev ? '<a class="btn" href="#/lesson/' + prev.id + '">← ' + esc(prev.num) + '</a>' : '') + '<span class="spacer"></span>' + (next ? '<a class="btn" href="#/lesson/' + next.id + '">' + esc(next.num) + ' →</a>' : '') + '</div>';
    $$('.subtabs button').forEach((b) => b.onclick = () => { location.hash = '#/lesson/' + id + '/' + b.dataset.tab; });
    bindLessonControls(l, tab, next);
    const body = $('#lesson-body');
    if (tab === 'theory') {
      body.innerHTML = '<div class="card theory">' + EN.rich(l.theory) + '<div class="row" style="margin-top:12px"><span class="spacer"></span><button class="btn primary" id="th-done">' + (st.theory ? '✓ Прочитано' : 'Прочитав(ла) → до слів') + '</button></div></div>';
      $('#th-done').onclick = () => { st.theory = true; EN.save(); location.hash = '#/lesson/' + id + '/words'; };
    } else if (tab === 'words') {
      body.innerHTML = '<div class="card">' + (l.vocab.length ? '<p class="small muted">Ці слова вже додано до «Слів» — вони з\'являтимуться на повторення (до ' + (+EN.S.settings.newPerDay || 0) + ' нових на день). Натисніть слово, щоб почути вимову.</p><div class="tblwrap"><table><tr><th>Англійською</th><th>Українською</th><th>Примітка</th></tr>' +
        l.vocab.map((w) => '<tr><td>' + EN.rich('[[' + w[0] + '|' + EN.sayText(w[0]) + ']]') + '</td><td>' + esc(w[1]) + '</td><td class="small muted">' + esc(w[2] || '') + '</td></tr>').join('') + '</table></div>' : '<p>У цьому уроці немає нових слів — повторіть слова попередніх уроків.</p>') +
        '<div class="row"><a class="btn" href="#/words">🃏 Повторювати слова</a><span class="spacer"></span><a class="btn primary" href="#/lesson/' + id + '/ex">До вправ →</a></div></div>';
    } else if (tab === 'ex') {
      EN.runExercises(body, l.ex, { saveKey: id, onFinish: (score) => {
        st.ex = st.ex || {};
        st.ex.best = Math.max(st.ex.best || 0, score);
        if (score >= 80) st.ex.done = true;
        EN.save();
        const checks = $('.lesson-checks'); if (checks) checks.outerHTML = lessonChecks(l);
      } });
    } else if (tab === 'speak') {
      body.innerHTML = '<div class="card"><h3>🔁 Shadowing: слухайте → повторюйте → записуйте себе</h3>' +
        (l.say.length ? l.say.map((p, k) => '<div class="lesson-item" style="flex-wrap:wrap"><span>' + EN.rich('[[' + p[0] + ']]') + '<br><span class="small muted">' + esc(p[1]) + '</span></span><span class="spacer"></span><button class="btn small" data-slow="' + k + '">🐢</button><span class="rec" data-k="' + k + '"></span></div>').join('') : '<p class="muted">Візьміть фрази з попередніх уроків у вкладці «Розмова».</p>') +
        '<h3 style="margin-top:16px">🗣️ Говоріть уголос</h3><ul>' + l.speak.map((s) => '<li>' + EN.rich(s) + '</li>').join('') + '</ul>' +
        '<div class="row"><span class="rec-free"></span><span class="spacer"></span><button class="btn primary" id="sp-done">' + (st.speak ? '✓ Розмову виконано' : 'Позначити як виконане') + '</button></div></div>';
      $$('.rec', body).forEach((el) => EN.recorderWidget(el));
      EN.recorderWidget($('.rec-free', body));
      $$('[data-slow]', body).forEach((b) => b.onclick = () => EN.TTS.say(l.say[+b.dataset.slow][0], 0.6));
      $('#sp-done').onclick = () => { st.speak = true; EN.save(); EN.logActivity('speak'); renderLesson(id, 'speak'); };
    } else if (tab === 'mission') {
      body.innerHTML = '<div class="card"><h3>🎯 Місія в реальному житті</h3><p style="font-size:1.1rem">' + EN.rich(l.mission) + '</p>' +
        '<p class="small muted">Не вийшло з першого разу? Це нормально — спробуйте ще раз наступного тижня. Головне — що ви спробували говорити й писати англійською.</p>' +
        '<div class="row"><span class="spacer"></span><button class="btn primary" id="ms-done">' + (st.mission ? '✓ Місію виконано' : 'Я це зробив(ла)!') + '</button></div></div>';
      $('#ms-done').onclick = () => { st.mission = true; EN.save(); EN.toast('Great job! 🎉'); renderLesson(id, 'mission'); };
    }
  }

  EN.views = { NAV, renderToday, renderProgram, renderLessons, renderLesson, voiceBanner };
})(window.EN);

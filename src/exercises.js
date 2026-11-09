/* Рушій вправ: c — вибір (перший варіант правильний), i — введення, o — порядок слів, l — диктант, g — генерована (gen.js) */
(function (EN) {
  'use strict';
  const esc = EN.esc;
  const shown = (a) => (Array.isArray(a) ? a[0] : a);

  /**
   * specs — вправи; opts.onFinish(score%), opts.drill (без «урок зараховано»),
   * opts.saveKey — id уроку: тоді незавершений підхід зберігається в стані уроку (run) і його можна продовжити пізніше.
   * run = { n: кількість вправ, q: [[індекс, повтор?], …], pos, ft: {індекс: правильно з першої спроби?}, sk: {індекс: пропущено} }
   */
  EN.runExercises = function (root, specs, opts) {
    opts = opts || {};
    const lst = opts.saveKey ? EN.lessonState(opts.saveKey) : null;
    const last = {}; // останній показаний варіант кожної вправи: генеровані щоразу нові, а підсумок має показати саме той
    const make = (i) => (last[i] = Object.assign(specs[i].t === 'g' ? EN.gen.make(specs[i]) : Object.assign({}, specs[i]), { _i: i }));
    const fresh = () => ({ n: specs.length, q: EN.shuffle(specs.map((_, i) => [i, 0])), pos: 0, ft: {}, sk: {} });
    const save = () => { if (lst) { lst.run = run; EN.save(); } };
    const clear = () => { if (lst) { delete lst.run; EN.save(); } };
    let run;

    const saved = lst && lst.run && lst.run.n === specs.length && Array.isArray(lst.run.q) && (lst.run.pos > 0 || Object.keys(lst.run.ft || {}).length) && lst.run.pos < lst.run.q.length ? lst.run : null;
    if (saved && !opts.forceNew) {
      const answered = Object.keys(saved.ft).length;
      root.innerHTML = '<div class="ex-box card center"><h3>⏸ Незавершений підхід</h3><p>Ви вже виконали <b>' + answered + ' з ' + specs.length + '</b> завдань цього уроку.</p>' +
        '<div class="row" style="justify-content:center"><button class="btn primary cont">▶ Продовжити</button><button class="btn restart">↺ Почати заново</button></div></div>';
      root.querySelector('.cont').onclick = () => { run = saved; next(); };
      root.querySelector('.restart').onclick = () => { run = fresh(); save(); next(); };
      return;
    }
    run = fresh();
    if (lst) delete lst.run;

    function finish() {
      const total = specs.length;
      const ok = Object.values(run.ft).filter(Boolean).length;
      const skipped = Object.keys(run.sk).length;
      const score = total ? Math.round((ok / total) * 100) : 0;
      const wrong = Object.keys(run.ft).filter((i) => run.ft[i] === false).map((i) => last[i] || make(+i));
      clear();
      root.innerHTML = '<div class="ex-box card center">' +
        '<h2>' + (score >= 80 ? '🎉 Чудово!' : score >= 60 ? '👍 Непогано!' : '💪 Варто повторити') + '</h2>' +
        '<div class="stat">' + score + '%</div><p class="muted">правильно з першої спроби: ' + ok + ' з ' + total + (skipped ? ' · пропущено: ' + skipped : '') + '</p>' +
        (opts.drill ? '' : score >= 80 ? '<p class="good">Урок зараховано (потрібно ≥ 80%).</p>' : '<p class="note">Для зарахування потрібно ≥ 80%. Перечитайте теорію і спробуйте ще раз — це нормально. Якщо тему ви вже знаєте, урок можна пропустити кнопкою вгорі.</p>') +
        (wrong.length ? '<div class="small" style="text-align:left"><b>Де були помилки або пропуски:</b><ul>' + wrong.map((w) => '<li>' + esc(stripTags(w.q || w.h || 'Диктант')) + ' → <b>' + esc(answerText(w)) + '</b></li>').join('') + '</ul></div>' : '') +
        '<div class="row" style="justify-content:center;margin-top:10px"><button class="btn primary again">Ще раз</button></div></div>';
      root.querySelector('.again').onclick = () => EN.runExercises(root, specs, Object.assign({}, opts, { forceNew: true }));
      if (opts.onFinish) opts.onFinish(score);
    }
    function stripTags(s) { return String(s).replace(/<[^>]+>/g, '').replace(/\[\[([^\]|]*)(?:\|[^\]]*)?\]\]/g, '$1'); }
    function answerText(it) { return it.t === 'c' ? (it.o[it.a || 0]) : shown(it.a); }

    function next() {
      if (run.pos >= run.q.length) return finish();
      const [i, retry] = run.q[run.pos];
      render(make(i), retry);
    }
    // skip — учень пропустив завдання: воно не повертається в кінець черги, бо відповідь він уже бачив
    function record(it, ok, skip) {
      if (!(it._i in run.ft)) run.ft[it._i] = ok;
      if (skip) run.sk[it._i] = 1;
      else if (!ok && !run.q[run.pos][1]) run.q.push([it._i, 1]);
      EN.logActivity('ex');
      save();
    }

    function render(it, retry) {
      EN._exCurrent = it; // для самоперевірки (tools/selftest-console.js)
      const progress = Math.round((run.pos / run.q.length) * 100);
      root.innerHTML = '<div class="ex-box card">' +
        '<div class="row small muted"><span>Завдання ' + (run.pos + 1) + ' з ' + run.q.length + (retry ? ' · повтор' : '') + '</span><span class="spacer"></span>' +
        (lst ? '<button class="btn small restart" title="Почати підхід заново">↺</button>' : '') + '<span class="pill gray">' + typeName(it.t) + '</span></div>' +
        '<div class="bar" style="margin:8px 0 12px"><i style="width:' + progress + '%"></i></div>' +
        '<div class="ex-body"></div><div class="fb"></div>' +
        '<div class="row" style="margin-top:12px"><button class="btn skip" title="Показати відповідь і перейти далі">Пропустити ⏭</button><span class="spacer"></span><button class="btn primary act">Перевірити</button></div>' +
        (lst ? '<p class="small muted" style="margin:8px 0 0">Прогрес підходу зберігається автоматично — можна закрити й продовжити пізніше.</p>' : '') + '</div>';
      const body = root.querySelector('.ex-body');
      const fb = root.querySelector('.fb');
      const act = root.querySelector('.act');
      const skipBtn = root.querySelector('.skip');
      let checked = false;
      const goNext = () => { run.pos++; save(); next(); };
      const showFb = (state, extra) => {
        const msg = state === 'ok' ? '✅ Правильно!' : state === 'near' ? '🟡 Майже — перевірте написання.' : state === 'skip' ? '⏭ Пропущено.' : '❌ Ні.';
        fb.innerHTML = '<div class="feedback ' + (state === 'skip' ? 'near' : state) + '">' + msg +
          (state !== 'ok' ? ' Правильно: <b>' + esc(answerText(it)) + '</b>' : '') +
          (it.e ? '<div class="small" style="margin-top:4px">' + EN.rich(it.e) + '</div>' : '') + (extra || '') + '</div>';
        act.textContent = 'Далі →'; act.style.display = ''; checked = true; skipBtn.style.display = 'none';
        act.onclick = goNext; act.focus();
      };
      const r = root.querySelector('.restart');
      if (r) r.onclick = () => {
        if (!r.dataset.sure) { r.dataset.sure = '1'; r.textContent = '↺ Точно почати заново?'; setTimeout(() => { r.dataset.sure = ''; r.textContent = '↺'; }, 3000); return; }
        run = fresh(); save(); next();
      };
      skipBtn.onclick = () => {
        if (checked) return;
        if (it.t === 'c') body.querySelectorAll('.opt').forEach((x) => { x.disabled = true; if (x.dataset.v === it.o[it.a || 0]) x.classList.add('ok'); });
        const inp = body.querySelector('.ans'); if (inp) inp.readOnly = true;
        record(it, false, true); showFb('skip');
      };

      if (it.t === 'c') {
        const correct = it.o[it.a || 0];
        body.innerHTML = '<div class="ex-q">' + EN.rich(it.q) + '</div><div class="opts">' +
          EN.shuffle(it.o).map((o) => '<button class="opt" data-v="' + esc(o) + '">' + esc(o) + '</button>').join('') + '</div>';
        act.style.display = 'none';
        body.querySelectorAll('.opt').forEach((b) => b.onclick = () => {
          if (checked) return;
          const ok = b.dataset.v === correct;
          body.querySelectorAll('.opt').forEach((x) => { x.disabled = true; if (x.dataset.v === correct) x.classList.add('ok'); });
          if (!ok) b.classList.add('bad');
          record(it, ok); showFb(ok ? 'ok' : 'bad');
        });
      } else if (it.t === 'i' || it.t === 'l') {
        body.innerHTML = it.t === 'l'
          ? '<div class="ex-q">🎧 ' + esc(it.h || 'Прослухайте й напишіть англійською') + (it.q ? ': <span class="muted">' + esc(it.q) + '</span>' : '') + '</div>' +
            '<div class="row" style="margin-bottom:10px"><button class="btn play">🔊 Ще раз</button><button class="btn slow">🐢 Повільно</button><button class="btn small reveal">Не чути? Показати текст</button></div>'
          : '<div class="ex-q">' + EN.rich(it.q) + '</div>';
        // spellcheck вимкнено, бо підкреслення браузера підказувало б, де помилка; autocorrect — щоб телефон не «виправляв» відповідь
        body.insertAdjacentHTML('beforeend', '<input type="text" class="ans" lang="en" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="done"' +
          (it.nodia ? ' inputmode="decimal"' : '') + ' placeholder="' + esc(it.ph || 'Ваша відповідь') + '">');
        const inp = body.querySelector('.ans');
        if (it.t === 'l') {
          const txt = it.say || shown(it.a);
          body.querySelector('.play').onclick = () => EN.TTS.say(txt);
          body.querySelector('.slow').onclick = () => EN.TTS.say(txt, 0.6);
          body.querySelector('.reveal').onclick = (e) => { e.target.outerHTML = '<span class="small muted">Текст: ' + esc(txt) + '</span>'; };
          setTimeout(() => EN.TTS.say(txt), 250);
        }
        // На телефоні автофокус відкриває екранну клавіатуру, і та закриває питання та кнопки 🔊 диктанту
        if (!EN.touch()) setTimeout(() => inp.focus(), 50);
        act.onclick = () => {
          if (checked) return;
          const st = it.check ? it.check(inp.value) : EN.check(inp.value, it.a, it.exact);
          const ok = st === 'ok' || (st === 'near' && !EN.S.settings.strict);
          inp.classList.add(ok ? 'ok' : 'bad'); inp.readOnly = true;
          record(it, ok); showFb(st, it.t === 'l' && it.tr ? '<div class="small">Переклад: ' + esc(it.tr) + '</div>' : '');
        };
        inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); act.click(); } });
      } else if (it.t === 'o') {
        const target = shown(it.a);
        const pool = target.split(' ');
        let order = EN.shuffle(pool);
        for (let k = 0; k < 5 && pool.length > 2 && order.join(' ') === target; k++) order = EN.shuffle(pool);
        const chosen = [];
        body.innerHTML = '<div class="ex-q">Складіть речення: <b>' + esc(it.q) + '</b></div>' +
          '<div class="tokens ans-area" title="Натисніть слово, щоб повернути"></div><div class="tokens pool" style="border-style:solid"></div>';
        const area = body.querySelector('.ans-area'), poolEl = body.querySelector('.pool');
        const draw = () => {
          area.innerHTML = chosen.map((w, k) => '<button class="tok" data-k="' + k + '">' + esc(w) + '</button>').join('') || '<span class="muted small">Натискайте слова внизу…</span>';
          poolEl.innerHTML = order.map((w, k) => '<button class="tok" data-k="' + k + '">' + esc(w) + '</button>').join('');
        };
        draw();
        area.onclick = (e) => { const b = e.target.closest('.tok'); if (!b || checked) return; order.push(chosen.splice(+b.dataset.k, 1)[0]); draw(); };
        poolEl.onclick = (e) => { const b = e.target.closest('.tok'); if (!b || checked) return; chosen.push(order.splice(+b.dataset.k, 1)[0]); draw(); };
        act.onclick = () => {
          if (checked) return;
          if (order.length) { EN.toast('Використайте всі слова'); return; }
          // Порядок слів перевіряється точно: описка тут неможлива, а «майже» означало б неправильний порядок
          const ok = EN.check(chosen.join(' '), it.a, true) === 'ok';
          record(it, ok); showFb(ok ? 'ok' : 'bad', '<div class="row" style="margin-top:6px"><button class="btn small" onclick="EN.TTS.say(' + esc(JSON.stringify(target)) + ')">🔊 Послухати</button></div>');
        };
      }
    }
    function typeName(t) { return { c: 'вибір', i: 'напишіть', o: 'порядок слів', l: 'диктант' }[t] || t; }

    next();
  };
})(window.EN);

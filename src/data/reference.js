/* Довідник: вимова (IPA), неправильні дієслова, часи, артиклі, прийменники, модальні, умовні речення, фразові дієслова,
   фальшиві друзі, US vs UK, числа. Пошук у довіднику ховає рядки таблиць, які не збігаються, тому зміст — переважно в таблицях.
   Таблиці пишуться текстом: рядок тексту = рядок таблиці, клітинки розділені « | » (з пробілами з обох боків). */
window.EN = window.EN || {};
(function (EN) {
  // Короткі рядки доповнюються порожніми клітинками, щоб таблиця не «з'їжджала»
  const tbl = (head, rows) => '<div class="tblwrap"><table><tr>' + head.map((h) => '<th>' + h + '</th>').join('') + '</tr>' +
    rows.map((r) => '<tr>' + r.concat(Array(Math.max(0, head.length - r.length)).fill('')).map((c) => '<td>' + c + '</td>').join('') + '</tr>').join('') + '</table></div>';
  const say = (s) => '[[' + s + ']]';
  const says = (s) => s.split(', ').map(say).join(', ');
  // Роздільник — «|» з пробілом перед ним: «|» усередині [[показати|озвучити]] пробілу перед собою не має
  const rows = (s) => s.trim().split('\n').map((l) => l.trim().split(/ \|(?: |$)/).map((c) => c.trim()));
  // Позначка (UK) / (US) не озвучується: голос прочитав би її як частину слова
  const forms = (s) => s.split(' / ').map((f) => {
    const m = f.match(/^(.+?)( \((?:UK|US)\))?$/);
    return say(m[1]) + (m[2] ? '<span class="muted">' + m[2] + '</span>' : '');
  }).join(' / ');
  const bold1 = (rs) => rs.map((r) => ['<b>' + r[0] + '</b>'].concat(r.slice(1)));

  const SND = ['Звук', 'Приклади', '≈ українською', 'Типова помилка'];
  const vShort = rows(`
    /ɪ/ | [[sit]], [[ship]], [[live]], [[big]] | ≈ коротке «и», як у «син» | вимовляють «і», і [[ship]] звучить як [[sheep]], [[live]] — як [[leave]]
    /e/ | [[bed]], [[pen]], [[said]], [[many]] | ≈ «е», як у «день» | плутають з /æ/: [[men]] — [[man]], [[bed]] — [[bad]]
    /æ/ | [[cat]], [[bad]], [[man]], [[apple]] | ≈ звук між «е» і «а»: рот широко відкритий, щелепа опущена | кажуть чисте «е», і [[bad]] звучить як [[bed]]
    /ʌ/ | [[cup]], [[bus]], [[love]], [[money]] | ≈ коротке «а» | читають u як «у»: [[bus]] — «бус»; плутають з /æ/: [[cup]] — [[cap]]
    /ɒ/ | [[hot]], [[dog]], [[stop]], [[what]] | ≈ коротке «о» з широко відкритим ротом; в американській — /ɑː/, ≈ «а» | —
    /ʊ/ | [[book]], [[good]], [[put]], [[could]] | ≈ коротке «у», губи розслаблені | подовжують: [[full]] звучить як [[fool]], [[look]] — як [[Luke]]
    /ə/ (шва) | [[about]], [[doctor]], [[banana]], [[today]] | ≈ дуже коротке нечітке «е» чи «а» | вимовляють кожну літеру чітко: [[doctor]] — «доктор» замість /ˈdɒktə/
  `);
  const vLong = rows(`
    /iː/ | [[see]], [[sheep]], [[leave]], [[eat]] | ≈ довге «і» | кажуть коротко, і [[sheep]] звучить як [[ship]]
    /ɑː/ | [[car]], [[father]], [[start]], [[half]] | ≈ довге «а»; в американській після нього звучить r: /kɑːr/ | кажуть коротко, і [[cart]] звучить як [[cut]]
    /ɔː/ | [[door]], [[law]], [[walk]], [[saw]] | ≈ довге «о», губи округлені | вимовляють l у [[walk]], [[talk]]; плутають з /ɜː/: [[walk]] — [[work]]
    /uː/ | [[food]], [[blue]], [[two]], [[school]] | ≈ довге «у» | кажуть коротко, і [[fool]] звучить як [[full]]
    /ɜː/ | [[bird]], [[work]], [[learn]], [[first]] | відповідника немає: щось середнє між «е» і «о», губи не округлені, язик посередині рота; в американській — з r | читають за літерами: «ворк», «бірд», «леарн»; [[work]] звучить як [[walk]]
  `);
  const vDiph = rows(`
    /eɪ/ | [[day]], [[name]], [[great]], [[eight]] | ≈ «ей» | скорочують до «е», і [[late]] звучить як [[let]]
    /aɪ/ | [[my]], [[time]], [[buy]], [[night]] | ≈ «ай» | читають i як «і», і [[like]] звучить як [[lick]]
    /ɔɪ/ | [[boy]], [[coin]], [[noise]], [[enjoy]] | ≈ «ой» | —
    /aʊ/ | [[now]], [[house]], [[out]], [[town]] | ≈ «ау» | читають ow як «оу», і [[now]] звучить як [[know]]
    /əʊ/ (UK), /oʊ/ (US) | [[go]], [[home]], [[phone]], [[know]] | ≈ «оу»; британське починається ближче до «еу» | кажуть чисте «о»: [[won't]] звучить як [[want]], [[coat]] — як [[caught]]
    /ɪə/ | [[here]], [[near]], [[beer]], [[clear]] | ≈ «іе»; в американській — /ɪr/, ≈ «ір» | —
    /eə/ | [[hair]], [[where]], [[care]], [[there]] | ≈ «еа» з довгим відкритим «е»; в американській — /er/ | —
    /ʊə/ | [[tour]], [[pure]], [[cure]] | ≈ «уе»; рідкісний, часто замінюється на /ɔː/: [[sure]] /ʃɔː/ | —
  `);
  const cons = rows(`
    /θ/ | [[think]], [[three]], [[thank you]], [[month]] | відповідника немає: кінчик язика між зубами, глухий видих (≈ «с» з язиком між зубами) | замінюють на «с», «ф» чи «т»: [[think]] звучить як [[sink]], [[three]] — як [[free]] чи [[tree]]
    /ð/ | [[this]], [[the]], [[mother]], [[with]] | те саме, але дзвінко (≈ «з» з язиком між зубами) | замінюють на «з» чи «д»: «зе», «дис»
    /w/ | [[we]], [[what]], [[window]], [[one]] | ≈ коротке «у», губи витягнуті трубочкою (≈ «ў») | кажуть «в»: [[west]] звучить як [[vest]], [[wine]] — як [[vine]]
    /v/ | [[very]], [[have]], [[love]], [[five]] | ≈ «в»: верхні зуби торкаються нижньої губи | плутають з /w/; оглушують у кінці: [[have]] — «хеф»
    /h/ | [[hello]], [[house]], [[who]], [[behind]] | ≈ легкий глухий видих, як коли дихаєте на скло; не українське «г» і не «х» | кажуть дзвінке «г» або хрипке «х»: «хеллоу»
    /ŋ/ | [[sing]], [[long]], [[thinking]], [[morning]] | ≈ «н», вимовлене задньою частиною язика, як у слові «банк» | додають «г» чи «к»: [[sing]] — «сінг»; [[thing]] звучить як [[think]]
    /r/ | [[red]], [[very]], [[sorry]], [[train]] | ≈ «р» без вібрації: кінчик язика загнутий назад і не торкається піднебіння | вимовляють розкотисте українське «р»; у британській вимові r після голосного не звучить: [[car]] /kɑː/
    /l/ | [[light]], [[live]], [[feel]], [[milk]] | ≈ тверде «л»; у кінці складу ще твердіше, «темне» | пом'якшують перед i та e: [[live]] — «лів» з м'яким «ль»
    /p/, /t/, /k/ | [[pen]], [[time]], [[cat]], [[two]] | ≈ «п», «т», «к», але на початку наголошеного складу — з легким придихом | вимовляють без придиху, і [[pin]] звучить як [[bin]]; /t/ і /d/ — кінчиком язика на зуби (треба — на ясна за зубами)
    /tʃ/ | [[chair]], [[much]], [[watch]], [[question]] | ≈ «ч» | —
    /dʒ/ | [[job]], [[age]], [[bridge]], [[German]] | ≈ «дж», злито, одним звуком | —
    /ʃ/ | [[she]], [[shop]], [[nation]], [[sure]] | ≈ «ш», трохи м'якше, губи витягнуті вперед | —
    /ʒ/ | [[usually]], [[television]], [[measure]], [[vision]] | ≈ «ж», трохи м'якше | —
    /j/ | [[yes]], [[you]], [[year]], [[university]] | ≈ «й» | читають u як «у»: [[university]] — «універсіті» замість «юніверсіті»
    /b/, /d/, /g/, /z/, /v/ у кінці слова | [[bed]], [[bag]], [[dog]], [[is]], [[five]] | дзвінкі в кінці не оглушуються — як в українських «дуб», «сад» | оглушують (вплив російської): [[bed]] звучить як [[bet]], [[bag]] — як [[back]], [[dog]] — як [[dock]]
  `);
  const endings = rows(`
    -s, -es | /s/ | після глухих звуків /p t k f θ/ | [[books]], [[cats]], [[works]], [[stops]]
    -s, -es | /z/ | після дзвінких і голосних | [[dogs]], [[plays]], [[lives]], [[calls]], [[goes]]
    -s, -es | /ɪz/ — додатковий склад | після /s z ʃ tʃ dʒ/ | [[buses]], [[watches]], [[pages]], [[washes]], [[boxes]]
    -ed | /t/ | після глухих звуків /p k f s ʃ tʃ θ/ | [[worked]], [[stopped]], [[watched]], [[laughed]], [[missed]]
    -ed | /d/ | після дзвінких і голосних | [[played]], [[lived]], [[called]], [[opened]], [[cleaned]]
    -ed | /ɪd/ — додатковий склад | лише після /t/ і /d/ | [[wanted]], [[needed]], [[started]], [[decided]]
  `);
  const silent = rows(`
    k | на початку слова перед n | [[know]], [[knife]], [[knee]], [[knock]]
    w | перед r; у кількох словах | [[write]], [[wrong]], [[answer]], [[two]], [[who]]
    b | після m; перед t | [[climb]], [[comb]], [[thumb]], [[debt]], [[doubt]]
    l | у walk, talk, half, could… | [[walk]], [[talk]], [[half]], [[could]], [[should]], [[would]], [[calm]]
    t | у listen, castle, Christmas | [[listen]], [[castle]], [[whistle]], [[Christmas]]; в [[often]] t часто не вимовляють
    h | на початку кількох слів | [[hour]], [[honest]], [[honour]]; в американській також [[herb]]
    g | перед n | [[sign]], [[design]], [[foreign]], [[gnome]]
    gh | у середині й у кінці слова | [[night]], [[daughter]], [[eight]], [[through]], [[thought]]; але в [[laugh]], [[enough]], [[cough]] gh = /f/
    p | на початку перед s; у receipt, cupboard | [[psychology]], [[receipt]], [[cupboard]]
    s | у island, aisle | [[island]], [[aisle]]
    c | у sc перед e, i | [[science]], [[scissors]], [[muscle]]
    d | у кількох словах | [[Wednesday]], [[handsome]]; у [[sandwich]] — часто
    n | після m у кінці слова | [[autumn]], [[column]]
    e | у кінці слова: «німа e» робить попередній голосний «довгим» | [[mat]] — [[mate]], [[hop]] — [[hope]], [[bit]] — [[bite]], [[cut]] — [[cute]]
  `);
  const abc = rows(`
    [[A|letter A]] | /eɪ/ | ≈ ей
    [[B|letter B]] | /biː/ | ≈ бі
    [[C|letter C]] | /siː/ | ≈ сі
    [[D|letter D]] | /diː/ | ≈ ді
    [[E|letter E]] | /iː/ | ≈ і
    [[F|letter F]] | /ef/ | ≈ еф
    [[G|letter G]] | /dʒiː/ | ≈ джі
    [[H|letter H]] | /eɪtʃ/ | ≈ ейч
    [[I|letter I]] | /aɪ/ | ≈ ай
    [[J|letter J]] | /dʒeɪ/ | ≈ джей
    [[K|letter K]] | /keɪ/ | ≈ кей
    [[L|letter L]] | /el/ | ≈ ел
    [[M|letter M]] | /em/ | ≈ ем
    [[N|letter N]] | /en/ | ≈ ен
    [[O|letter O]] | /əʊ/ | ≈ оу
    [[P|letter P]] | /piː/ | ≈ пі
    [[Q|letter Q]] | /kjuː/ | ≈ к'ю
    [[R|letter R]] | /ɑː/ (US /ɑːr/) | ≈ а: (US ар)
    [[S|letter S]] | /es/ | ≈ ес
    [[T|letter T]] | /tiː/ | ≈ ті
    [[U|letter U]] | /juː/ | ≈ ю
    [[V|letter V]] | /viː/ | ≈ ві
    [[W|letter W]] | /ˈdʌbljuː/ | ≈ дабл-ю
    [[X|letter X]] | /eks/ | ≈ екс
    [[Y|letter Y]] | /waɪ/ | ≈ уай
    [[Z|letter Z]] | /zed/ (UK), /ziː/ (US) | ≈ зед, зі
  `);
  const stressRules = rows(`
    Більшість двоскладових іменників і прикметників — наголос на першому складі | [[<b>ta</b>ble]], [[<b>wa</b>ter]], [[<b>hap</b>py]], [[<b>mo</b>ney]]
    Більшість двоскладових дієслів — на другому складі | [[be<b>gin</b>]], [[de<b>cide</b>]], [[re<b>lax</b>]], [[for<b>get</b>]]
    Іменник і дієслово з однаковим написанням: іменник — на першому, дієслово — на другому | [[a <b>re</b>cord]] — [[to re<b>cord</b>]], [[a <b>pre</b>sent]] — [[to pre<b>sent</b>]], [[an <b>in</b>crease]] — [[to in<b>crease</b>]], [[an <b>ob</b>ject]] — [[to ob<b>ject</b>]]
    Суфікси -tion, -sion, -ic, -ical, -ity, -ian — наголос на складі перед суфіксом | [[infor<b>ma</b>tion]], [[de<b>ci</b>sion]], [[eco<b>no</b>mic]], [[po<b>li</b>tical]], [[uni<b>ver</b>sity]], [[mu<b>si</b>cian]]
    Складні іменники — зазвичай на першу частину | [[<b>bed</b>room]], [[<b>air</b>port]], [[<b>bus</b> stop]], [[<b>post</b>card]]
    Фразові дієслова — на частку | [[get <b>up</b>]], [[give <b>up</b>]], [[turn <b>off</b>]]
    Числа: -teen — на кінець, -ty — на початок | [[thir<b>teen</b>]] — [[<b>thir</b>ty]], [[fif<b>teen</b>]] — [[<b>fif</b>ty]]
  `);
  const stressWords = rows(`
    [[<b>doc</b>ument]] | /ˈdɒkjumənt/ | докумЕнт
    [[<b>com</b>pany]] | /ˈkʌmpəni/ | компАнія
    [[<b>pro</b>ject]] | /ˈprɒdʒekt/ | проЕкт
    [[<b>pro</b>cess]] | /ˈprəʊses/ | процЕс
    [[re<b>sult</b>]] | /rɪˈzʌlt/ | результАт
    [[<b>pro</b>gramme]] | /ˈprəʊɡræm/ | прогрАма
    [[<b>In</b>ternet]] | /ˈɪntənet/ | інтернЕт
    [[<b>con</b>tent]] | /ˈkɒntent/ | контЕнт
    [[<b>mar</b>keting]] | /ˈmɑːkɪtɪŋ/ | маркЕтинг
    [[<b>co</b>lleague]] | /ˈkɒliːɡ/ | колЕга
    [[<b>ca</b>talogue]] | /ˈkætəlɒɡ/ | каталОг
    [[<b>di</b>alogue]] | /ˈdaɪəlɒɡ/ | діалОг
    [[<b>ca</b>tegory]] | /ˈkætəɡəri/ | категОрія
    [[<b>in</b>dustry]] | /ˈɪndəstri/ | індУстрія
    [[e<b>co</b>nomy]] | /ɪˈkɒnəmi/ | еконОміка
    [[tech<b>no</b>logy]] | /tekˈnɒlədʒi/ | технолОгія
    [[<b>ar</b>chitecture]] | /ˈɑːkɪtektʃə/ | архітектУра
    [[Euro<b>pe</b>an]] | /ˌjʊərəˈpiːən/ | європЕйський
    [[de<b>ve</b>lop]] | /dɪˈveləp/ | читають «девелОп»
    [[<b>com</b>fortable]] | /ˈkʌmftəbl/ | читають усі літери: «комфортЕйбл»
    [[<b>in</b>teresting]] | /ˈɪntrəstɪŋ/ | читають «інтерЕстінг»
    [[<b>ve</b>getable]] | /ˈvedʒtəbl/ | читають «веджетЕйбл»
    [[<b>Wednes</b>day]] | /ˈwenzdeɪ/ | вимовляють d: «веднесдей»
    [[<b>cho</b>colate]] | /ˈtʃɒklət/ | шоколАд
    [[<b>pho</b>tograph]] — [[pho<b>to</b>grapher]] | /ˈfəʊtəɡrɑːf/ — /fəˈtɒɡrəfə/ | наголос переходить
  `);
  const weak = rows(`
    a | /eɪ/ | /ə/ | [[a cup of tea]]
    an | /æn/ | /ən/ | [[an apple]]
    the | /ðiː/ | /ðə/; перед голосним — /ði/ | [[the book]], [[the end]]
    to | /tuː/ | /tə/ | [[I want to go.]]
    and | /ænd/ | /ənd/, /ən/, /n/ | [[fish and chips]], [[you and me]]
    of | /ɒv/ | /əv/ | [[a cup of coffee]]
    for | /fɔː/ | /fə/ | [[This is for you.]]
    from | /frɒm/ | /frəm/ | [[I'm from Ukraine.]]
    at | /æt/ | /ət/ | [[Look at me.]]
    can | /kæn/ | /kən/ | [[I can swim.]] — але в кінці сильна: [[Yes, I can.]] Заперечення [[can't]] завжди сильне: /kɑːnt/ (UK), /kænt/ (US)
    was | /wɒz/ | /wəz/ | [[He was late.]] — але [[Yes, he was.]]
    were | /wɜː/ | /wə/ | [[They were here.]]
    are | /ɑː/ | /ə/ | [[Where are you?]]
    do | /duː/ | /də/ | [[Where do you live?]]
    have | /hæv/ | /həv/, /əv/ | [[What have you done?]] [[I should have called.]]
    some | /sʌm/ | /səm/ | [[Would you like some tea?]]
    them | /ðem/ | /ðəm/ | [[Tell them.]]
    but | /bʌt/ | /bət/ | [[Nice, but expensive.]]
  `).map((r) => [say(r[0])].concat(r.slice(1)));

  // Звучання V1 «lead», «tear» залежить від значення (свинець, сльоза), тож голосу дається «to lead», «to tear»
  const irr = rows(`
    arise | arose | arisen | виникати (про проблему, питання)
    be | was / were | been | бути
    bear | bore | borne | терпіти; нести ([[be born]] — народитися)
    beat | beat | beaten | бити; перемагати
    become | became | become | ставати
    begin | began | begun | починати(ся)
    bend | bent | bent | гнути(ся), нахилятися
    bet | bet | bet | битися об заклад, робити ставку
    bite | bit | bitten | кусати
    bleed | bled | bled | кровоточити
    blow | blew | blown | дути
    break | broke | broken | ламати, розбивати
    bring | brought | brought | приносити, привозити
    broadcast | broadcast | broadcast | транслювати
    build | built | built | будувати
    burn | burnt (UK) / burned | burnt (UK) / burned | горіти; палити
    burst | burst | burst | лопнути, розірватися
    buy | bought | bought | купувати
    catch | caught | caught | ловити; встигнути (на автобус)
    choose | chose | chosen | вибирати
    come | came | come | приходити, приїжджати
    cost | cost | cost | коштувати
    cut | cut | cut | різати
    deal | dealt | dealt | мати справу ([[deal with]]); роздавати (карти)
    dig | dug | dug | копати
    dive | dived / dove (US) | dived | пірнати
    do | did | done | робити
    draw | drew | drawn | малювати; тягнути
    dream | dreamt (UK) / dreamed | dreamt (UK) / dreamed | мріяти; бачити сон
    drink | drank | drunk | пити
    drive | drove | driven | їхати за кермом, керувати автомобілем
    eat | ate | eaten | їсти
    fall | fell | fallen | падати
    feed | fed | fed | годувати
    feel | felt | felt | відчувати; почуватися
    fight | fought | fought | битися, боротися
    find | found | found | знаходити
    flee | fled | fled | тікати, рятуватися втечею
    fly | flew | flown | літати
    forbid | forbade | forbidden | забороняти
    forecast | forecast | forecast | прогнозувати
    forget | forgot | forgotten | забувати
    forgive | forgave | forgiven | пробачати
    freeze | froze | frozen | замерзати; заморожувати
    get | got | got (UK) / gotten (US) | отримувати; ставати; діставатися
    give | gave | given | давати
    go | went | gone | іти, їхати
    grow | grew | grown | рости; вирощувати
    hang | hung | hung | вішати; висіти
    have | had | had | мати
    hear | heard | heard | чути
    hide | hid | hidden | ховати(ся)
    hit | hit | hit | ударяти, влучати
    hold | held | held | тримати; проводити (зустріч)
    hurt | hurt | hurt | завдавати болю; боліти
    keep | kept | kept | тримати, зберігати; продовжувати ([[keep going]])
    know | knew | known | знати
    lay | laid | laid | класти; накривати (на стіл)
    lead|to lead | led | led | вести; очолювати
    learn | learnt (UK) / learned | learnt (UK) / learned | вчити; дізнаватися
    leave | left | left | залишати; виїжджати, іти
    lend | lent | lent | позичати (комусь); «позичити в когось» — правильне [[borrow]]
    let | let | let | дозволяти; пускати
    lie | lay | lain | лежати (⚠️ [[lie, lied, lied]] — брехати)
    light | lit / lighted | lit / lighted | запалювати; освітлювати
    lose | lost | lost | губити; програвати
    make | made | made | робити, виготовляти
    mean | meant | meant | означати; мати на увазі
    meet | met | met | зустрічати(ся); знайомитися
    mistake | mistook | mistaken | помилково прийняти (за когось)
    misunderstand | misunderstood | misunderstood | неправильно зрозуміти
    overcome | overcame | overcome | долати
    pay | paid | paid | платити
    prove | proved | proved / proven | доводити
    put | put | put | класти, ставити
    quit | quit | quit | кидати (роботу, звичку)
    read | read|red | read|red | читати (V2 і V3 звучать /red/)
    ride | rode | ridden | їздити (верхи, на велосипеді)
    ring | rang | rung | дзвонити
    rise | rose | risen | підніматися, зростати; сходити (про сонце)
    run | ran | run | бігти; керувати (бізнесом)
    say | said | said | казати
    see | saw | seen | бачити
    seek | sought | sought | шукати (книжне)
    sell | sold | sold | продавати
    send | sent | sent | надсилати
    set | set | set | ставити, встановлювати; сідати (про сонце)
    shake | shook | shaken | трусити; тиснути (руку)
    shine | shone | shone | світити, сяяти
    shoot | shot | shot | стріляти; знімати (фільм, фото)
    show | showed | shown | показувати
    shut | shut | shut | зачиняти
    sing | sang | sung | співати
    sink | sank | sunk | тонути
    sit | sat | sat | сидіти
    sleep | slept | slept | спати
    slide | slid | slid | ковзати
    smell | smelt (UK) / smelled | smelt (UK) / smelled | пахнути; нюхати
    speak | spoke | spoken | говорити
    spell | spelt (UK) / spelled | spelt (UK) / spelled | писати чи називати по літерах
    spend | spent | spent | витрачати; проводити (час)
    spill | spilt (UK) / spilled | spilt (UK) / spilled | розливати
    split | split | split | розділяти
    spoil | spoilt (UK) / spoiled | spoilt (UK) / spoiled | псувати; балувати
    spread | spread | spread | поширювати(ся); намазувати
    stand | stood | stood | стояти
    steal | stole | stolen | красти
    stick | stuck | stuck | приклеювати; застрягати
    sting | stung | stung | жалити
    strike | struck | struck | ударяти; страйкувати
    swear | swore | sworn | присягатися; лаятися
    sweep | swept | swept | підмітати
    swim | swam | swum | плавати
    swing | swung | swung | гойдати(ся)
    take | took | taken | брати; займати (час)
    teach | taught | taught | навчати
    tear|to tear | tore | torn | рвати (вимова /teə/)
    tell | told | told | розповідати, казати (комусь)
    think | thought | thought | думати
    throw | threw | thrown | кидати
    understand | understood | understood | розуміти
    upset | upset | upset | засмучувати
    wake | woke | woken | прокидатися; будити
    wear | wore | worn | носити (одяг)
    win | won | won | вигравати, перемагати
    withdraw | withdrew | withdrawn | знімати (гроші з рахунку); відкликати
    write | wrote | written | писати
  `).map((r) => [forms(r[0]), forms(r[1]), forms(r[2]), r[3]]);

  const tenses = rows(`
    Present Simple | V1 (he / she / it: V1 + -s)<br>не: don't / doesn't + V1<br>питання: Do / Does … V1? | звички й регулярні дії; факти; розклади; стани (know, like, want) | [[I work in an office.]] [[She doesn't eat meat.]] [[Does he speak English?]] | always, usually, often, sometimes, never, every day, on Mondays
    Present Continuous | am / is / are + V-ing | дія відбувається зараз; тимчасова ситуація; домовленість на майбутнє | [[I'm reading now.]] [[She's living with her parents this month.]] [[We're meeting tomorrow.]] | now, right now, at the moment, today, this week, currently
    Present Perfect | have / has + V3 | результат є зараз; досвід за життя; дія за період, що ще не скінчився; стан «з… і досі» | [[I've lost my keys.]] [[Have you ever been to London?]] [[I've known him for years.]] | ever, never, already, yet, just, so far, recently, for, since
    Present Perfect Continuous | have / has been + V-ing | процес почався в минулому й триває досі (скільки часу); видно наслідки процесу | [[I've been waiting for an hour.]] [[You look tired. Have you been working?]] | for, since, how long, all day, lately
    Past Simple | V2 (правильні: V1 + -ed)<br>не: didn't + V1<br>питання: Did … V1? | завершена дія в минулому з відомим часом; послідовність дій | [[I called him yesterday.]] [[We didn't go out.]] [[Did you see it?]] | yesterday, ago, last week, in 2020, when I was a child
    Past Continuous | was / were + V-ing | процес у певний момент минулого; тло, яке перервала інша дія | [[At eight I was having dinner.]] [[I was cooking when you called.]] | at that moment, while, when, all evening
    Past Perfect | had + V3 | дія відбулася раніше за іншу минулу дію («передминулий») | [[When I arrived, the train had left.]] | before, after, already, by the time, by then
    Past Perfect Continuous | had been + V-ing | тривалий процес до певного моменту в минулому | [[She was tired because she had been working all day.]] | for, since, all day, how long
    Future Simple | will + V1<br>не: won't + V1<br>питання: Will … V1? | рішення в момент мовлення; прогноз-думка; обіцянка, пропозиція | [[I'll call you later.]] [[I think it will rain.]] [[I won't tell anyone.]] | tomorrow, next week, soon, I think, probably
    Future Continuous | will be + V-ing | процес у певний момент у майбутньому | [[This time tomorrow I'll be flying to Rome.]] | this time tomorrow, at eight tomorrow
    Future Perfect | will have + V3 | дія завершиться до певного моменту в майбутньому | [[I'll have finished the report by Friday.]] | by Friday, by then, by the end of the year
    Future Perfect Continuous | will have been + V-ing | скільки часу триватиме дія на певний момент у майбутньому | [[By June I'll have been working here for five years.]] | by June, for five years
  `).map((r) => ['<b>' + r[0] + '</b>', r[1], r[2], r[3], says(r[4])]);
  const future = rows(`
    will | рішення щойно; прогноз-думка; обіцянка | [[I'll have the soup, please.]] [[I think she'll win.]]
    be going to | план, намір (вирішили раніше); прогноз за видимими ознаками | [[I'm going to learn Spanish.]] [[Look at those clouds! It's going to rain.]]
    Present Continuous | домовленість: є час, місце, інші люди | [[I'm meeting Anna at six.]]
    Present Simple | розклад, програма | [[The film starts at eight.]] [[Our flight leaves on Monday.]]
    Present Simple після when, if, as soon as, until, before, after | у підрядному реченні — теперішній час замість майбутнього | [[I'll call you when I get home.]] [[If it rains, we'll stay in.]]
  `);
  const choose = rows(`
    Я живу тут п'ять років. | [[I've lived here for five years.]] [[I've been living here for five years.]] | дія триває досі → Present Perfect (Continuous), не Present Simple
    Я знаю його з дитинства. | [[I've known him since childhood.]] | know, like, want, own — без -ing навіть про «досі»
    Я вже поїв. | [[I've already eaten.]] (US також [[I already ate.]]) | важливий результат зараз, час не названо
    Я бачив цей фільм. | [[I've seen this film.]] | досвід, без дати
    Я бачив його вчора. | [[I saw him yesterday.]] | названо минулий час (yesterday, ago, last…) → Past Simple; Present Perfect з ними не вживається
    Коли ти приїхав? | [[When did you arrive?]] | питання when → Past Simple
    Я працюю в банку. / Я працюю (саме зараз). | [[I work at a bank.]] / [[I'm working.]] | постійне → Simple; у цю хвилину → Continuous
    Я думаю, що так. / Я думаю про це. | [[I think so.]] / [[I'm thinking about it.]] | think «вважаю» — без -ing; «обмірковую» — з -ing
    Завтра йду до лікаря. | [[I'm seeing the doctor tomorrow.]] | домовленість → Present Continuous
    Добре, я зачиню вікно. | [[OK, I'll close the window.]] | рішення щойно → will
    Подзвони, коли приїдеш. | [[Call me when you arrive.]] | після when / if / as soon as — теперішній час
    Він сказав, що втомився. | [[He said he was tired.]] | після said час зсувається в минуле (узгодження часів)
    Скільки ти вже чекаєш? | [[How long have you been waiting?]] | «скільки часу досі» → Present Perfect Continuous
  `);
  const passive = rows(`
    Present Simple | am / is / are + V3 | [[The office is cleaned every day.]]
    Present Continuous | am / is / are being + V3 | [[The road is being repaired.]]
    Present Perfect | have / has been + V3 | [[The report has been sent.]]
    Past Simple | was / were + V3 | [[The house was built in 1990.]]
    Past Continuous | was / were being + V3 | [[The car was being washed.]]
    Past Perfect | had been + V3 | [[All the tickets had been sold.]]
    Future Simple | will be + V3 | [[The results will be announced tomorrow.]]
    Future Perfect | will have been + V3 | [[The work will have been finished by Monday.]]
    be going to | am / is / are going to be + V3 | [[The meeting is going to be postponed.]]
    модальні дієслова | can / must / should … + be + V3 | [[It must be done today.]] [[It can be fixed.]]
  `);

  const art = rows(`
    a / an | один з багатьох; згадуємо вперше | [[I bought a car.]] [[There's a cat in the garden.]]
    a / an | професія; «хто це, що це» | [[She's a doctor.]] [[It's a good idea.]]
    a / an | «один»; «на» (частота, ціна, швидкість) | [[a hundred]], [[once a week]], [[twice a day]], [[£5 an hour|five pounds an hour]], [[60 kilometres an hour|sixty kilometres an hour]]
    a / an | у виразах з what, such, quite | [[What a nice day!]] [[It's such a good film.]] [[quite a long time]]
    an | перед голосним <b>звуком</b>, а не літерою | [[an apple]], [[an hour]], [[an honest man]], [[an MBA]], [[an SMS]]
    a | перед приголосним звуком, навіть якщо перша літера голосна | [[a university]], [[a European country]], [[a one-way ticket]], [[a uniform]]
    the | вже згадане або відоме обом | [[I bought a car. The car is red.]] [[Close the door, please.]]
    the | єдине у своєму роді | [[the sun]], [[the moon]], [[the world]], [[the Internet]], [[the government]]
    the | найвищий ступінь; порядкові; same, only, last, next | [[the best]], [[the first time]], [[the same]], [[the only way]], [[the last train]]
    the | музичні інструменти (а спорт та ігри — без артикля) | [[play the piano]], [[play the guitar]] — [[play football]], [[play chess]]
    the | прикметник = група людей; національності | [[the rich]], [[the elderly]], [[the unemployed]], [[the British]], [[the French]]
    the | прізвище в множині = родина | [[the Smiths]]
    the | газети, готелі, кінотеатри, музеї | [[the Guardian]], [[the Hilton]], [[the British Museum]]
    — (нульовий) | множина й незлічувані іменники в загальному значенні | [[I like dogs.]] [[Money isn't everything.]] [[Life is short.]] [[Coffee is expensive.]]
    — (нульовий) | імена; більшість країн, міст, вулиць, континентів | [[Olena]], [[Ukraine]], [[Kyiv]], [[Oxford Street]], [[Europe]]
    — (нульовий) | мови, шкільні предмети, спорт | [[I speak English.]] [[She studies maths.]] [[play tennis]]
    — (нульовий) | прийоми їжі | [[have breakfast]], [[after lunch]], [[What's for dinner?]] — але [[a great dinner]], [[The lunch was delicious.]]
    — (нульовий) | дні, місяці, свята; next / last + час | [[on Monday]], [[in May]], [[at Christmas]], [[next week]], [[last year]]
  `);
  const geo = rows(`
    річки, моря, океани, канали | the | [[the Dnipro]], [[the Danube]], [[the Thames]], [[the Black Sea]], [[the Atlantic Ocean]]
    гірські хребти, групи островів, пустелі | the | [[the Alps]], [[the Carpathians]], [[the Canary Islands]], [[the Sahara]]
    країни з Republic, Kingdom, States; назви в множині | the | [[the USA]], [[the UK]], [[the Czech Republic]], [[the Netherlands]], [[the Philippines]]
    регіони, сторони світу | the | [[the north of England]], [[the Middle East]], [[the west]]
    більшість країн, міст, континентів, штатів | — | [[Ukraine]], [[Slovakia]], [[France]], [[London]], [[Asia]], [[Texas]]
    окремі гори, озера, острови | — | [[Mount Everest]], [[Lake Geneva]], [[Sicily]]
    вулиці, площі, парки | — | [[Oxford Street]], [[Times Square]], [[Hyde Park]]
    аеропорти, вокзали, університети з назвою міста | — | [[Heathrow Airport]], [[Victoria Station]], [[Oxford University]] (але [[the University of Oxford]])
  `);
  const fixed = rows(`
    [[go to school]], [[go to university]] (UK), [[go to church]], [[go to prison]] | за призначенням: вчитися, молитися, відбувати покарання. Але [[I went to the school to see the teacher.]] — до будівлі
    [[go to bed]], [[be in bed]] | спати; але [[sit on the bed]] — на меблі
    [[be in hospital]] (UK), [[be in the hospital]] (US) | лікуватися; [[visit him at the hospital]] — відвідати
    [[at home]], [[go home]], [[at work]], [[go to work]] | home — без the і без to
    [[by bus]], [[by car]], [[by train]], [[by plane]], [[on foot]] | спосіб пересування; але [[on the bus]], [[in my car]]
    [[at night]], [[at noon]], [[at midnight]] | але [[in the morning]], [[in the afternoon]], [[in the evening]]
    [[watch TV]], [[on TV]] | але [[listen to the radio]], [[go to the cinema]] (UK), [[go to the movies]] (US)
    [[on time]], [[in time]], [[at first]], [[at last]], [[in fact]], [[by mistake]], [[in public]], [[on holiday]] (UK) | без артикля
    [[at the moment]], [[in the end]], [[on the other hand]], [[all the time]], [[the other day]] | з the
    [[a lot of]], [[a few]], [[a little]], [[a bit]], [[in a hurry]], [[have a look]], [[have a good time]], [[as a rule]] | з a
  `);
  const plurals = rows(`
    [[man]], [[woman]] | [[men]], [[women]] | women вимовляють /ˈwɪmɪn/
    [[child]] | [[children]] |
    [[person]] | [[people]] | [[persons]] — лише в офіційних текстах
    [[foot]], [[tooth]], [[goose]] | [[feet]], [[teeth]], [[geese]] |
    [[mouse]] | [[mice]] |
    [[sheep]], [[fish]], [[deer]], [[aircraft]], [[series]], [[species]] | без змін | [[one sheep, two sheep]]
    [[knife]], [[wife]], [[life]], [[leaf]], [[half]], [[shelf]], [[wolf]], [[thief]] | [[knives]], [[wives]], [[lives]], [[leaves]], [[halves]], [[shelves]], [[wolves]], [[thieves]] | -f / -fe → -ves; але [[roofs]], [[chefs]], [[beliefs]]
    [[potato]], [[tomato]], [[hero]] | [[potatoes]], [[tomatoes]], [[heroes]] | -o → -oes; але [[photos]], [[pianos]], [[radios]], [[videos]]
    [[analysis]], [[crisis]], [[criterion]], [[phenomenon]] | [[analyses]], [[crises]], [[criteria]], [[phenomena]] | латинські й грецькі слова
    лише множина | [[trousers]], [[jeans]], [[scissors]], [[glasses]] (окуляри), [[pyjamas]], [[clothes]], [[stairs]], [[goods]] | [[a pair of jeans]]; [[My glasses are new.]]
    [[police]], [[people]] | дієслово в множині | [[The police are here.]] [[People are friendly.]]
    [[news]], [[maths]], [[physics]], [[economics]] | дієслово в однині | [[The news is good.]] [[Maths is my favourite subject.]]
  `);
  const uncount = rows(`
    [[advice]] — порада, поради | [[a piece of advice]], [[some advice]], [[a tip]] | ✗ an advice, ✗ advices
    [[information]] — інформація | [[a piece of information]], [[some information]] | ✗ informations
    [[news]] — новини, новина | [[a piece of news]], [[The news is good.]] | ✗ The news are…
    [[furniture]] — меблі | [[a piece of furniture]], [[a chair]] | ✗ furnitures
    [[luggage]], [[baggage]] — багаж | [[a piece of luggage]], [[a suitcase]], [[two bags]] | ✗ luggages
    [[equipment]] — обладнання | [[a piece of equipment]] | ✗ equipments
    [[money]] — гроші | [[some money]], [[How much money?]], [[Money is important.]] | ✗ How many money; дієслово в однині
    [[work]] — робота, праця | [[a lot of work]]; посада — [[a job]] | ✗ I have a new work; [[a work of art]] — твір мистецтва
    [[homework]], [[housework]] — домашнє завдання, хатня робота | [[a lot of homework]], [[an exercise]] | ✗ homeworks
    [[progress]] — прогрес, успіхи | [[We've made a lot of progress.]] | ✗ a progress
    [[research]] — дослідження | [[some research]], [[a study]] | ✗ researches (у побуті)
    [[traffic]] — рух транспорту | [[heavy traffic]], [[a traffic jam]] | ✗ traffics
    [[weather]] — погода | [[What lovely weather!]] | ✗ What a lovely weather!
    [[accommodation]] — житло | [[some accommodation]] (UK); у US часто [[accommodations]] |
    [[bread]] — хліб | [[a loaf of bread]], [[a slice of bread]] | ✗ a bread, ✗ breads
    [[hair]] — волосся | [[Her hair is long.]]; [[a hair]] — одна волосина | ✗ Her hairs are long.
    [[feedback]] — відгук | [[some feedback]], [[a comment]] | ✗ feedbacks
    [[software]] — програмне забезпечення | [[a piece of software]], [[an app]], [[a program]] | ✗ softwares
    [[evidence]] — докази | [[a piece of evidence]] | ✗ evidences
    [[permission]] — дозвіл | [[ask for permission]]; документ — [[a permit]] | ✗ a permission
    [[fun]] — розвага, задоволення | [[It was great fun.]] | ✗ It was a fun.
    [[paper]] — папір | [[a sheet of paper]]; [[a paper]] — газета, наукова стаття |
    [[experience]] — досвід | [[a lot of experience]]; [[an experience]] — випадок, враження |
    [[time]] — час | [[I don't have time.]]; [[three times]] — тричі |
    [[travel]] — подорожування | [[a trip]], [[a journey]] — одна подорож | ✗ a travel
    [[water]], [[coffee]], [[tea]] | [[a glass of water]], [[a cup of tea]]; у кафе можна [[two coffees, please]] |
  `);
  const quant = rows(`
    багато (у питаннях і запереченнях) | [[many]]: [[How many books?]] | [[much]]: [[How much money?]]
    багато (у ствердженнях) | [[a lot of people]] | [[a lot of time]]
    кілька, трохи | [[a few]]: [[a few friends]] | [[a little]]: [[a little sugar]]
    мало (майже немає) | [[few]]: [[Few people came.]] | [[little]]: [[We have little time.]]
    менше | [[fewer]]: [[fewer cars]] | [[less]]: [[less traffic]]
    якісь, трохи | [[some apples]], [[Any questions?]] | [[some milk]], [[Any news?]]
  `);

  const pTime = rows(`
    at | точний час; ніч, полудень; свята (як період); вихідні (UK) | [[at 7 o'clock]], [[at noon]], [[at night]], [[at Christmas]], [[at the weekend]] (UK), [[at the moment]], [[at the end of May]]
    on | дні тижня, дати, конкретний день | [[on Monday]], [[on 24 August|on the twenty-fourth of August]], [[on my birthday]], [[on Monday morning]], [[on Christmas Day]], [[on the weekend]] (US)
    in | місяці, роки, пори року, століття, частини дня; «через» скільки часу | [[in May]], [[in 2026]], [[in summer]], [[in the 21st century]], [[in the morning]], [[in two weeks]] — через два тижні
    без прийменника | перед this, next, last, every, tomorrow, yesterday, tonight | [[this week]], [[next Monday]], [[last year]], [[every day]], [[tomorrow morning]]
    for | скільки триває | [[for two hours]], [[for ages]]
    since | з якого моменту (з Present Perfect) | [[since 2020]], [[since Monday]], [[since I was a child]]
    during | протягом події (не з числами) | [[during the meeting]], [[during the summer]]
    by | не пізніше ніж (дедлайн) | [[by Friday]], [[by 5 p.m.]]
    until, till | аж до (дія триває до моменту) | [[I work until six.]] [[Wait until Monday.]]
    ago | тому (після проміжку часу) | [[two years ago]], [[a minute ago]]
    from … to | з … до | [[from nine to five]], [[from Monday to Friday]]
  `);
  const pPlace = rows(`
    at | точка; адреса з номером; подія; заклад за призначенням | [[at the bus stop]], [[at the door]], [[at 10 Baker Street]], [[at a party]], [[at work]], [[at school]], [[at the airport]], [[at home]]
    in | всередині; місто, країна; простір з межами | [[in the room]], [[in the car]], [[in a taxi]], [[in Kyiv]], [[in Ukraine]], [[in the park]], [[in bed]], [[in the photo]]
    on | на поверхні; поверх; громадський транспорт; лінія (річка, дорога); медіа | [[on the table]], [[on the wall]], [[on the second floor]], [[on the bus]], [[on the train]], [[on a plane]], [[on the left]], [[on page five]], [[on the Internet]], [[on TV]], [[on the phone]]
    on / in + вулиця | вулиця без номера | [[on Baker Street]] (US; у UK також [[in Baker Street]])
  `);
  const pTraps = rows(`
    на фото, на картинці | [[in the photo]], [[in the picture]]
    на вулиці (надворі) | [[outside]]; на вулиці (на дорозі) — [[in the street]] (UK), [[on the street]] (US)
    на роботі, на зустрічі | [[at work]], [[at a meeting]], [[in a meeting]]
    на першому поверсі | [[on the ground floor]] (UK), [[on the first floor]] (US)
    в автобусі, в потязі | [[on the bus]], [[on the train]] — але [[in the car]], [[in a taxi]]
    в інтернеті, по телевізору, по телефону | [[on the Internet]], [[online]], [[on TV]], [[on the phone]]
    англійською (мовою) | [[in English]]
    перекласти на англійську | [[translate into English]]
    у понеділок, о п'ятій | [[on Monday]], [[at five]]
    через два дні | [[in two days]]
    вдома, додому | [[at home]], [[go home]] (без to)
    приїхати в Лондон, в аеропорт, додому | [[arrive in London]], [[arrive at the airport]], [[arrive home]] (не arrive to)
    у ліжку, у лікарні | [[in bed]], [[in hospital]] (UK), [[in the hospital]] (US)
    на концерті, на вечірці | [[at a concert]], [[at a party]]
    на небі | [[in the sky]]
  `);
  const coll = rows(`
    [[depend on]] | [[It depends on the weather.]] | ✗ depend from
    [[listen to]] | [[I'm listening to music.]] | ✗ listen music
    [[wait for]] | [[Wait for me!]] | ✗ wait me
    [[look at]] | [[Look at this photo.]] | ✗ look on
    [[look for]] | [[I'm looking for my keys.]] | ✗ search my keys (search без for — «обшукувати»)
    [[arrive in]] / [[arrive at]] | [[We arrived in Rome.]] [[We arrived at the hotel.]] | ✗ arrive to
    [[think about]] / [[think of]] | [[What do you think about it?]] [[I'm thinking of moving.]] | ✗ think on
    [[dream of]] / [[dream about]] | [[I dream of a house by the sea.]] |
    [[agree with]] / [[agree to]] / [[agree on]] | [[I agree with you.]] [[They agreed to the plan.]] [[We agreed on a price.]] | ✗ I am agree
    [[belong to]] | [[This bag belongs to me.]] |
    [[pay for]] | [[I'll pay for the coffee.]] | ✗ pay the coffee (але [[pay the bill]])
    [[ask for]] | [[Ask for help.]] | питання — без прийменника: [[ask a question]]
    [[apply for]] | [[I applied for the job.]] |
    [[apologise for]] / [[apologise to]] | [[I apologise for being late.]] [[Apologise to her.]] |
    [[complain about]] | [[He complained about the noise.]] |
    [[consist of]] | [[The team consists of five people.]] | ✗ consist from
    [[congratulate on]] | [[Congratulations on your new job!]] | ✗ congratulate with
    [[laugh at]] | [[Don't laugh at me.]] | ✗ laugh over
    [[explain to]] | [[Can you explain it to me?]] | ✗ explain me
    [[discuss]] — без прийменника | [[Let's discuss the plan.]] | ✗ discuss about
    [[enter]] — без прийменника | [[She entered the room.]] | ✗ enter into the room
    [[marry]] — без прийменника; [[get married to]] | [[She married a doctor.]] [[They got married last year.]] | ✗ marry with
    [[call]], [[phone]] — без прийменника | [[Call me tomorrow.]] | ✗ call to me
    [[answer]] — без прийменника | [[Please answer the question.]] | ✗ answer on the question
    [[reach]] — без прийменника | [[We reached the top.]] | ✗ reach to
    [[tell]] someone; [[say to]] someone | [[She told me the news.]] [[What did she say to you?]] | ✗ she said me
    [[thank for]] | [[Thank you for your help.]] |
    [[talk to]], [[speak to]] | [[I need to talk to you.]] |
    [[take part in]] | [[I took part in the conference.]] | ✗ take part at
    [[translate into]] | [[Translate it into English.]] | ✗ translate on English
    [[believe in]] | [[I believe in you.]] |
    [[borrow from]] / [[lend to]] | [[Can I borrow your pen?]] [[I lent my car to a friend.]] |
    [[remind of]] / [[remind about]] | [[You remind me of my sister.]] [[Remind me about the meeting.]] |
    [[suffer from]] | [[He suffers from headaches.]] |
    [[succeed in]] | [[She succeeded in getting the job.]] |
    [[insist on]] | [[He insisted on paying.]] |
    [[rely on]], [[count on]] | [[You can rely on me.]] |
    [[worry about]] | [[Don't worry about it.]] |
    [[prepare for]] | [[I'm preparing for the exam.]] |
    [[divide into]] | [[Divide the class into groups.]] |
    [[interested in]] | [[I'm interested in history.]] | ✗ interested by, ✗ I interest history
    [[good at]], [[bad at]] | [[She's good at maths.]] | ✗ good in
    [[afraid of]] | [[I'm afraid of dogs.]] | ✗ afraid from
    [[married to]] | [[He's married to a Slovak woman.]] | ✗ married with, ✗ married on
    [[responsible for]] | [[Who is responsible for this?]] |
    [[proud of]] | [[I'm proud of you.]] |
    [[tired of]] | [[I'm tired of waiting.]] |
    [[angry with]] / [[angry about]] | [[She's angry with me.]] [[He's angry about the delay.]] | у US також angry at (про людину)
    [[similar to]] | [[Slovak is similar to Ukrainian.]] |
    [[different from]] | [[It's different from what I expected.]] | ✗ different of; у UK також different to, у US — different than
    [[famous for]] | [[Lviv is famous for its coffee.]] |
    [[full of]] | [[The room was full of people.]] |
    [[fond of]], [[keen on]] (UK) | [[I'm fond of jazz.]] [[He's keen on football.]] |
    [[aware of]] | [[Are you aware of the risks?]] |
    [[familiar with]] | [[Are you familiar with Excel?]] |
    [[ready for]] | [[Are you ready for the meeting?]] |
    [[late for]] | [[Don't be late for work.]] |
    [[kind to]], [[nice to]] | [[She was very kind to me.]] |
    [[excited about]] | [[I'm excited about the trip.]] |
    [[satisfied with]] | [[We're satisfied with the results.]] |
    [[busy with]] | [[I'm busy with a project.]] |
    [[sorry about]] / [[sorry for]] | [[I'm sorry about the mess.]] [[I feel sorry for him.]] |
    [[reason for]] | [[the reason for the delay]] |
    [[solution to]] | [[a solution to the problem]] | ✗ solution of
    [[answer to]] | [[the answer to my question]] |
    [[increase in]], [[decrease in]] | [[an increase in prices]] |
    [[problem with]] | [[a problem with my laptop]] |
    [[invitation to]] | [[an invitation to the wedding]] |
    [[advantage of]] | [[the advantages of remote work]] |
  `);

  const modals = rows(`
    can | уміння; можливість; дозвіл і прохання (розмовне) | [[I can swim.]] [[Can I sit here?]] | [[can't]], [[cannot]] — не вміти; не можна | [[could]] — уміння в минулому; [[was able to]] — зумів у конкретній ситуації; майбутнє — [[will be able to]]
    could | уміння в минулому; ввічливе прохання; можливість («може бути») | [[I could read at four.]] [[Could you help me?]] [[It could be true.]] | [[couldn't]] | could have + V3 — міг би, але не зробив: [[You could have told me!]]
    may | дозвіл (офіційно); припущення «можливо» | [[May I come in?]] [[It may rain later.]] | [[may not]] (не скорочується) | may have + V3: [[He may have missed the bus.]]
    might | слабше припущення, «може, й…» | [[I might be late.]] | [[might not]] | might have + V3: [[She might have forgotten.]]
    must | обов'язок «від себе», правило; висновок «мабуть, напевно» | [[I must call Mum.]] [[You must be tired.]] | [[mustn't]] = <b>не можна, заборонено</b> | [[had to]] — обов'язок у минулому; must have + V3 — напевно, було: [[He must have left.]]
    have to | обов'язок через обставини (правила, робота, розклад) | [[I have to work on Saturday.]] | [[don't have to]] = <b>не обов'язково</b> | [[had to]], [[will have to]]; розмовне UK [[I've got to go.]]
    should | порада; «варто», «слід» | [[You should see a doctor.]] | [[shouldn't]] | should have + V3 — варто було: [[I should have listened.]]
    ought to | те саме, що should, трохи офіційніше | [[You ought to apologise.]] | [[ought not to]] | ought to have + V3: [[You ought to have asked.]]
    need | потреба; як модальне — переважно в запереченні (UK) | [[Do I need to bring anything?]] | [[You needn't come.]] (UK) = [[You don't need to come.]] | [[didn't need to]] — не треба було (і не робили); needn't have + V3 — зробили даремно: [[You needn't have bought it.]]
    will | майбутнє; рішення щойно; обіцянка; прохання | [[I'll help you.]] [[Will you open the door?]] | [[won't]] | [[would]] — у непрямій мові: [[He said he would come.]]
    would | умовний спосіб («б»); ввічливість; звичка в минулому | [[I would like a coffee.]] [[Would you mind waiting?]] [[We would play outside every day.]] | [[wouldn't]]; [[He wouldn't listen.]] — ніяк не хотів | would have + V3: [[I would have come.]]
    shall | пропозиція чи питання поради з I, we (переважно UK) | [[Shall I open the window?]] [[Shall we start?]] | [[shan't]] (UK, рідко) | —
    be able to | уміння в будь-якому часі | [[I'll be able to help you tomorrow.]] | [[won't be able to]] | [[was able to]], [[have been able to]]
    be allowed to | дозвіл (від когось) | [[Are we allowed to park here?]] | [[You aren't allowed to smoke here.]] | [[was allowed to]]
    had better | наполеглива порада, застереження | [[You'd better hurry.]] | [[You'd better not be late.]] | —
  `).map((r) => [say(r[0])].concat(r.slice(1)));
  const deduce = rows(`
    впевнений, що так | [[She must be at home.]] | [[She must have been at home.]]
    можливо | [[She may be at home.]] [[She might be at home.]] [[She could be at home.]] | [[She may have been at home.]] [[She might have been at home.]]
    впевнений, що ні | [[She can't be at home.]] | [[She can't have been at home.]] [[She couldn't have been at home.]]
  `);

  const cond = rows(`
    Zero | If + Present Simple, Present Simple | загальні істини, закони, звичні наслідки | [[If you heat ice, it melts.]] | Якщо нагріти лід, він тане.
    First | If + Present Simple, will + V1 | реальна умова в майбутньому | [[If it rains, we'll stay at home.]] | Якщо піде дощ, ми залишимося вдома.
    Second | If + Past Simple, would + V1 | нереальна чи малоймовірна умова тепер або в майбутньому | [[If I had more time, I would learn Japanese.]] [[If I were you, I'd take the job.]] | Якби я мав більше часу, я б вивчав японську. На твоєму місці я б погодився на цю роботу.
    Third | If + Past Perfect, would have + V3 | нереальна умова в минулому — змінити вже нічого не можна | [[If I had left earlier, I wouldn't have missed the train.]] | Якби я вийшов раніше, я б не запізнився на потяг.
    Mixed: минуле → тепер | If + Past Perfect, would + V1 | минула умова — теперішній результат | [[If I had studied medicine, I would be a doctor now.]] | Якби я вивчав медицину, я б зараз був лікарем.
    Mixed: тепер → минуле | If + Past Simple, would have + V3 | постійна ознака — минулий результат | [[If I spoke French, I would have understood him.]] | Якби я знав французьку, я б його тоді зрозумів.
  `);
  const condWords = rows(`
    [[unless]] | якщо не | [[I won't go unless you come with me.]]
    [[as long as]], [[provided]] (that) | за умови, що | [[You can borrow my car as long as you drive carefully.]]
    [[in case]] | на випадок, якщо | [[Take an umbrella in case it rains.]]
    [[otherwise]] | інакше | [[Hurry up, otherwise we'll miss the bus.]]
    [[even if]] | навіть якщо | [[I'll go even if it rains.]]
    Should…, Were…, Had… на початку речення | офіційно, без if | [[Should you have any questions, please contact us.]] [[Had I known, I would have helped.]]
  `);
  const wish = rows(`
    теперішнє: шкода, що зараз не так | wish / if only + Past Simple | [[I wish I had a car.]] [[I wish I knew the answer.]] | Шкода, що в мене немає машини. Якби ж я знав відповідь!
    to be | wish + were (розмовне — was) | [[I wish I were taller.]] [[I wish it was Friday.]] | Хотів би я бути вищим. Шкода, що сьогодні не п'ятниця.
    уміння | wish + could | [[I wish I could swim.]] | Шкода, що я не вмію плавати.
    минуле: шкода, що так сталося | wish / if only + Past Perfect | [[I wish I had studied harder.]] [[If only I hadn't said that!]] | Шкода, що я не вчився старанніше. Краще б я цього не казав!
    роздратування; бажання, щоб інші щось змінили | wish + would | [[I wish you would stop talking.]] [[I wish it would stop raining.]] | Та замовкни вже! Хоч би вже перестав дощ.
    чого хочу від іншої людини | would rather + Past Simple | [[I'd rather you didn't smoke here.]] | Я б волів, щоб ти тут не курив.
    давно пора | it's time + Past Simple | [[It's time we went home.]] | Нам уже пора додому.
  `);

  const phr = rows(`
    get up | вставати (з ліжка) | [[I get up at seven.]] | —
    wake up | прокидатися; будити | [[Wake me up at six.]] | sep.
    turn on / turn off | вмикати / вимикати | [[Turn off the light.]] [[Turn it off.]] | sep.
    switch on / switch off | вмикати / вимикати | [[Switch it on, please.]] | sep.
    turn up / turn down | робити гучніше / тихіше | [[Can you turn the music down?]] | sep.
    turn down | відхиляти (пропозицію) | [[He turned down the offer.]] | sep.
    put on | одягати | [[Put on your coat.]] [[Put it on.]] | sep.
    take off | знімати (одяг); злітати (про літак) | [[Take off your shoes.]] [[The plane took off.]] | sep. / —
    try on | приміряти | [[Can I try it on?]] | sep.
    pick up | піднімати; забирати (когось) | [[I'll pick you up at eight.]] | sep.
    drop off | підвозити й висаджувати | [[Can you drop me off at the station?]] | sep.
    look for | шукати | [[I'm looking for my phone.]] | insep.
    look after | доглядати | [[Who looks after the kids?]] | insep.
    look forward to | з нетерпінням чекати (+ -ing) | [[I look forward to hearing from you.]] | insep.
    look up | шукати (у словнику, в інтернеті) | [[Look it up in a dictionary.]] | sep.
    look into | розглядати, вивчати (проблему) | [[We'll look into it.]] | insep.
    look out | обережно! | [[Look out! A car!]] | —
    find out | дізнаватися | [[I found out the truth.]] | sep.
    figure out | розібратися, зрозуміти | [[I can't figure it out.]] | sep.
    work out | тренуватися; знайти рішення | [[I work out three times a week.]] [[We'll work it out.]] | — / sep.
    give up | кидати (звичку); здаватися | [[I gave up smoking.]] [[Don't give up!]] | sep.
    give back | повертати | [[Give it back!]] | sep.
    give in | поступатися, здаватися | [[In the end he gave in.]] | —
    come back / go back | повертатися (сюди / туди) | [[When are you coming back?]] | —
    come in | заходити | [[Come in, please.]] | —
    go on | продовжувати(ся); відбуватися | [[Go on, I'm listening.]] [[What's going on?]] | —
    go out | виходити (розважитися) | [[Let's go out tonight.]] | —
    go off | спрацювати (будильник); зіпсуватися (їжа, UK) | [[The alarm went off at six.]] | —
    go through | переглядати; пережити | [[Let's go through the plan.]] | insep.
    carry on | продовжувати | [[Carry on working.]] | insep.
    sit down / stand up | сідати / вставати | [[Please sit down.]] | —
    grow up | дорослішати, вирости | [[I grew up in Lviv.]] | —
    set up | засновувати; налаштовувати | [[She set up her own company.]] | sep.
    set off | вирушати | [[We set off at dawn.]] | —
    run out of | закінчитися (про запас) | [[We've run out of milk.]] | insep.
    run into | випадково зустріти | [[I ran into Olena yesterday.]] | insep.
    come across | натрапити | [[I came across an old photo.]] | insep.
    come up with | придумати | [[He came up with a great idea.]] | insep.
    get on / get off | сідати / виходити (автобус, потяг) | [[Get off at the next stop.]] | insep.
    get in / get out of | сідати / виходити (авто, таксі) | [[Get in the car!]] | insep.
    get on with (UK) / get along with | ладнати | [[I get on well with my boss.]] | insep.
    get over | оговтатися | [[She got over the flu.]] | insep.
    get back to | відповісти пізніше | [[I'll get back to you tomorrow.]] | insep.
    fill in (UK) / fill out | заповнювати (бланк) | [[Fill in this form, please.]] | sep.
    call back | передзвонити | [[I'll call you back.]] | sep.
    hang up | покласти слухавку | [[Don't hang up!]] | —
    hold on / hang on | зачекати (розмовне) | [[Hold on a second.]] | —
    put off | відкладати | [[Don't put it off until tomorrow.]] | sep.
    call off | скасовувати | [[They called off the meeting.]] | sep.
    bring up | виховувати; порушувати (тему) | [[She brought up an interesting point.]] | sep.
    point out | вказувати, звертати увагу | [[She pointed out a mistake.]] | sep.
    break down | ламатися (техніка) | [[My car broke down.]] | —
    break up | розійтися (про пару) | [[They broke up last year.]] | —
    deal with | мати справу, розв'язувати | [[I'll deal with it.]] | insep.
    check in / check out | реєструватися / виїжджати (готель, аеропорт) | [[We checked in at the hotel.]] | —
    show up / turn up | з'являтися, приходити | [[He didn't show up.]] | —
    sort out | розібратися, владнати | [[We need to sort this out.]] | sep.
    take up | почати займатися (хобі) | [[I took up yoga.]] | sep.
    take after | бути схожим (на родича) | [[She takes after her mother.]] | insep.
    take over | перебирати (контроль, обов'язки) | [[Who will take over the project?]] | sep.
    catch up with | наздоганяти | [[I'll catch up with you later.]] | insep.
    keep up with | встигати за | [[It's hard to keep up with the news.]] | insep.
    put up with | терпіти | [[I can't put up with this noise.]] | insep.
    cut down on | скорочувати (споживання) | [[I'm cutting down on sugar.]] | insep.
    hand in | здавати (роботу, документи) | [[Hand in your reports by Friday.]] | sep.
    throw away | викидати | [[Don't throw it away.]] | sep.
    clean up | прибирати | [[Clean up your room.]] | sep.
    write down | записувати | [[Write it down.]] | sep.
    let down | підводити | [[Don't let me down.]] | sep.
    make up | вигадувати; миритися | [[He made up an excuse.]] | sep.
    log in / log out | входити / виходити (з акаунта) | [[Log in to your account.]] | —
    back up | робити резервну копію; підтримувати | [[Back up your files.]] | sep.
    follow up on | повертатися до питання, доводити до кінця | [[I'll follow up on this next week.]] | insep.
    move in / move out | в'їжджати / виїжджати (з житла) | [[We moved in last month.]] | —
    calm down | заспокоюватися | [[Calm down!]] | —
    hurry up | поспішати | [[Hurry up, we're late!]] | —
    end up | зрештою опинитися; закінчити тим, що… | [[We ended up staying at home.]] | —
  `).map((r) => [forms(r[0])].concat(r.slice(1)));

  const ff = rows(`
    magazine | журнал | магазин = [[shop]] (UK), [[store]] (US)
    accurate | точний | акуратний = [[neat]], [[tidy]], [[careful]]
    fabric | тканина | фабрика = [[factory]]
    sympathetic | співчутливий; який підтримує | симпатичний = [[nice]], [[attractive]], [[good-looking]]
    sympathy | співчуття | симпатія = [[liking]]; «він мені симпатичний» = [[I like him.]]
    actual | справжній, фактичний ([[actually]] — насправді) | актуальний = [[relevant]], [[topical]], [[up to date]]
    eventually | зрештою, врешті-решт | евентуально (можливо) = [[possibly]]
    decade | десятиліття | декада (десять днів) = [[ten days]]
    list | список | лист = [[letter]]; аркуш = [[sheet]]; листок = [[leaf]]
    cabinet | шафка з дверцятами; кабінет міністрів | кабінет (кімната) = [[office]], [[study]]
    complexion | колір обличчя, стан шкіри | комплекція = [[build]], [[physique]]
    physique | статура | фізика = [[physics]]
    physician | лікар | фізик = [[physicist]]
    prospect | перспектива, імовірність | проспект = [[avenue]]
    replica | точна копія | репліка (у розмові) = [[remark]]; (у п'єсі) = [[line]]
    artist | художник; митець | артист = [[performer]], [[actor]]
    intelligent | розумний | інтелігентний = [[cultured]], [[well-mannered]]
    data | дані | дата = [[date]]
    family | сім'я, родина | «фамілія» (суржик: прізвище) = [[surname]], [[last name]]
    angina | стенокардія | ангіна = [[tonsillitis]]
    ambulance | швидка допомога (автомобіль) | амбулаторія = [[outpatient clinic]]
    aspirant | претендент; той, хто прагне (посади, успіху) | аспірант = [[postgraduate]], [[PhD student]]
    audience | глядачі, слухачі, публіка | аудиторія (приміщення) = [[lecture hall]], [[classroom]]
    baton | диригентська чи естафетна паличка; кийок | батон = [[loaf]]
    biscuit | печиво (UK); у US — м'яка булочка | бісквіт = [[sponge cake]]
    brilliant | блискучий, чудовий; (UK, розмовне) класно! | брильянт = [[diamond]]
    clay | глина | клей = [[glue]]
    compositor | складач (у друкарні) | композитор = [[composer]]
    concourse | вестибюль, зала (вокзалу, аеропорту) | конкурс = [[competition]], [[contest]]
    expertise | знання й досвід, компетентність | експертиза = [[examination]], [[expert assessment]]
    genial | привітний, добродушний | геніальний = [[brilliant]]; геній = [[genius]]
    mark | оцінка (UK); позначка; пляма | марка (поштова) = [[stamp]]; марка (виробник) = [[make]], [[brand]]
    novel | роман | новела = [[short story]], [[novella]]
    pathetic | жалюгідний | патетичний = [[solemn]], [[high-flown]]
    preservative | консервант | презерватив = [[condom]]
    satin | атлас (тканина) | сатин = [[sateen]]
    stool | табурет | рос. «стул» (стілець) = [[chair]]
    velvet | оксамит | вельвет = [[corduroy]]
    carton | картонна коробка; пакет (молока, соку) | картон = [[cardboard]]
    academic | науковець, викладач університету; академічний | академік = [[academician]]
    accord | угода, згода | акорд = [[chord]]
    affair | справа; любовний роман | афера = [[scam]], [[fraud]]
    anecdote | кумедна історія з життя (правдива) | анекдот = [[joke]]
    camera | фотоапарат, відеокамера | камера (у в'язниці) = [[cell]]
    chef | шеф-кухар | шеф (начальник) = [[boss]]
    diversion | об'їзд (UK); відволікання уваги | диверсія = [[sabotage]]
    Dutch | нідерландський, голландський | датський = [[Danish]]
    hymn | церковний гімн | державний гімн = [[national anthem]]
    insult | образа; ображати | інсульт = [[stroke]]
    lunatic | божевільний | лунатик = [[sleepwalker]]
    mayor | мер міста | майор = [[major]]
    paragraph | абзац | параграф (розділ підручника) = [[section]]
    principal | директор (школи); головний | принциповий = [[principled]]
    receipt | чек, квитанція | рецепт (страви) = [[recipe]]; рецепт (лікаря) = [[prescription]]
    resin | смола | резина = [[rubber]]
    revision | повторення перед іспитом (UK); редагування | ревізія = [[audit]], [[inspection]]
    smoking | куріння | смокінг = [[dinner jacket]] (UK), [[tuxedo]] (US)
    technique | прийом, метод, техніка виконання | техніка (обладнання) = [[equipment]], [[machinery]]
    decoration | прикраса | декорації (у театрі) = [[scenery]], [[set]]
    realise | усвідомлювати (US: realize) | реалізувати (план) = [[implement]], [[carry out]]
    gymnasium | спортзал (коротко — [[gym]]) | гімназія = [[grammar school]], [[secondary school]]
    familiar | знайомий, звичний | фамільярний = [[overfamiliar]]
  `).sort((a, b) => a[0].toLowerCase().localeCompare(b[0].toLowerCase())).map((r) => [say(r[0])].concat(r.slice(1)));

  const usukWords = rows(`
    [[flat]] | [[apartment]] | квартира
    [[lift]] | [[elevator]] | ліфт
    [[ground floor]] | [[first floor]] | перший поверх (⚠️ UK [[first floor]] = US [[second floor]])
    [[rubbish]] | [[garbage]], [[trash]] | сміття
    [[bin]] | [[trash can]], [[garbage can]] | смітник, відро для сміття
    [[queue]] | [[line]] | черга: [[queue up]] (UK) — [[stand in line]] (US)
    [[holiday]] | [[vacation]] | відпустка: [[on holiday]] — [[on vacation]]
    [[mobile]], [[mobile phone]] | [[cell phone]], [[cell]] | мобільний телефон
    [[petrol]] | [[gas]], [[gasoline]] | бензин
    [[petrol station]] | [[gas station]] | АЗС
    [[autumn]] | [[fall]] | осінь (autumn уживають і в US)
    [[biscuit]] | [[cookie]] | печиво
    [[chips]] | [[French fries]], [[fries]] | картопля фрі
    [[crisps]] | [[chips]] | чипси
    [[sweets]] | [[candy]] | цукерки
    [[aubergine]] | [[eggplant]] | баклажан
    [[courgette]] | [[zucchini]] | кабачок, цукіні
    [[trousers]] | [[pants]] | штани (⚠️ UK [[pants]] — труси)
    [[jumper]] | [[sweater]] | светр (sweater кажуть і в UK)
    [[trainers]] | [[sneakers]] | кросівки
    [[handbag]] | [[purse]] | жіноча сумочка (⚠️ UK [[purse]] — гаманець)
    [[underground]], [[tube]] | [[subway]] | метро (⚠️ UK [[subway]] — підземний перехід)
    [[motorway]] | [[highway]], [[freeway]] | автомагістраль
    [[car park]] | [[parking lot]] | автостоянка
    [[pavement]] | [[sidewalk]] | тротуар
    [[lorry]] | [[truck]] | вантажівка
    [[return ticket]] | [[round-trip ticket]] | квиток туди й назад
    [[single ticket]] | [[one-way ticket]] | квиток в один бік
    [[timetable]] | [[schedule]] | розклад
    [[bill]] | [[check]] | рахунок у ресторані (⚠️ US [[bill]] — ще й банкнота)
    [[note]], [[banknote]] | [[bill]] | банкнота: [[a ten-pound note]] — [[a ten-dollar bill]]
    [[post]] | [[mail]] | пошта (листи)
    [[postcode]] | [[zip code]] | поштовий індекс
    [[tap]] | [[faucet]] | кран
    [[torch]] | [[flashlight]] | ліхтарик
    [[wardrobe]] | [[closet]] | шафа для одягу
    [[cooker]] | [[stove]] | кухонна плита
    [[film]] | [[movie]] | фільм
    [[cinema]] | [[movie theater]] | кінотеатр
    [[football]] | [[soccer]] | футбол (⚠️ US [[football]] — американський футбол)
    [[CV]] | [[résumé]] | резюме
    [[chemist's]] | [[drugstore]], [[pharmacy]] | аптека
    [[shop]] | [[store]] | магазин
    [[city centre]] | [[downtown]] | центр міста
    [[maths]] | [[math]] | математика
    [[full stop]] | [[period]] | крапка (розділовий знак)
    [[rubber]] | [[eraser]] | гумка для стирання
    [[toilet]], [[loo]] | [[restroom]], [[bathroom]] | туалет (громадський — US [[restroom]])
    [[Mum]] | [[Mom]] | мама
    [[fortnight]] | [[two weeks]] | два тижні
    [[driving licence]] | [[driver's license]] | посвідчення водія
    [[nappy]] | [[diaper]] | підгузок
  `);
  const usukSpell = rows(`
    -our / -or | [[colour]], [[favour]], [[neighbour]], [[honour]] | [[color]], [[favor]], [[neighbor]], [[honor]]
    -re / -er | [[centre]], [[theatre]], [[metre]], [[litre]], [[fibre]] | [[center]], [[theater]], [[meter]], [[liter]], [[fiber]]
    -ise / -ize | [[organise]], [[realise]], [[apologise]] (у UK -ize теж правильно) | [[organize]], [[realize]], [[apologize]]
    -yse / -yze | [[analyse]], [[paralyse]] | [[analyze]], [[paralyze]]
    -ll- / -l- перед закінченням | [[travelled]], [[travelling]], [[cancelled]], [[jeweller]] | [[traveled]], [[traveling]], [[canceled]], [[jeweler]]
    -l / -ll (навпаки!) | [[fulfil]], [[enrol]], [[skilful]], [[instalment]] | [[fulfill]], [[enroll]], [[skillful]], [[installment]]
    -ogue / -og | [[catalogue]], [[dialogue]], [[analogue]] | [[catalog]], [[analog]]; dialogue в US теж поширене
    -ence / -ense | [[defence]], [[offence]], [[licence]] (іменник) | [[defense]], [[offense]], [[license]]
    practise / practice | [[practise]] (дієслово), [[practice]] (іменник) | [[practice]] — і дієслово, й іменник
    -mme / -m | [[programme]] (але комп'ютерна — [[program]]) | [[program]]
    ae, oe / e | [[encyclopaedia]], [[paediatrician]], [[manoeuvre]] | [[encyclopedia]], [[pediatrician]], [[maneuver]]
    окремі слова | [[grey]], [[tyre]], [[cheque]], [[kerb]], [[aluminium]], [[plough]], [[mould]], [[pyjamas]], [[cosy]], [[storey]], [[draught]], [[jewellery]] | [[gray]], [[tire]], [[check]], [[curb]], [[aluminum]], [[plow]], [[mold]], [[pajamas]], [[cozy]], [[story]], [[draft]], [[jewelry]]
  `);
  const usukSound = rows(`
    r після голосного | не вимовляється: /kɑː/, /ˈwɔːtə/ | вимовляється: /kɑːr/, /ˈwɔːtər/ | [[car]], [[water]], [[first]], [[more]]
    t між голосними | чітке /t/ | швидкий звук, схожий на «д» | [[water]], [[better]], [[city]], [[party]]
    o в hot, stop, job | /ɒ/, ≈ «о» | /ɑː/, ≈ «а» | [[hot]], [[stop]], [[job]], [[not]]
    o в go, home | /əʊ/, ≈ «еу» | /oʊ/, ≈ «оу» | [[go]], [[home]], [[no]], [[phone]]
    a в bath, ask, can't | /ɑː/, ≈ довге «а» (південь Англії) | /æ/ | [[bath]], [[ask]], [[can't]], [[dance]], [[after]]
    u, ew після t, d, n | /juː/: /ˈtjuːzdeɪ/, /njuː/ | /uː/: /ˈtuːzdeɪ/, /nuː/ | [[Tuesday]], [[new]], [[student]], [[during]]
  `);
  const usukWordsSound = rows(`
    [[tomato]] | /təˈmɑːtəʊ/ | /təˈmeɪtoʊ/
    [[schedule]] | /ˈʃedjuːl/ (також /ˈskedʒuːl/) | /ˈskedʒuːl/
    [[either]] | переважно /ˈaɪðə/ | переважно /ˈiːðər/
    [[vitamin]] | /ˈvɪtəmɪn/ | /ˈvaɪtəmɪn/
    [[garage]] | /ˈɡærɑːʒ/, /ˈɡærɪdʒ/ | /ɡəˈrɑːʒ/
    [[advertisement]] | /ədˈvɜːtɪsmənt/ | /ˌædvərˈtaɪzmənt/
    [[leisure]] | /ˈleʒə/ | /ˈliːʒər/
    [[herb]] | /hɜːb/ | /ɜːrb/ — h не звучить
    [[aluminium]] / [[aluminum]] | /ˌæljəˈmɪniəm/ | /əˈluːmɪnəm/
    [[privacy]] | /ˈprɪvəsi/ | /ˈpraɪvəsi/
    [[mobile]] | /ˈməʊbaɪl/ | /ˈmoʊbl/
    [[route]] | /ruːt/ | /ruːt/, /raʊt/
    [[address]] (іменник) | /əˈdres/ | /ˈædres/, /əˈdres/
    [[data]] | /ˈdeɪtə/ | /ˈdeɪtə/, /ˈdætə/
    [[ate]] | /et/, /eɪt/ | /eɪt/
    [[can't]] | /kɑːnt/ | /kænt/
    [[Z|letter Z]] | /zed/ | /ziː/
  `);
  const usukGram = rows(`
    володіння | [[Have you got a car?]] (і [[Do you have a car?]]) | [[Do you have a car?]]
    V3 від get | [[It's got colder.]] | [[It's gotten colder.]]
    збірні іменники | [[The team are winning.]] (або is) | [[The team is winning.]]
    just, already, yet | [[I've just eaten.]] [[Have you finished yet?]] | часто Past Simple: [[I just ate.]] [[Did you finish yet?]]
    вихідні | [[at the weekend]] | [[on the weekend]]
    пропозиція | [[Shall we go?]] | [[Should we go?]] [[Do you want to go?]]
    лист комусь | [[Write to me.]] | [[Write me.]] (і [[Write to me.]])
    відмінний від | [[different from]], [[different to]] | [[different from]], [[different than]]
    у лікарні | [[He's in hospital.]] | [[He's in the hospital.]]
    з понеділка до п'ятниці | [[Monday to Friday]] | [[Monday through Friday]]
    дата | [[24 August|the twenty-fourth of August]] | [[August 24|August twenty-fourth]]
    душ, погляд | [[have a shower]], [[have a look]] | [[take a shower]], [[take a look]]
    минулий час | [[learnt]], [[dreamt]], [[spelt]] (і -ed) | [[learned]], [[dreamed]], [[spelled]]
    порада, вимога | [[I suggest that he should go.]] | [[I suggest that he go.]]
  `);

  const nBig = rows(`
    1,000 | [[one thousand]], [[a thousand]] | кома відділяє тисячі (українською — пробіл: 1 000)
    1,250 | [[one thousand two hundred and fifty]] (UK), [[one thousand two hundred fifty]] (US) | у UK and після сотень обов'язкове
    2,500 | [[two thousand five hundred]]; розмовне [[twenty-five hundred]] |
    1,000,000 | [[a million]], [[one million]] |
    1,000,000,000 | [[a billion]] | billion — мільярд, а не «більйон»
    300 | [[three hundred]] | hundred, thousand, million після числа — без -s; але [[hundreds of people]], [[thousands of years]]
    1.5 | [[one point five]] | десятковий знак — крапка (українською — кома: 1,5)
    0.25 | [[zero point two five]], [[nought point two five]] (UK), [[point two five]] | після крапки цифри читають по одній
    3.14 | [[three point one four]] | не «three point fourteen»
    1,000.5 | [[one thousand point five]] |
  `);
  const nFrac = rows(`
    1/2 | [[a half]], [[one half]]
    1/3 | [[a third]]
    1/4 | [[a quarter]] (US також [[a fourth]])
    3/4 | [[three quarters]]
    2/3 | [[two thirds]]
    1½ | [[one and a half]]: [[one and a half hours]] або [[an hour and a half]]
    5% | [[five percent]] (UK також per cent)
    0.5% | [[zero point five percent]], [[half a percent]]
    2 + 3 = 5 | [[two plus three equals five]], [[two and three is five]]
    7 − 2 = 5 | [[seven minus two equals five]]
    4 × 3 = 12 | [[four times three is twelve]], [[four multiplied by three equals twelve]]
    12 ÷ 4 = 3 | [[twelve divided by four is three]]
    5² | [[five squared]]
  `);
  const nDates = rows(`
    UK: 24/08/2026, 24 August 2026 | [[the twenty-fourth of August, twenty twenty-six]], [[August the twenty-fourth]] | день → місяць → рік
    US: 08/24/2026, August 24, 2026 | [[August twenty-fourth, twenty twenty-six]] | місяць → день → рік
    ⚠️ 03/04/2026 | у UK — 3 квітня, у US — 4 березня | у листах пишіть місяць словом: [[3 April 2026|the third of April, twenty twenty-six]]
    1st, 2nd, 3rd, 4th | [[first]], [[second]], [[third]], [[fourth]] | у датах — порядкові числівники
    21st, 22nd, 23rd, 31st | [[twenty-first]], [[twenty-second]], [[twenty-third]], [[thirty-first]] |
    1990 | [[nineteen ninety]] | роки читають парами цифр
    1905 | [[nineteen oh five]] |
    1900 | [[nineteen hundred]] |
    2000 | [[two thousand]] |
    2008 | [[two thousand and eight]] (UK), [[two thousand eight]] (US) |
    2026 | [[twenty twenty-six]], [[two thousand and twenty-six]] |
    1990s | [[the nineties]] |
    21st century | [[the twenty-first century]] |
    прийменники | [[in 2026]], [[in August]], [[on 24 August|on the twenty-fourth of August]], [[on August 24th|on August twenty-fourth]] | рік і місяць — in, дата — on
  `);
  const nPhone = rows(`
    UK: 020 7946 0123 | [[oh two oh, seven nine four six, oh one two three]] | по одній цифрі, з паузами між групами
    US: (202) 555-0147 | [[two oh two, five five five, oh one four seven]] |
    0 | [[oh]] (UK і US), [[zero]] (частіше US) |
    55 у номері | [[double five]] (UK); у US частіше [[five five]] |
    999 / 911 / 112 | [[nine nine nine]] (UK), [[nine one one]] (US), [[one one two]] (ЄС) | 911 — не «nine eleven»
  `);
  const nMoney = rows(`
    £3.49 | [[three pounds forty-nine]], [[three forty-nine]]; офіційно [[three pounds and forty-nine pence]] |
    $10.99 | [[ten dollars ninety-nine]], [[ten ninety-nine]]; офіційно [[ten dollars and ninety-nine cents]] |
    €20 | [[twenty euros]] |
    50p | [[fifty p]], [[fifty pence]] | p вимовляють «пі»
    25¢ | [[twenty-five cents]]; монета — [[a quarter]] (US) |
    £1, $1 | [[a pound]], [[a dollar]]; розмовне [[a quid]] (UK, у множині теж quid: [[ten quid]]), [[a buck]] (US: [[ten bucks]]) |
    £5, £10 | розмовне UK: [[a fiver]], [[a tenner]] |
    $1,500 | [[one thousand five hundred dollars]], [[fifteen hundred dollars]] |
    £2.5m | [[two point five million pounds]], [[two and a half million pounds]] |
    монети US | [[penny]] — 1¢, [[nickel]] — 5¢, [[dime]] — 10¢, [[quarter]] — 25¢ |
  `);
  const nTemp = rows(`
    −10 °C | 14 °F | [[minus ten]], [[ten below zero]]
    0 °C | 32 °F | [[zero degrees]] — вода замерзає
    10 °C | 50 °F | [[ten degrees]]
    20 °C | 68 °F | [[twenty degrees]] — кімнатна температура
    25 °C | 77 °F | [[seventy-seven degrees Fahrenheit]]
    30 °C | 86 °F | [[thirty degrees Celsius]] — спека
    37 °C | 98.6 °F | [[ninety-eight point six]] — нормальна температура тіла
    40 °C | 104 °F | [[a hundred and four degrees]]
    100 °C | 212 °F | [[boiling point]] — вода кипить
  `);
  const nTime = rows(`
    7:00 | [[seven o'clock]], [[seven]] | o'clock — лише з рівними годинами
    7:05 | [[five past seven]] (UK), [[five after seven]] (US), [[seven oh five]] |
    7:15 | [[a quarter past seven]] (UK), [[a quarter after seven]] (US), [[seven fifteen]] |
    7:30 | [[half past seven]], [[seven thirty]]; розмовне UK [[half seven]] | ⚠️ half seven = 7:30, а не «пів сьомої» (6:30)
    7:40 | [[twenty to eight]], [[seven forty]] |
    7:45 | [[a quarter to eight]] (UK), [[a quarter of eight]] (US), [[seven forty-five]] |
    7:23 | [[twenty-three minutes past seven]], [[seven twenty-three]] | якщо хвилин не кратно п'яти, додають minutes
    12:00 | [[noon]], [[midday]], [[twelve o'clock]] |
    0:00 | [[midnight]] |
    8 a.m. / 8 p.m. | [[eight a.m.]] — 08:00, [[eight p.m.]] — 20:00 | a.m. — до полудня, p.m. — після; замість «12 a.m. / 12 p.m.» кажіть midnight / noon
    14:30 | [[two thirty]], [[half past two]]; у розкладах — [[fourteen thirty]] | у мовленні — 12-годинний формат
    1 h 30 min | [[an hour and a half]]; 30 хвилин — [[half an hour]] |
  `);
  const nZero = rows(`
    zero | математика, наука, температура; телефони в US | [[zero degrees]], [[zero point five]]
    oh | телефони, роки, номери кімнат, час | [[nineteen oh five]], [[room four oh two]], [[seven oh five]]
    nought | UK, у десяткових дробах | [[nought point five]]
    nil | UK, рахунок у футболі | [[two nil]]; у US — [[two to nothing]], [[two-zero]]
    love | теніс | [[thirty love]]
  `).map((r) => [say(r[0])].concat(r.slice(1)));

  EN.ref = [
    { id: 'sounds', title: 'Вимова: звуки англійської (IPA)', html:
      `<p>Транскрипцію подано за міжнародним фонетичним алфавітом (IPA), у британському варіанті, як у Cambridge і Oxford Learner's Dictionaries; американські відмінності — у примітках і в розділі «Американська і британська англійська». Натисніть на слово, щоб почути його.</p>
<ul><li><b>ː</b> — довгий звук: /iː/ довше за /ɪ/.</li><li><b>ˈ</b> стоїть <i>перед</i> наголошеним складом: /ˈwɔːtə/ — WA-ter; <b>ˌ</b> — другорядний наголос.</li><li>Кириличні підказки «≈» — лише приблизні: для більшості англійських звуків точних відповідників в українській немає.</li></ul>
<div class="note"><b>⚠️ Довгі й короткі голосні — різні звуки.</b> Вони різняться і довжиною, і якістю, і змінюють значення: [[ship]] — корабель, [[sheep]] — вівця; [[full]] — повний, [[fool]] — дурень. В українській такої різниці немає, тож вчіть пари на слух.</div>
<h3>Короткі голосні</h3>` + tbl(SND, bold1(vShort)) +
      '<h3>Довгі голосні</h3>' + tbl(SND, bold1(vLong)) +
      '<h3>Дифтонги (два звуки в одному складі)</h3>' + tbl(SND, bold1(vDiph)) +
      '<h3>Приголосні, складні для україномовних</h3>' + tbl(SND, bold1(cons)) +
      `<div class="good"><b>Добра новина:</b> /m/, /n/, /f/, /s/, /z/, /ʃ/ (ш), /tʃ/ (ч) звучать майже як українські. А дзвінкі приголосні в кінці слова українська теж не оглушує: [[bed]], [[bag]] вимовляйте так само чітко, як «дуб», «сад».</div>
<h3>Закінчення -s і -ed</h3>` + tbl(['Закінчення', 'Звучить', 'Коли', 'Приклади'], bold1(endings)) +
      '<div class="note"><b>⚠️</b> Не додавайте зайвого складу: [[worked]] — один склад /wɜːkt/, а не «ворк-ед»; [[lived]] — /lɪvd/.</div>' +
      '<h3>Німі літери</h3>' + tbl(['Літера', 'Коли не вимовляється', 'Приклади'], bold1(silent)) +
      '<h3>Абетка: як називати літери</h3>' + tbl(['Літера', 'Назва', '≈'], abc) +
      `<div class="tip"><b>Як продиктувати ім'я чи пошту:</b> [[double L]] — ll, [[at]] — @, [[dot]] — крапка, [[underscore]] — _, [[dash]] чи [[hyphen]] — дефіс, [[slash]] — /, [[capital A]] — велика A. Наприклад: [[olena.k@example.com|olena dot k at example dot com]]. Найчастіше плутають E (і) та I (ай), G (джі) та J (джей), A (ей) та R (а:).</div>
<h3>Наголос у слові</h3>
<p>Наголошений склад довший, гучніший і вищий, а ненаголошені «ковтаються» до /ə/. Неправильний наголос заважає розуміти більше, ніж неточний звук.</p>` +
      tbl(['Правило', 'Приклади (наголошений склад — жирним)'], stressRules) +
      '<p><b>Слова, у яких україномовні часто ставлять «український» наголос:</b></p>' +
      tbl(['Англійське слово', 'IPA', 'Як кажуть помилково / українське слово'], stressWords) +
      `<h3>Шва /ə/ і слабкі форми</h3>
<p><b>Шва /ə/</b> — найчастіший звук англійської: так звучать майже всі ненаголошені голосні, хоч би якою літерою їх писали: [[about]] /əˈbaʊt/, [[banana]] /bəˈnɑːnə/, [[teacher]] /ˈtiːtʃə/, [[support]] /səˈpɔːt/, [[problem]] /ˈprɒbləm/. Службові слова (артиклі, прийменники, допоміжні дієслова) в реченні теж звучать коротко, зі шва, — це <b>слабкі форми</b>. Сильна форма — коли слово наголошене, стоїть у кінці речення або вимовляється окремо: [[Who are you waiting for?]]</p>` +
      tbl(['Слово', 'Сильна форма', 'Слабка форма', 'Приклад'], weak) +
      '<div class="tip"><b>Порада:</b> якщо вимовляти кожне to, and, of повністю, мова звучить «по складах» і її важче зрозуміти. Слухайте фразу й повторюйте ритм: наголошені слова — чітко, службові — швидко.</div>' },

    { id: 'irregular', title: 'Неправильні дієслова', html:
      `<p><b>V1</b> — інфінітив, <b>V2</b> — Past Simple (минулий час), <b>V3</b> — Past Participle (Present Perfect, пасив). Правильні дієслова утворюють V2 і V3 з -ed ([[work]] → [[worked]]), неправильні — треба запам'ятати. Позначка <b>(UK)</b> — британська форма, <b>(US)</b> — американська; форми без позначки вживають усюди.</p>
<div class="tip"><b>Вчіть групами.</b> Усі три форми однакові: [[cut]], [[put]], [[let]], [[cost]], [[hit]], [[shut]], [[set]]. V2 = V3: [[buy, bought, bought]], [[teach, taught, taught]], [[keep, kept, kept]]. Чергування i–a–u: [[sing, sang, sung]], [[drink, drank, drunk]], [[swim, swam, swum]], [[begin, began, begun]]. V1 = V3: [[come, came, come]], [[become, became, become]], [[run, ran, run]].</div>` +
      tbl(['V1', 'V2 (Past Simple)', 'V3 (Past Participle)', 'Переклад'], irr) +
      `<div class="note"><b>⚠️ Вимова.</b> [[read]] → [[read|red]] /red/; [[said]] /sed/; [[meant]] /ment/; [[dealt]] /delt/; [[heard]] /hɜːd/; усі на -ought і -aught звучать /ɔːt/: [[bought]], [[brought]], [[thought]], [[caught]], [[taught]].</div>
<div class="note"><b>⚠️ Не сплутайте:</b> [[lie, lay, lain]] — лежати і [[lay, laid, laid]] — класти; [[lie, lied, lied]] — брехати; [[fall, fell, fallen]] — падати і [[feel, felt, felt]] — відчувати; [[find, found, found]] — знаходити і [[found, founded, founded]] — засновувати; [[rise, rose, risen]] — підніматися (самому) і [[raise, raised, raised]] — піднімати (щось); [[leave, left, left]] — залишати і [[live, lived, lived]] — жити.</div>
<div class="tip"><b>got чи gotten?</b> У британській V3 від [[get]] — [[got]]: [[It has got colder.]] В американській — [[gotten]]: [[It has gotten colder.]] Але «мати» в обох варіантах — [[have got]]: [[I've got a car.]]</div>` },

    { id: 'tenses', title: 'Часи англійського дієслова', html:
      `<p>В українській три часи, в англійській — 12 активних. Логіка проста: <b>Simple</b> — факт; <b>Continuous</b> (be + V-ing) — процес; <b>Perfect</b> (have + V3) — результат до певного моменту; <b>Perfect Continuous</b> (have been + V-ing) — процес до певного моменту, з тривалістю. V1 — інфінітив, V2 і V3 — друга й третя форми (див. «Неправильні дієслова»).</p>` +
      tbl(['Час', 'Формула', 'Коли вживаємо', 'Приклад', 'Слова-маркери'], tenses) +
      `<div class="note"><b>⚠️ Дієслова стану</b> зазвичай не вживаються з -ing: [[know]], [[believe]], [[understand]], [[like]], [[love]], [[hate]], [[want]], [[need]], [[prefer]], [[remember]], [[belong]], [[own]], [[seem]], [[mean]]. Не «I'm knowing», а [[I know.]]; не «I'm wanting», а [[I want.]]</div>
<h3>Як говорити про майбутнє</h3>` + tbl(['Форма', 'Коли', 'Приклад'], bold1(future)) +
      '<h3>Як вибрати час: типові пастки для україномовних</h3>' + tbl(['Українською', 'Англійською', 'Чому'], choose) +
      `<h3>Пасив (пасивний стан)</h3>
<p>Пасив = <b>be</b> у потрібному часі + <b>V3</b>. Головне — що зроблено, а не хто зробив. Виконавця, якщо треба, вводять через by: [[The book was written by Orwell.]]</p>` +
      tbl(['Час', 'Формула', 'Приклад'], bold1(passive)) +
      '<div class="good"><b>Українські безособові речення часто перекладаються пасивом:</b> «Тут говорять англійською» — [[English is spoken here.]]; «Мені сказали» — [[I was told.]]; «Його звільнили» — [[He was fired.]] Пасив у Perfect Continuous і Future Continuous майже не вживається.</div>' },

    { id: 'articles', title: 'Артиклі й іменники', html:
      `<div class="note"><b>⚠️ Головне правило.</b> В українській артиклів немає, тому найчастіша помилка — пропустити їх: «I am engineer», «She has car». Злічуваний іменник в однині майже ніколи не стоїть сам: перед ним a / an, the, my, this, his тощо — [[I'm an engineer.]] [[She has a car.]]</div>
<p><b>a / an</b> — неозначений артикль («якийсь, один»), лише з однинним злічуваним іменником. <b>the</b> — означений («той самий, відомий»), з будь-яким іменником. <b>—</b> — нульовий артикль (артикля немає).</p>` +
      tbl(['Артикль', 'Коли', 'Приклади'], bold1(art)) +
      '<h3>Географічні та інші назви</h3>' + tbl(['Що', 'Артикль', 'Приклади'], bold1(geo)) +
      '<h3>Сталі вирази</h3>' + tbl(['Вираз', 'Коментар'], fixed) +
      '<h3>Неправильна множина</h3>' + tbl(['Однина', 'Множина', 'Примітка'], plurals) +
      `<h3>Незлічувані іменники</h3>
<p>Незлічувані іменники не мають множини й не вживаються з a / an; дієслово після них — в однині. Чимало з них в українській злічувані або вживаються в множині (меблі, гроші, новини), — звідси помилки.</p>` +
      tbl(['Слово', 'Як сказати про одну річ чи кількість', '⚠️ Не кажіть'], uncount) +
      '<h3>Скільки: many / much, few / little</h3>' + tbl(['', 'Злічувані', 'Незлічувані'], bold1(quant)) },

    { id: 'prepositions', title: 'Прийменники', html:
      '<h3>Час: at, on, in та інші</h3><p>Запам\'ятайте «піраміду»: <b>at</b> — точка (година), <b>on</b> — день, <b>in</b> — довший період (місяць, рік, сезон).</p>' +
      tbl(['Прийменник', 'Коли', 'Приклади'], bold1(pTime)) +
      '<div class="tip"><b>by чи until?</b> [[Do it by Friday.]] — зробіть не пізніше п\'ятниці. [[I\'ll be here until Friday.]] — я буду тут аж до п\'ятниці. <b>for чи since?</b> [[for three years]] — протягом (скільки), [[since 2023]] — відтоді (з якого моменту).</div>' +
      '<h3>Місце: at, on, in</h3>' + tbl(['Прийменник', 'Коли', 'Приклади'], bold1(pPlace)) +
      '<h3>Пастки: український прийменник ≠ англійський</h3>' + tbl(['Українською', 'Англійською'], pTraps) +
      `<h3>Дієслова, прикметники й іменники з прийменниками</h3>
<p>Ці сполучення не перекладаються дослівно — вчіть їх разом із прийменником. Після прийменника дієслово має форму -ing: [[interested in learning]], [[good at cooking]], [[Thank you for coming.]], [[I look forward to seeing you.]]</p>` +
      tbl(['Сполучення', 'Приклад', '⚠️ Не кажіть / примітка'], coll) +
      '<div class="note"><b>⚠️ Типові кальки з української:</b> «depend from» → [[depend on]]; «discuss about» → [[discuss]]; «explain me» → [[explain to me]]; «marry with» → [[marry]]; «enter into the room» → [[enter the room]]; «answer on the question» → [[answer the question]]; «listen music» → [[listen to music]]; «I am agree» → [[I agree]]; «go to home» → [[go home]]; «on the photo» → [[in the photo]].</div>' },

    { id: 'modals', title: 'Модальні дієслова', html:
      `<div class="good"><b>Модальні дієслова прості у формі:</b> без -s у третій особі ([[she can]], не «cans»), без to після них ([[I must go]], не «must to go»), питання й заперечення — без do: [[Can you help?]] [[I can't.]] Винятки з to: have to, ought to, need to, be able to, be allowed to.</div>` +
      tbl(['Дієслово', 'Значення', 'Приклад', 'Заперечення', 'Минуле та інші форми'], modals) +
      `<div class="note"><b>⚠️ mustn't ≠ don't have to.</b> [[You mustn't tell him.]] — не можна казати (заборонено). [[You don't have to tell him.]] — не обов'язково казати (як хочеш).</div>
<h3>Наскільки ви впевнені: must, may, might, can't</h3>` +
      tbl(['Впевненість', 'Про тепер', 'Про минуле (+ have + V3)'], bold1(deduce)) +
      '<div class="tip">Висновок «точно ні» — [[can\'t]], а не mustn\'t: [[That can\'t be true!]] — Цього не може бути!</div>' },

    { id: 'conditionals', title: 'Умовні речення і wish', html:
      '<p>Частини речення можна поміняти місцями: [[If it rains, we\'ll stay at home.]] = [[We\'ll stay at home if it rains.]] Кома ставиться, лише коли if-частина стоїть першою.</p>' +
      tbl(['Тип', 'Формула', 'Коли', 'Приклад', 'Українською'], bold1(cond)) +
      `<div class="note"><b>⚠️ Після if — без will.</b> Українською кажемо «Якщо ти <i>прийдеш</i>», англійською — теперішній час: [[If you come]], не «If you will come». Так само після when, as soon as, before, after, until: [[I'll call you when I get home.]]</div>
<div class="note"><b>⚠️ Українське «б» має два відповідники.</b> «Якби я знав» може бути і про тепер, і про минуле; англійською це різні речення: [[If I knew]] (тепер), [[If I had known]] (тоді). Друга частина — [[I would tell you]] / [[I would have told you]].</div>
<h3>Інші сполучники умови</h3>` + tbl(['Сполучник', 'Значення', 'Приклад'], condWords) +
      '<h3>wish і if only: «шкода, що…», «якби ж…»</h3>' +
      tbl(['Про що', 'Формула', 'Приклад', 'Українською'], bold1(wish)) +
      `<div class="tip"><b>Правило зсуву:</b> після wish час «відступає» на крок у минуле: про тепер — Past Simple, про минуле — Past Perfect. wish + would — лише про інших людей чи обставини, не про себе: не «I wish I would».</div>
<div class="note"><b>⚠️ wish чи hope?</b> Про реальне майбутнє — [[hope]]: [[I hope you get the job.]] (не «I wish you get»). Але побажання з іменником — [[wish]]: [[I wish you good luck.]] [[We wish you a merry Christmas.]]</div>` },

    { id: 'phrasal', title: 'Фразові дієслова', html:
      `<p>Фразове дієслово = дієслово + частка (up, off, out…), а значення часто зовсім нове: [[give]] — давати, [[give up]] — кинути, здатися. У розмовній мові вони звучать частіше, ніж «книжні» синоніми: [[find out]] замість discover, [[put off]] замість postpone.</p>
<ul><li><b>sep.</b> (розділяється) — додаток може стати між дієсловом і часткою: [[Turn off the light.]] = [[Turn the light off.]] Займенник — <b>лише</b> всередину: [[Turn it off.]] (не «turn off it»).</li><li><b>insep.</b> (не розділяється) — додаток завжди після частки: [[Look after her.]] (не «look her after»).</li><li><b>—</b> — без додатка: [[I get up at seven.]]</li></ul>` +
      tbl(['Дієслово', 'Значення', 'Приклад', 'Тип'], phr) +
      '<div class="tip"><b>Наголос</b> у фразовому дієслові зазвичай падає на частку: [[give <b>up</b>]], [[find <b>out</b>]], [[turn <b>off</b>]].</div>' },

    { id: 'falsefriends', title: 'Фальшиві друзі перекладача', html:
      '<p>Слова, схожі на українські (чи російські), але з іншим значенням. Найнебезпечніші — ті, що здаються зрозумілими без словника.</p>' +
      tbl(['Англійське слово', 'Означає', '«Схоже» українське слово = англійською'], ff) +
      '<div class="tip"><b>Справжні друзі теж є:</b> [[hotel]], [[problem]], [[telephone]], [[student]], [[museum]], [[doctor]] означають те саме, що й українською, але наголос і вимова часто інші — див. розділ «Вимова».</div>' },

    { id: 'usuk', title: 'Американська і британська англійська', html:
      '<p>Носії обох варіантів чудово розуміють одне одного. Головне — не змішувати варіанти в одному тексті. Тренажер зараховує обидва варіанти написання (colour = color).</p>' +
      '<h3>Слова</h3>' + tbl(['🇬🇧 UK', '🇺🇸 US', 'Українською'], usukWords) +
      '<h3>Правопис</h3>' + tbl(['Шаблон', '🇬🇧 UK', '🇺🇸 US'], bold1(usukSpell)) +
      '<h3>Вимова: загальні відмінності</h3>' + tbl(['Що', '🇬🇧 UK', '🇺🇸 US', 'Приклади'], bold1(usukSound)) +
      '<p class="small muted">Тренажер говорить акцентом, вибраним в ⚙️ «Налаштування»: перемкніть 🇺🇸 / 🇬🇧 і послухайте ті самі слова.</p>' +
      '<h3>Вимова окремих слів</h3>' + tbl(['Слово', '🇬🇧 UK', '🇺🇸 US'], usukWordsSound) +
      '<h3>Граматика й вирази</h3>' + tbl(['Що', '🇬🇧 UK', '🇺🇸 US'], bold1(usukGram)) },

    { id: 'numbers', title: 'Числа, дати, гроші й час', html:
      '<div class="note"><b>⚠️ Крапка й кома — навпаки, ніж в українській.</b> Англійською 2,500 — дві тисячі п\'ятсот, а 2.5 — дві цілих п\'ять десятих ([[two point five]]). Українською — 2 500 і 2,5.</div>' +
      '<h3>Великі числа й десяткові дроби</h3>' + tbl(['Пишемо', 'Читаємо', 'Примітка'], bold1(nBig)) +
      '<h3>Дроби, відсотки, арифметика</h3>' + tbl(['Пишемо', 'Читаємо'], bold1(nFrac)) +
      '<div class="tip"><b>Число + іменник як прикметник — без -s:</b> [[a five-year-old boy]], [[a ten-minute walk]], [[a two-hour meeting]], [[a twenty-pound note]]. Але [[The boy is five years old.]]</div>' +
      '<h3>Дати й роки</h3>' + tbl(['Пишемо', 'Читаємо', 'Примітка'], bold1(nDates)) +
      '<h3>Номери телефонів</h3>' + tbl(['Пишемо', 'Читаємо', 'Примітка'], bold1(nPhone)) +
      `<h3>Гроші</h3>
<p>Знак валюти пишемо <b>перед</b> числом, а слово читаємо <b>після</b>: £5 — [[five pounds]] (не «pounds five»). Множина: [[pounds]], [[dollars]], [[euros]], [[cents]], [[pence]].</p>` +
      tbl(['Пишемо', 'Читаємо', 'Примітка'], bold1(nMoney)) +
      `<h3>Температура</h3>
<p>У Великій Британії й Україні — градуси Цельсія (°C), у США — Фаренгейта (°F). °F = °C × 1.8 + 32; °C = (°F − 32) ÷ 1.8. Приблизно: подвоїти °C і додати 30. Тож [[It's ninety degrees today!]] в Америці — це ≈ 32 °C, спека.</p>` +
      tbl(['°C', '°F', 'Як сказати'], bold1(nTemp)) +
      '<h3>Час</h3>' + tbl(['Пишемо', 'Читаємо', 'Примітка'], bold1(nTime)) +
      '<div class="tip"><b>Як запитати:</b> [[What time is it?]] [[What\'s the time?]] (UK) — Котра година? [[What time does it start?]] — О котрій починається? Відповідь: [[It starts at half past six.]]</div>' +
      '<h3>Нуль: zero, oh, nought, nil, love</h3>' + tbl(['Слово', 'Де вживають', 'Приклад'], nZero) }
  ];
})(window.EN);

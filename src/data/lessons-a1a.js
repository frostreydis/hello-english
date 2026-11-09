/* A1, частина 1: уроки A1.1–A1.7. Формат: c — o[0] правильний; i/l — a: рядок або масив; o — a: речення або масив */
window.EN = window.EN || {};
EN.lessons = EN.lessons || [];
EN.lessons.push(
{
  id: 'a1-1', stage: 'a1', num: 'A1.1', title: 'I am, you are — дієслово to be і знайомство', dur: '1 тиждень',
  goals: ['відмінювати to be (am, is, are)', 'сказати, хто ви, звідки й ким працюєте', 'будувати заперечення й питання з to be'],
  theory: `
<h3>Особові займенники</h3>
<p>[[I]] — я (завжди з великої літери!), [[you]] — ти / ви, [[he]] — він, [[she]] — вона, [[it]] — воно (предмет, тварина, ситуація), [[we]] — ми, [[they]] — вони.</p>
<div class="good"><b>Ти і ви — одне слово.</b> [[you]] — і «ти», і «ви». Ввічливість передають інакше: [[please]], [[Could you…?]], звертання [[Mr Smith]], [[Ms Brown]].</div>
<h3>to be — бути. В українській воно випадає, в англійській — ні!</h3>
<p>Українською кажемо «Я інженер», «Вона вдома». Англійською без дієслова речення неможливе: [[I am an engineer.]] [[She is at home.]]</p>
<div class="tblwrap"><table><tr><th>повна форма</th><th>коротка (у мовленні)</th><th>приклад</th></tr>
<tr><td>I <b>am</b></td><td>[[I'm]]</td><td>[[I'm from Ukraine.]] — Я з України.</td></tr>
<tr><td>you <b>are</b></td><td>[[you're]]</td><td>[[You're late.]] — Ти запізнився.</td></tr>
<tr><td>he / she / it <b>is</b></td><td>[[he's]], [[she's]], [[it's]]</td><td>[[She's a doctor.]] [[It's cold.]]</td></tr>
<tr><td>we / you / they <b>are</b></td><td>[[we're]], [[they're]]</td><td>[[We're colleagues.]] — Ми колеги.</td></tr></table></div>
<p>У розмові майже завжди звучать <b>короткі форми</b>. Повні — в офіційних текстах або коли наголошуємо: [[I am ready!]]</p>
<h3>Заперечення: not після to be</h3>
<p>[[I'm not tired.]] — Я не втомився. [[He isn't here.]] — Його тут немає. [[They aren't at work.]] — Вони не на роботі.<br>
Короткі форми: <b>is not = isn't</b>, <b>are not = aren't</b>, але <b>am not</b> скорочується лише як [[I'm not]] (форми «amn't» немає).</p>
<h3>Питання: to be стає на перше місце</h3>
<p>[[You are tired.]] → [[Are you tired?]] — Ти втомився? [[She is from Kyiv.]] → [[Is she from Kyiv?]]</p>
<p>Коротка відповідь: [[Yes, I am.]] / [[No, I'm not.]] — [[Yes, she is.]] / [[No, she isn't.]] (у ствердній короткій відповіді скорочувати не можна: не «Yes, I'm».)</p>
<p>З питальним словом: [[Where are you from?]] — Звідки ви? [[What's your name?]] — Як вас звати? [[How are you?]] — Як справи? [[Who is it?]] — Хто це?</p>
<div class="note"><b>⚠️ Пастка: інтонація не робить питання.</b> Українською «Ти втомився?» відрізняється від твердження лише інтонацією. В англійській треба <b>переставити слова</b>: не «You are tired?», а [[Are you tired?]]</div>
<h3>a / an перед професією</h3>
<p>Професію називають з артиклем: [[I'm a developer.]] [[She's an engineer.]] [[He's a teacher.]] <b>an</b> — перед голосним <i>звуком</i>: [[an engineer]], [[an accountant]], [[an IT specialist]]. Детальніше про артиклі — в уроці A1.2.</p>
<h3>Країни й національності</h3>
<p>[[Ukraine]] — [[Ukrainian]], [[Slovakia]] — [[Slovak]], [[Poland]] — [[Polish]], [[Germany]] — [[German]], [[the UK]] — [[British]], [[the USA]] — [[American]].<br>
Національність і мова — одне слово, і пишеться <b>з великої літери</b>: [[I'm Ukrainian. I speak Ukrainian and a little English.]]</p>
<div class="tip"><b>Як вимовляти:</b> [[Ukraine]] — ю-КРЕЙН (наголос на другий склад, без «у» на початку), [[Ukrainian]] — ю-КРЕЙ-ні-ен. Натисніть і послухайте.</div>`,
  vocab: [['I', 'я', 'завжди з великої літери'], ['you', 'ти; ви'], ['he / she / it', 'він / вона / воно'], ['we', 'ми'], ['they', 'вони'],
    ['to be', 'бути', 'am, is, are'], ['name', 'ім\'я'], ['from', 'з (звідки)'], ['Ukraine', 'Україна', 'наголос: ю-КРЕЙН'], ['Ukrainian', 'українець; українська мова', 'з великої літери'],
    ['Slovakia', 'Словаччина'], ['country', 'країна'], ['job', 'робота, посада'], ['developer', 'розробник'], ['engineer', 'інженер', 'an engineer'],
    ['teacher', 'вчитель'], ['colleague', 'колега', 'вимова: КО-ліг'], ['married', 'одружений; заміжня'], ['tired', 'втомлений'], ['at home', 'вдома'],
    ['at work', 'на роботі'], ['here', 'тут'], ['Nice to meet you.', 'Приємно познайомитися.']],
  ex: [
    { t: 'i', q: 'Вставте форму to be: I ___ from Ukraine.', a: ['am', '\'m'] },
    { t: 'i', q: 'Вставте форму to be: She ___ a teacher.', a: ['is', '\'s'] },
    { t: 'i', q: 'Вставте форму to be: They ___ at work.', a: ['are', '\'re'] },
    { t: 'i', q: 'Вставте форму to be: ___ you tired?', a: 'Are' },
    { t: 'c', q: '«Я не втомився»', o: ['I\'m not tired.', 'I not tired.', 'I don\'t tired.'], e: 'Заперечення з to be — просто not після am / is / are: [[I\'m not tired.]]' },
    { t: 'c', q: '«Він не вдома»', o: ['He isn\'t at home.', 'He not is at home.', 'He aren\'t at home.'] },
    { t: 'c', q: '«Ви з Польщі?»', o: ['Are you from Poland?', 'You are from Poland?', 'Do you from Poland?'], e: 'У питанні to be стає на перше місце: [[Are you from Poland?]]' },
    { t: 'c', q: 'Коротка відповідь на «Is she married?» — «Так»', o: ['Yes, she is.', 'Yes, she\'s.', 'Yes, she married.'], exact: true, e: 'У ствердній короткій відповіді скорочувати не можна: [[Yes, she is.]]' },
    { t: 'c', q: 'Яке речення правильне?', o: ['I\'m an engineer.', 'I\'m engineer.', 'I\'m a engineer.'], e: 'Професію називають з артиклем; перед голосним звуком — an: [[an engineer]].' },
    { t: 'c', q: '«Я українка»', o: ['I\'m Ukrainian.', 'I\'m ukrainian.', 'I\'m a Ukraine.'], exact: true, e: 'Національність пишуть з великої літери: [[Ukrainian]].' },
    { t: 'o', q: 'Звідки ви?', a: 'Where are you from?' },
    { t: 'o', q: 'Ми не колеги.', a: 'We aren\'t colleagues.' },
    { t: 'o', q: 'Чи вона розробниця?', a: 'Is she a developer?' },
    { t: 'l', a: 'Nice to meet you.', tr: 'Приємно познайомитися.' },
    { t: 'l', a: 'I\'m from Ukraine.', tr: 'Я з України.' }
  ],
  say: [['Hi! My name is Olena. I\'m from Ukraine.', 'Привіт! Мене звати Олена. Я з України.'], ['Nice to meet you.', 'Приємно познайомитися.'], ['Where are you from?', 'Звідки ви?'],
    ['I\'m a developer. I\'m not a manager.', 'Я розробник. Я не менеджер.'], ['Are you tired? — No, I\'m not.', 'Ти втомився? — Ні.'], ['We\'re colleagues.', 'Ми колеги.']],
  speak: ['Представтеся в 4–5 реченнях: ім\'я, звідки ви, де живете, ким працюєте, чи одружені. Запишіть себе й послухайте.',
    'Дайте відповідь уголос повними реченнями: What\'s your name? Where are you from? What\'s your job? Are you tired today?'],
  mission: 'Напишіть англійською коротке представлення себе (3–4 речення) — для профілю в соцмережі, LinkedIn чи робочого чату. Почніть з [[Hi! I\'m…]] і прочитайте його вголос.'
},
{
  id: 'a1-2', stage: 'a1', num: 'A1.2', title: 'A, an, the; this, that; множина', dur: '1 тиждень',
  goals: ['вживати a / an і the з іменниками', 'показувати на предмети: this, that, these, those', 'утворювати множину іменників, зокрема неправильну: men, children, people', 'правильно вимовляти закінчення -s'],
  theory: `
<h3>Артиклі: маленькі слова, яких немає в українській</h3>
<p>В англійській перед іменником зазвичай стоїть <b>артикль</b> — службове слово, яке показує, про що мова: про «якийсь, один з багатьох» предмет чи про «саме цей, відомий». Артиклів два: <b>неозначений</b> [[a]] / [[an]] і <b>означений</b> [[the]].</p>
<div class="note"><b>⚠️ Головна пастка для українців.</b> В українській артиклів немає, тому їх легко «загубити». Але злічуваний іменник в однині майже ніколи не стоїть сам: не «I need umbrella», а [[I need an umbrella.]]; не «Where is key?», а [[Where is the key?]]</div>
<h3>a / an — «один, якийсь», уперше</h3>
<p>Неозначений артикль походить від слова [[one]] і вживається лише з <b>одниною злічуваних</b> іменників: [[a key]], [[a bag]], [[an umbrella]].</p>
<ul><li>згадуємо вперше, слухач ще не знає, який саме: [[I have a new laptop.]] — У мене новий ноутбук.</li>
<li>один з багатьох, будь-який: [[Can I have a glass of water?]] — Можна склянку води?</li>
<li>хто це чи що це: [[She's a doctor.]] [[It's a wallet.]]</li></ul>
<p><b>an</b> — перед голосним <i>звуком</i>, а не буквою: [[an apple]], [[an umbrella]], [[an hour]] (h не читається), [[an email]]. <b>a</b> — перед приголосним звуком, навіть якщо пишеться голосна: [[a university]], [[a European country]] (звучить [j] — «й»), [[a one-way ticket]] (звучить [w]).</p>
<div class="tip"><b>Вимова:</b> [[a]] у мовленні — коротке ненаголошене [ə]: [[a bag]] ≈ «е-БЕГ». [[the]] перед приголосним звучить [ðə], перед голосним звуком — [ði]: [[the door]], але [[the end]], [[the hour]].</div>
<h3>the — «саме цей», відомий обом</h3>
<ul><li>згадуємо вдруге: [[I see a cat and a dog. The cat is black.]]</li>
<li>з ситуації зрозуміло, який саме: [[Close the door, please.]] [[Where are the keys?]] (ті, про які ми обоє знаємо)</li>
<li>єдиний у своєму роді: [[the sun]], [[the moon]], [[the internet]]</li></ul>
<p><b>the</b> вживається з будь-якими іменниками: в однині, у множині й з незлічуваними.</p>
<h3>Коли артикля немає</h3>
<ul><li>множина й незлічувані іменники, коли говоримо загалом: [[I like books.]] [[Coffee is expensive here.]]</li>
<li>імена, міста, більшість країн: [[Anna]], [[London]], [[Poland]]. Але: [[the UK]], [[the USA]], [[the Netherlands]] — у назві є «королівство», «штати» чи множина.</li>
<li>коли перед іменником уже є присвійне чи вказівне слово: [[my bag]], [[this key]] (не «the my bag»).</li></ul>
<div class="tblwrap"><table><tr><th></th><th>однина</th><th>множина</th><th>незлічуване</th></tr>
<tr><td>якийсь, уперше, загалом</td><td>[[a bag]], [[an hour]]</td><td>[[bags]]</td><td>[[water]]</td></tr>
<tr><td>саме цей, відомий</td><td>[[the bag]]</td><td>[[the bags]]</td><td>[[the water]]</td></tr></table></div>
<div class="note"><b>⚠️ Незлічувані іменники</b> не мають множини й не вживаються з a / an: [[information]] (не «informations»), [[advice]], [[money]], [[furniture]]. Одну порцію називають через «шматок», «склянку» тощо: [[a piece of advice]], [[a glass of water]].</div>
<h3>this, that, these, those — цей і той</h3>
<div class="tblwrap"><table><tr><th></th><th>однина</th><th>множина</th></tr>
<tr><td>близько (тут)</td><td>[[this key]] — цей ключ</td><td>[[these keys]] — ці ключі</td></tr>
<tr><td>далеко (там)</td><td>[[that window]] — те вікно</td><td>[[those windows]] — ті вікна</td></tr></table></div>
<p>Вони стоять перед іменником або замість нього: [[This is my bag.]] — Це моя сумка. [[What's that?]] — Що то (там)? [[These are my keys.]] — Це мої ключі. [[Those are my colleagues.]] — То мої колеги.</p>
<p>По телефону представляються через this: [[Hi, this is Olena.]] — Привіт, це Олена.</p>
<div class="note"><b>⚠️ Українське «це» — одне на все.</b> «Це моя сумка» і «Це мої ключі» англійською звучать по-різному: однина — [[This is…]], множина — [[These are…]]. Не «This are my keys».</div>
<div class="tip"><b>Вимова:</b> [[this]] [ðɪs] — коротке [ɪ] і глухе [s]; [[these]] [ðiːz] — довге [iː] і дзвінке [z]. [[that]] [ðæt] — широке «е»; [[those]] [ðəʊz] (US [ðoʊz]). Послухайте пари: [[this — these]], [[that — those]].</div>
<h3>Множина іменників</h3>
<div class="tblwrap"><table><tr><th>правило</th><th>приклади</th></tr>
<tr><td>більшість слів: <b>+s</b></td><td>[[key — keys]], [[bag — bags]], [[laptop — laptops]], [[day — days]]</td></tr>
<tr><td>після -s, -ss, -sh, -ch, -x: <b>+es</b></td><td>[[bus — buses]], [[glass — glasses]], [[dish — dishes]], [[watch — watches]], [[box — boxes]]</td></tr>
<tr><td>приголосна + y: <b>y → ies</b></td><td>[[city — cities]], [[country — countries]], [[family — families]]; але голосна + y — просто +s: [[key — keys]], [[boy — boys]]</td></tr>
<tr><td>-f / -fe: часто <b>→ ves</b></td><td>[[knife — knives]], [[shelf — shelves]], [[wife — wives]]; винятки: [[roof — roofs]], [[chef — chefs]]</td></tr>
<tr><td>деякі слова на -o: <b>+es</b></td><td>[[potato — potatoes]], [[tomato — tomatoes]]; але [[photo — photos]], [[piano — pianos]]</td></tr>
<tr><td><b>неправильна множина</b> — треба запам'ятати</td><td>[[man — men]], [[woman — women]], [[child — children]], [[person — people]], [[foot — feet]], [[tooth — teeth]], [[mouse — mice]]</td></tr></table></div>
<div class="tip"><b>Вимова [[women]]:</b> [ˈwɪmɪn] ≈ «ВІ-мін» — пишеться o, а звучить [ɪ]. Однина [[woman]] [ˈwʊmən] ≈ «ВУ-мен».</div>
<div class="tip"><b>Як звучить закінчення -s:</b><br>
[s] — після глухих [p], [t], [k], [f]: [[laptops]], [[cats]], [[books]], [[cups]];<br>
[z] — після дзвінких і голосних: [[bags]], [[keys]], [[phones]], [[chairs]];<br>
[ɪz] — після свистячих і шиплячих [s], [z], [ʃ], [tʃ], [dʒ]: [[boxes]], [[glasses]], [[watches]], [[pages]].</div>
<div class="good"><b>Добра новина: відмінків немає.</b> «ключі, ключів, ключам, ключами» — завжди [[keys]]. А після будь-якого числа, більшого за один, — множина: [[two keys]], [[five keys]], [[twenty-one keys]] (не як в українському «двадцять один ключ»).</div>
<div class="note"><b>⚠️ [[people]] — уже множина:</b> [[People are nice here.]] (не «people is»), [[two people]] — двоє людей. Форма «persons» — лише в офіційних текстах.</div>`,
  vocab: [['this / these', 'цей, ця, це / ці (близько)', 'this [ɪ] — коротко, these [iː] — довго'], ['that / those', 'той, та, те / ті (далеко)'],
    ['key', 'ключ'], ['bag', 'сумка; пакет'], ['laptop', 'ноутбук'], ['chair', 'стілець'], ['table', 'стіл'], ['window', 'вікно'],
    ['door', 'двері', 'a door — одні двері'], ['box', 'коробка', 'boxes'], ['glass', 'склянка; скло', 'glasses — ще й окуляри'], ['umbrella', 'парасолька', 'an umbrella'],
    ['wallet', 'гаманець'], ['cup', 'чашка', 'a cup of coffee'], ['watch', 'наручний годинник', 'watches'], ['hour', 'година', 'h не читається: an hour'],
    ['man / men', 'чоловік / чоловіки'], ['woman / women', 'жінка / жінки', 'women [ˈwɪmɪn]'], ['child / children', 'дитина / діти'],
    ['person / people', 'людина / люди', 'people — уже множина'], ['foot / feet', 'ступня / ступні; фут'], ['tooth / teeth', 'зуб / зуби'], ['mouse / mice', 'миша / миші', 'і комп\'ютерна теж']],
  ex: [
    { t: 'c', q: '«Це парасолька.»', o: ['It\'s an umbrella.', 'It\'s a umbrella.', 'It\'s umbrella.'], e: 'umbrella починається з голосного звуку [ʌ], тому [[an umbrella]]. Без артикля однину злічуваного іменника не вживають.' },
    { t: 'c', q: 'Як сказати «університет» (один, якийсь)?', o: ['a university', 'an university', 'university'], e: 'Важить звук, а не буква: university починається зі звуку [j], а це приголосний — [[a university]].' },
    { t: 'i', q: 'Вставте a або an: The meeting is in ___ hour.', a: 'an', e: 'У слові hour буква h не читається, і слово починається з голосного звуку: [[an hour]].' },
    { t: 'i', q: 'Вставте a, an або the: Close ___ door, please.', a: 'the', e: 'Обоє знаємо, які саме двері — ті, що тут: [[Close the door, please.]]' },
    { t: 'c', q: '«Я з Великої Британії.»', o: ['I\'m from the UK.', 'I\'m from UK.', 'I\'m from a UK.'], e: 'Більшість країн — без артикля ([[Poland]], [[Slovakia]]), але [[the UK]], [[the USA]].' },
    { t: 'c', q: '«Це мої ключі.»', o: ['These are my keys.', 'This is my keys.', 'This are my keys.'], e: 'Ключі — множина, тож [[These are my keys.]]' },
    { t: 'c', q: '«Що то за коробки?» (вони далеко від вас)', o: ['What are those boxes?', 'What is that boxes?', 'What are that boxes?'], e: 'Далеко + множина = those: [[What are those boxes?]]' },
    { t: 'i', q: 'Напишіть множину: box → ___', a: 'boxes', exact: true, e: 'Після -x додаємо -es: [[boxes]], вимова [ɪz].' },
    { t: 'i', q: 'Напишіть множину: city → ___', a: 'cities', exact: true, e: 'Приголосна + y → ies: [[cities]]. Але key → keys: перед y стоїть голосна.' },
    { t: 'c', q: 'Де всі форми множини правильні?', o: ['children, feet, knives', 'childs, foots, knifes', 'children, feets, knives'], e: '[[child — children]], [[foot — feet]], [[knife — knives]]. Неправильну множину треба просто запам\'ятати.' },
    { t: 'i', q: 'Напишіть множину: woman → ___', a: 'women', exact: true, e: '[[women]] [ˈwɪmɪn] ≈ «ВІ-мін»: пишеться o, а звучить [ɪ].' },
    { t: 'o', q: 'Ті люди — мої колеги.', a: 'Those people are my colleagues.' },
    { t: 'o', q: 'Це твоя парасолька?', a: 'Is this your umbrella?' },
    { t: 'l', a: 'Where are the keys?', tr: 'Де ключі?' },
    { t: 'l', a: ['Two cups of coffee, please.', '2 cups of coffee, please.'], tr: 'Дві чашки кави, будь ласка.' }
  ],
  say: [['This is my bag, and that\'s your bag.', 'Це моя сумка, а то — твоя.'], ['Where are the keys? — They\'re on the table.', 'Де ключі? — На столі.'],
    ['I need an umbrella and a bag.', 'Мені потрібні парасолька й сумка.'], ['These are my children, and those are my friends.', 'Це мої діти, а то — мої друзі.'],
    ['Is this seat free? — Yes, it is.', 'Це місце вільне? — Так.'], ['Two cups of coffee and a glass of water, please.', 'Дві чашки кави і склянку води, будь ласка.']],
  speak: ['Озирніться навколо й назвіть уголос 10 предметів з артиклем: a laptop, an umbrella, the door… Потім покажіть на них: This is… / That is… / These are… / Those are…',
    'Розкажіть, що лежить у вашій сумці чи на робочому столі (5–6 речень): I have a laptop, two pens, three keys… Стежте за a / an і закінченням -s. Запишіть себе й послухайте.'],
  mission: 'Складіть у нотатках телефона англійською список речей у дорогу (packing list) з 8–10 пунктів: [[a laptop]], [[two T-shirts]], [[an umbrella]], [[the keys]]… Перевірте артиклі й закінчення множини і прочитайте список уголос.'
},
{
  id: 'a1-3', stage: 'a1', num: 'A1.3', title: 'Have got / have; my, your; сім\'я', dur: '1 тиждень',
  goals: ['сказати, що в мене є: I have / I\'ve got', 'питати й заперечувати: Do you have…? Have you got…?', 'вживати my, your, his, her, its, our, their і присвійне \'s', 'розповідати про свою сім\'ю'],
  theory: `
<h3>«У мене є» = I have</h3>
<p>В українській власник «ховається» в «у мене»: «У мене є брат». В англійській власник — підмет речення, а «мати» — дієслово [[have]]: [[I have a brother.]]</p>
<div class="note"><b>⚠️ Не перекладайте дослівно.</b> Не «By me is a brother» і не «At me is a car», а лише [[I have a brother.]], [[We have a car.]]</div>
<div class="tblwrap"><table><tr><th>хто</th><th>форма</th><th>приклад</th></tr>
<tr><td>I / you / we / they</td><td><b>have</b></td><td>[[I have two children.]] [[They have a dog.]]</td></tr>
<tr><td>he / she / it</td><td><b>has</b></td><td>[[She has a sister.]] [[My flat has a balcony.]]</td></tr></table></div>
<h3>have got — те саме, по-британськи й розмовно</h3>
<p>У Британії в розмові часто кажуть <b>have got</b>: [[I've got a brother.]] = [[I have a brother.]] Значення однакове. Американці й офіційні тексти частіше вживають просте [[have]] — його розуміють усюди.</p>
<div class="tblwrap"><table><tr><th></th><th>have (усюди, особливо US)</th><th>have got (UK, розмовне)</th></tr>
<tr><td>+</td><td>[[I have a car.]]<br>[[She has a car.]]</td><td>[[I've got a car.]]<br>[[She's got a car.]]</td></tr>
<tr><td>–</td><td>[[I don't have a car.]]<br>[[She doesn't have a car.]]</td><td>[[I haven't got a car.]]<br>[[She hasn't got a car.]]</td></tr>
<tr><td>?</td><td>[[Do you have a car?]]<br>[[Does she have a car?]]</td><td>[[Have you got a car?]]<br>[[Has she got a car?]]</td></tr>
<tr><td>коротка відповідь</td><td>[[Yes, I do.]] / [[No, she doesn't.]]</td><td>[[Yes, I have.]] / [[No, she hasn't.]]</td></tr></table></div>
<div class="note"><b>⚠️ Не змішуйте дві схеми.</b> Або [[Do you have…?]], або [[Have you got…?]] — але не «Do you have got…?». Після doesn't дієслово без -s: [[She doesn't have…]], а не «doesn't has».</div>
<div class="tip"><b>She's got = She has got</b>, а не «she is». На слух [[She's got a dog.]] і [[She's a doctor.]] починаються однаково — розрізняйте за словом got.</div>
<p>У питаннях і запереченнях про наявність часто додають <b>any</b>: [[Have you got any brothers or sisters?]] — У тебе є брати чи сестри? [[I don't have any children.]] — У мене немає дітей.</p>
<h3>Присвійні займенники: чий?</h3>
<div class="tblwrap"><table><tr><th>особа</th><th>чий</th><th>приклад</th></tr>
<tr><td>I</td><td><b>my</b> — мій, моя, моє, мої</td><td>[[my brother]], [[my keys]]</td></tr>
<tr><td>you</td><td><b>your</b> — твій; ваш</td><td>[[your phone]]</td></tr>
<tr><td>he</td><td><b>his</b> — його</td><td>[[his wife]]</td></tr>
<tr><td>she</td><td><b>her</b> — її</td><td>[[her husband]]</td></tr>
<tr><td>it</td><td><b>its</b> — його, її (про предмет, тварину, місто)</td><td>[[the city and its parks]]</td></tr>
<tr><td>we</td><td><b>our</b> — наш</td><td>[[our parents]]</td></tr>
<tr><td>they</td><td><b>their</b> — їхній</td><td>[[their children]]</td></tr></table></div>
<div class="good"><b>Простіше, ніж в українській:</b> my — і «мій», і «моя», і «мої»: [[my son]], [[my daughter]], [[my children]]. Рід і число того, що належить, не важливі.</div>
<div class="note"><b>⚠️ Слова «свій» немає.</b> Його перекладають за особою власника: «Я дзвоню своїй мамі» — [[I call my mum.]], «Він любить свою роботу» — [[He loves his job.]], «Вона живе зі своїми батьками» — [[She lives with her parents.]] Не «He loves my job»!</div>
<div class="note"><b>⚠️ its ≠ it's.</b> [[its]] — присвійне «його / її»: [[The city is famous for its parks.]] [[it's]] — скорочення від it is / it has: [[It's my cat.]] У присвійному its апострофа немає!</div>
<div class="tip"><b>Звучать однаково:</b> [[their]], [[there]] і [[they're]] — [ðeə]; [[your]] і [[you're]] — [jɔː]; [[its]] і [[it's]]. Пишуться по-різному — будьте уважні на письмі.</div>
<h3>Присвійний відмінок: 's і s'</h3>
<p>Щоб сказати, чиє щось, до власника додають <b>'s</b>: [[my sister's car]] — машина моєї сестри, [[Anna's phone]] — телефон Анни, [[my wife's name]] — ім'я моєї дружини.</p>
<ul><li>множина на -s — лише апостроф: [[my parents' house]] — будинок моїх батьків, [[my colleagues' names]] — імена моїх колег;</li>
<li>неправильна множина — 's: [[the children's room]] — дитяча кімната, [[people's names]] — імена людей.</li></ul>
<div class="note"><b>⚠️ Порядок навпаки.</b> Українською «машина сестри» — спершу предмет, потім власник. Англійською спершу власник: [[my sister's car]]. Конструкцію «the car of my sister» про людей майже не вживають.</div>
<div class="tip"><b>Чий? — Whose?</b> [[Whose bag is this?]] — Чия це сумка? — [[It's Tom's.]] / [[It's my sister's.]] Слово [[whose]] звучить так само, як [[who's]] (= who is), — [huːz]. А 's вимовляється, як закінчення множини: [[Kate's]] [s], [[John's]] [z], [[Alex's]] [ɪz].</div>
<h3>Сім'я</h3>
<div class="tblwrap"><table><tr><th>чоловіки</th><th>жінки</th><th>разом</th></tr>
<tr><td>[[father]], [[dad]] — батько, тато</td><td>[[mother]], [[mum]] (US [[mom]]) — мати, мама</td><td>[[parents]] — батьки</td></tr>
<tr><td>[[son]] — син</td><td>[[daughter]] — донька</td><td>[[children]], [[kids]] — діти</td></tr>
<tr><td>[[brother]] — брат</td><td>[[sister]] — сестра</td><td>[[brothers and sisters]] — брати й сестри</td></tr>
<tr><td>[[husband]] — чоловік</td><td>[[wife]] — дружина</td><td>[[a couple]] — пара</td></tr>
<tr><td>[[grandfather]], [[grandpa]] — дідусь</td><td>[[grandmother]], [[grandma]] — бабуся</td><td>[[grandparents]] — дідусь і бабуся</td></tr>
<tr><td>[[uncle]] — дядько</td><td>[[aunt]] — тітка</td><td>[[cousin]] — двоюрідний брат / сестра</td></tr></table></div>
<p>[[I'm an only child.]] — Я єдина дитина в сім'ї. [[I'm married with two kids.]] — Я одружений, у мене двоє дітей. [[My parents live in Lviv.]] — Мої батьки живуть у Львові.</p>
<div class="good"><b>[[cousin]] — одне слово</b> і для двоюрідного брата, і для двоюрідної сестри.</div>
<div class="note"><b>⚠️ «Чоловік» — два різні слова:</b> чоловік як стать — [[man]], чоловік як подружжя — [[husband]]: [[This is my husband.]] А [[parents]] — це лише мама й тато; «родичі» — [[relatives]].</div>
<div class="tip"><b>Вимова:</b> [[daughter]] [ˈdɔːtə] — gh не читається; [[son]] звучить так само, як [[sun]]; [[cousin]] [ˈkʌzn]; [[aunt]] — UK [ɑːnt], US [ænt]; у [[mother]] і [[brother]] — [ʌ] і [ð].</div>`,
  vocab: [['have / has', 'мати', 'he / she / it has'], ['have got', 'мати (UK, розмовне)', 'I\'ve got = I have'], ['family', 'сім\'я, родина'],
    ['parents', 'батьки', 'лише мама й тато'], ['mother / mum', 'мати / мама', 'US: mom'], ['father / dad', 'батько / тато'], ['brother', 'брат'], ['sister', 'сестра'],
    ['son', 'син', 'звучить як sun'], ['daughter', 'донька', '[ˈdɔːtə], gh не читається'], ['husband', 'чоловік (у шлюбі)'], ['wife', 'дружина', 'множина: wives'],
    ['grandparents', 'дідусь і бабуся'], ['grandmother / grandfather', 'бабуся / дідусь', 'розмовно: grandma / grandpa'], ['aunt', 'тітка', 'UK [ɑːnt], US [ænt]'],
    ['uncle', 'дядько'], ['cousin', 'двоюрідний брат; двоюрідна сестра', '[ˈkʌzn]'], ['only child', 'єдина дитина в сім\'ї', 'I\'m an only child.'], ['kids', 'діти (розмовне)'],
    ['relatives', 'родичі'], ['whose', 'чий, чия, чиє, чиї', 'звучить як who\'s'], ['my / your', 'мій / твій, ваш'], ['his / her', 'його / її'],
    ['its', 'його, її (про предмет, тварину)', 'без апострофа'], ['our / their', 'наш / їхній']],
  ex: [
    { t: 'i', q: 'Вставте have або has: My sister ___ two children.', a: ['has', 'has got'], e: 'My sister = she, тож has: [[My sister has two children.]]' },
    { t: 'c', q: '«У мене є брат.»', o: ['I have a brother.', 'By me is a brother.', 'I has a brother.'], e: 'Власник — підмет, «мати» — дієслово have: [[I have a brother.]] або [[I\'ve got a brother.]]' },
    { t: 'c', q: '«У неї немає машини.»', o: ['She doesn\'t have a car.', 'She doesn\'t has a car.', 'She not has a car.'], e: 'Після doesn\'t — базова форма have: [[She doesn\'t have a car.]] По-британськи: [[She hasn\'t got a car.]]' },
    { t: 'c', q: '«У вас є діти?» (британський розмовний варіант)', o: ['Have you got any children?', 'Do you have got any children?', 'Have you any got children?'], e: 'Схема have got: [[Have you got any children?]] Схема have: [[Do you have any children?]] Змішувати їх не можна.' },
    { t: 'i', q: 'Заперечення з have got: He ___ got a sister.', a: 'hasn\'t', e: '[[He hasn\'t got a sister.]] = [[He doesn\'t have a sister.]]' },
    { t: 'i', q: 'Вставте присвійний займенник: Olena is here with ___ husband. (зі своїм)', a: 'her', e: 'Слова «свій» немає: «зі своїм» про Олену — her: [[Olena is here with her husband.]]' },
    { t: 'c', q: '«Це їхній будинок.»', o: ['It\'s their house.', 'It\'s there house.', 'It\'s they\'re house.'], e: 'their, there і they\'re звучать однаково, але «їхній» — лише [[their]].' },
    { t: 'c', q: 'The flat is small, but ___ kitchen is big.', o: ['its', 'it\'s', 'his'], e: '«Її кухня» (кухня квартири) — [[its]] без апострофа. А it\'s = it is.' },
    { t: 'i', q: 'Машина моєї сестри (одна сестра): my ___ car', a: 'sister\'s', exact: true, e: 'Власник + \'s: [[my sister\'s car]].' },
    { t: 'i', q: 'Будинок моїх батьків: my ___ house', a: 'parents\'', exact: true, e: 'Множина на -s отримує лише апостроф: [[my parents\' house]].' },
    { t: 'c', q: '«Чия це сумка?»', o: ['Whose bag is this?', 'Who\'s bag is this?', 'Whose this bag is?'], e: '«Чий» — [[whose]]; who\'s = who is. Порядок: [[Whose bag is this?]]' },
    { t: 'o', q: 'У тебе є брати чи сестри?', a: ['Have you got any brothers or sisters?', 'Have you got any sisters or brothers?'] },
    { t: 'o', q: 'Моя дружина — єдина дитина в сім\'ї.', a: 'My wife is an only child.' },
    { t: 'l', a: 'Whose keys are these?', tr: 'Чиї це ключі?' },
    { t: 'l', a: ['I\'ve got two sisters and a brother.', 'I\'ve got 2 sisters and a brother.'], tr: 'У мене дві сестри й брат.' }
  ],
  say: [['I\'ve got one brother and two sisters.', 'У мене один брат і дві сестри.'], ['Have you got any children? — Yes, a son and a daughter.', 'У вас є діти? — Так, син і донька.'],
    ['I\'m an only child.', 'Я єдина дитина в сім\'ї.'], ['This is my wife, Anna, and these are our kids.', 'Це моя дружина Анна, а це наші діти.'],
    ['Whose phone is this? — It\'s my sister\'s.', 'Чий це телефон? — Моєї сестри.'], ['My parents don\'t have a car.', 'У моїх батьків немає машини.']],
  speak: ['Розкажіть про свою сім\'ю в 5–6 реченнях: хто у вас є, як їх звати, звідки вони, ким працюють (I\'ve got… My sister\'s name is… She\'s a…). Запишіть себе й послухайте.',
    'Відкрийте 3–4 сімейні фото й уголос поясніть, хто на них: This is my… These are my… It\'s my parents\' house. This is my cousin\'s dog.'],
  mission: 'Намалюйте англійською родове дерево: підпишіть кожного ([[my mother]], [[my aunt]], [[my cousin]]) і додайте 2–3 речення про родину ([[I\'ve got…]], [[My brother\'s name is…]]). Надішліть фото дерева другові чи колезі або розкажіть про нього вголос.'
},
{
  id: 'a1-4', stage: 'a1', num: 'A1.4', title: 'Present Simple: I work, he works', dur: '1 тиждень',
  goals: ['розповідати про звички, розпорядок дня і факти в Present Simple', 'не забувати -s з he / she / it', 'будувати заперечення й питання з do / does', 'казати, як часто: always, usually, sometimes, never'],
  theory: `
<h3>Коли вживається Present Simple</h3>
<p><b>Present Simple</b> (теперішній простий час) — для того, що відбувається <b>регулярно</b> або є <b>правдою загалом</b>:</p>
<ul><li>звички й розпорядок: [[I get up at seven.]] — Я встаю о сьомій.</li>
<li>постійні речі — робота, місце проживання: [[I work in IT.]] [[They live in Bratislava.]]</li>
<li>факти й розклади: [[Water boils at 100 degrees.]] [[The shop opens at nine.]]</li></ul>
<p>Слова-підказки: [[every day]], [[usually]], [[on Mondays]], [[at the weekend]].</p>
<h3>Форма: he / she / it + -s</h3>
<div class="tblwrap"><table><tr><th>хто</th><th>форма</th><th>приклад</th></tr>
<tr><td>I / you / we / they</td><td>work</td><td>[[I work from home.]] [[We live in a small town.]]</td></tr>
<tr><td>he / she / it</td><td>work<b>s</b></td><td>[[She work<b>s</b> in a bank.]] [[It start<b>s</b> at nine.]]</td></tr></table></div>
<div class="note"><b>⚠️ Найчастіша помилка — загубити -s.</b> В українській змінюється закінчення в кожній особі (працюю, працює, працюють), а в англійській -s з'являється лише в одній — тому його легко забути. Дивіться на підмет: he, she, it, [[my brother]], [[Anna]], [[the office]] — дієслово з -s: [[My brother lives in Kyiv.]]</div>
<div class="tblwrap"><table><tr><th>правопис</th><th>приклади</th></tr>
<tr><td>більшість дієслів: <b>+s</b></td><td>[[works]], [[gets]], [[cooks]], [[plays]]</td></tr>
<tr><td>після -s, -sh, -ch, -x, -o: <b>+es</b></td><td>[[watches]], [[finishes]], [[fixes]], [[goes]], [[does]]</td></tr>
<tr><td>приголосна + y: <b>y → ies</b></td><td>[[study — studies]], [[try — tries]]; але голосна + y: [[play — plays]], [[buy — buys]]</td></tr>
<tr><td>неправильне</td><td>[[have — has]]</td></tr></table></div>
<div class="tip"><b>Вимова -s — як у множині:</b> [s] — [[works]], [[gets]]; [z] — [[lives]], [[plays]], [[goes]]; [ɪz] — [[watches]], [[finishes]], [[uses]]. Особливі: [[does]] [dʌz], [[says]] [sez].</div>
<h3>Заперечення: don't / doesn't + дієслово без -s</h3>
<div class="tblwrap"><table><tr><th>хто</th><th>заперечення</th><th>приклад</th></tr>
<tr><td>I / you / we / they</td><td><b>don't</b> (do not) + work</td><td>[[I don't work on Fridays.]]</td></tr>
<tr><td>he / she / it</td><td><b>doesn't</b> (does not) + work</td><td>[[She doesn't eat meat.]]</td></tr></table></div>
<div class="note"><b>⚠️ -s «переходить» у does.</b> [[He doesn't work.]] — правильно; «He doesn't works» — ні. Після don't / doesn't дієслово завжди в базовій формі.</div>
<h3>Питання: Do / Does…?</h3>
<p>[[Do you work from home?]] — [[Yes, I do.]] / [[No, I don't.]]<br>
[[Does she speak English?]] — [[Yes, she does.]] / [[No, she doesn't.]]</p>
<p>З питальним словом порядок такий: <b>питальне слово + do / does + підмет + дієслово</b>: [[Where do you live?]] [[When does the shop open?]] [[How do you get to work?]]</p>
<div class="note"><b>⚠️ do — лише для звичайних дієслів.</b> З to be питання будують без do: [[Are you tired?]], але [[Do you work?]] Не «Do you are…?» і не «Are you work?». І в питанні знову без -s: [[Does he like it?]], а не «Does he likes».</div>
<div class="tip"><b>[[What do you do?]]</b> — це не «що ти робиш (зараз)», а «ким ти працюєш». Відповідь: [[I'm a nurse.]] або [[I work in sales.]]</div>
<h3>Як часто: always, usually, often, sometimes, rarely, never</h3>
<div class="tblwrap"><table><tr><th>слово</th><th>як часто</th></tr>
<tr><td>[[always]] — завжди</td><td>100%</td></tr>
<tr><td>[[usually]] — зазвичай</td><td>≈ 90%</td></tr>
<tr><td>[[often]] — часто</td><td>≈ 70%</td></tr>
<tr><td>[[sometimes]] — іноді</td><td>≈ 50%</td></tr>
<tr><td>[[rarely]] — рідко</td><td>≈ 10%</td></tr>
<tr><td>[[never]] — ніколи</td><td>0%</td></tr></table></div>
<p>Місце в реченні: <b>перед основним дієсловом</b>, але <b>після to be</b>: [[I usually get up at seven.]] [[She never drinks coffee.]] — [[He is always late.]] [[I'm never tired in the morning.]] Слово sometimes можна поставити й на початок: [[Sometimes I work at the weekend.]]</p>
<div class="note"><b>⚠️ Без подвійного заперечення.</b> Українською «Я <b>ніколи не</b> снідаю» — два заперечні слова. Англійською never уже заперечне: [[I never have breakfast.]] Не «I don't never…».</div>
<h3>Мій день</h3>
<p>[[I get up at seven.]] [[I have breakfast and go to work at eight.]] [[I start work at nine and have lunch at one.]] [[I finish work at six and come home.]] [[In the evening I cook dinner, and I go to bed at eleven.]]</p>
<div class="note"><b>⚠️ Сталі вирази.</b> [[go to work]], [[go to bed]] — без the; [[come home]], [[go home]] — без to (не «go to home»). У [[have breakfast]], [[have lunch]], [[have dinner]] дієслово have означає «їсти», а не «мати».</div>
<div class="tip"><b>UK / US:</b> на вихідних — [[at the weekend]] (UK) / [[on the weekend]] (US). Митися в душі — [[have a shower]] (UK) / [[take a shower]] (US і UK).</div>`,
  vocab: [['get up', 'вставати (з ліжка)'], ['have breakfast', 'снідати'], ['have lunch', 'обідати'], ['cook dinner', 'готувати вечерю'],
    ['go to work', 'іти / їхати на роботу', 'без the'], ['start work', 'починати роботу'], ['finish work', 'закінчувати роботу'], ['come home', 'приходити додому', 'без to'],
    ['go to bed', 'лягати спати'], ['take a shower', 'митися в душі', 'UK також have a shower'], ['live', 'жити, мешкати'], ['study', 'вчитися; вивчати', 'she studies'],
    ['watch TV', 'дивитися телевізор'], ['every day', 'щодня', 'everyday разом — «повсякденний»'], ['at the weekend', 'на вихідних', 'US: on the weekend'],
    ['always', 'завжди'], ['usually', 'зазвичай', '[ˈjuːʒuəli]'], ['often', 'часто', 't зазвичай не вимовляють'], ['sometimes', 'іноді'], ['rarely', 'рідко'],
    ['never', 'ніколи', 'уже заперечне: без not'], ['early / late', 'рано / пізно'], ['What do you do?', 'Ким ви працюєте?']],
  ex: [
    { t: 'i', q: 'Поставте дієслово в правильну форму: She ___ in a bank. (work)', a: 'works', e: 'Підмет she — дієслово з -s: [[She works in a bank.]]' },
    { t: 'i', q: 'Поставте дієслово в правильну форму: He ___ to work by bus. (go)', a: 'goes', e: 'Після -o додаємо -es: [[He goes to work by bus.]]' },
    { t: 'i', q: 'Поставте дієслово в правильну форму: My son ___ English at school. (study)', a: 'studies', e: 'Приголосна + y → ies: [[My son studies English at school.]]' },
    { t: 'i', q: 'Вставте don\'t або doesn\'t: My husband ___ cook.', a: 'doesn\'t', e: 'My husband = he, тож doesn\'t: [[My husband doesn\'t cook.]]' },
    { t: 'i', q: 'Вставте Do або Does: ___ your brother live in Kyiv?', a: 'Does', e: 'your brother = he, тож does, а дієслово — без -s: [[Does your brother live in Kyiv?]]' },
    { t: 'c', q: '«Він не працює по понеділках.»', o: ['He doesn\'t work on Mondays.', 'He doesn\'t works on Mondays.', 'He don\'t work on Mondays.'], e: '-s «переходить» у doesn\'t, а дієслово — без -s: [[He doesn\'t work on Mondays.]]' },
    { t: 'c', q: '«Де ти працюєш?»', o: ['Where do you work?', 'Where you work?', 'Where are you work?'], e: 'Питальне слово + do + підмет + дієслово: [[Where do you work?]]' },
    { t: 'c', q: '«Ким вона працює?»', o: ['What does she do?', 'What does she does?', 'What is she do?'], e: 'Питання про професію — [[What does she do?]] Після does дієслово без -s.' },
    { t: 'c', q: 'Коротка відповідь: «Does he speak English?» — «Так.»', o: ['Yes, he does.', 'Yes, he speaks.', 'Yes, he is.'], e: 'Коротка відповідь повторює допоміжне дієслово: [[Yes, he does.]] / [[No, he doesn\'t.]]' },
    { t: 'c', q: '«Я ніколи не снідаю.»', o: ['I never have breakfast.', 'I don\'t never have breakfast.', 'I never don\'t have breakfast.'], e: 'never уже заперечне, друге заперечення не потрібне: [[I never have breakfast.]]' },
    { t: 'o', q: 'Вона зазвичай встає о сьомій.', a: ['She usually gets up at seven.', 'Usually she gets up at seven.'] },
    { t: 'o', q: 'Увечері він завжди втомлений.', a: ['He is always tired in the evening.', 'In the evening he is always tired.'] },
    { t: 'o', q: 'Ти працюєш на вихідних? (британський варіант)', a: 'Do you work at the weekend?' },
    { t: 'l', a: ['I get up at seven every day.', 'I get up at 7 every day.'], tr: 'Я встаю о сьомій щодня.' },
    { t: 'l', a: 'She doesn\'t work on Fridays.', tr: 'Вона не працює по п\'ятницях.' }
  ],
  say: [['I get up at seven and have breakfast.', 'Я встаю о сьомій і снідаю.'], ['What do you do? — I work in IT.', 'Ким ви працюєте? — Я працюю в IT.'],
    ['He doesn\'t drink coffee.', 'Він не п\'є кави.'], ['Do you work from home? — Yes, I usually do.', 'Ви працюєте з дому? — Так, зазвичай.'],
    ['I never cook dinner at the weekend.', 'На вихідних я ніколи не готую вечерю.'], ['How often do you go to the gym?', 'Як часто ти ходиш у спортзал?']],
  speak: ['Опишіть свій звичайний робочий день у 6–8 реченнях від ранку до вечора (I get up at… Then I… I usually… I never…). Потім розкажіть те саме про когось із близьких (My husband gets up at…) і стежте за -s. Запишіть себе й послухайте.',
    'Дайте відповідь уголос повними реченнями: What do you do? Where do you work? What time do you get up? How often do you cook? What do you do at the weekend?'],
  mission: 'Поставте другові чи колезі англійською (усно або в чаті) 3–4 питання про його день: [[What time do you get up?]] [[Do you work from home?]] [[What do you do at the weekend?]] Запишіть відповіді в третій особі, не забуваючи -s: [[Mark gets up at six.]]'
},
{
  id: 'a1-5', stage: 'a1', num: 'A1.5', title: 'There is / there are; прийменники місця; дім і місто', dur: '1 тиждень',
  goals: ['казати, що де є: There is… / There are…', 'питати: Is there…? Are there any…?', 'описувати, де що розташоване: in, on, under, next to, opposite…', 'описати свою квартиру й район'],
  theory: `
<h3>There is / there are — «є, знаходиться»</h3>
<p>Коли повідомляємо, що <b>щось є</b> в певному місці (часто — вперше про це кажемо), речення починається з [[there is]] (однина) або [[there are]] (множина), а місце стоїть у кінці: [[There is a table in the room.]] — У кімнаті є стіл. [[There are two bedrooms in my flat.]] — У моїй квартирі дві спальні.</p>
<div class="note"><b>⚠️ Інший порядок слів.</b> Українською починаємо з місця: «У кімнаті є стіл». Англійською — з there is: [[There is a table in the room.]], а не «In the room is a table».</div>
<div class="tblwrap"><table><tr><th></th><th>однина</th><th>множина</th></tr>
<tr><td>+</td><td>[[There is a bank.]] / [[There's a bank.]]</td><td>[[There are two banks.]]</td></tr>
<tr><td>–</td><td>[[There isn't a bank.]] / [[There's no bank.]]</td><td>[[There aren't any banks.]]</td></tr>
<tr><td>?</td><td>[[Is there a bank near here?]]</td><td>[[Are there any banks near here?]]</td></tr>
<tr><td>коротка відповідь</td><td>[[Yes, there is.]] / [[No, there isn't.]]</td><td>[[Yes, there are.]] / [[No, there aren't.]]</td></tr></table></div>
<div class="tip"><b>There's</b> [ðeəz] — звичайна розмовна форма. There are на письмі не скорочують.</div>
<div class="note"><b>⚠️ There is ≠ It is.</b> There is повідомляє, що щось <i>є</i>; it is описує те, про що вже йде мова: [[There's a cafe near my house. It's very nice.]] — Біля мого дому є кав'ярня. Вона дуже гарна.</div>
<h3>some і any</h3>
<ul><li><b>some</b> — у стверджувальних реченнях, «кілька, трохи»: [[There are some chairs in the kitchen.]] [[There's some milk in the fridge.]]</li>
<li><b>any</b> — у запереченнях і питаннях: [[There aren't any shops in my street.]] [[Are there any cafes near here?]]</li>
<li>з одниною злічуваних іменників — a / an: [[Is there a lift?]] (US [[Is there an elevator?]])</li></ul>
<div class="good">Часто some / any українською взагалі не перекладаються: «Тут є кав'ярні?» — [[Are there any cafes here?]]</div>
<h3>Прийменники місця</h3>
<div class="tblwrap"><table><tr><th>прийменник</th><th>значення</th><th>приклад</th></tr>
<tr><td>[[in]]</td><td>у, всередині</td><td>[[in the box]], [[in the kitchen]]</td></tr>
<tr><td>[[on]]</td><td>на (поверхні)</td><td>[[on the table]], [[on the wall]]</td></tr>
<tr><td>[[under]]</td><td>під</td><td>[[under the bed]]</td></tr>
<tr><td>[[next to]]</td><td>поруч із</td><td>[[next to the window]]</td></tr>
<tr><td>[[between]]</td><td>між</td><td>[[between the bank and the cafe]]</td></tr>
<tr><td>[[opposite]]</td><td>навпроти</td><td>[[opposite the station]] (US також [[across from the station]])</td></tr>
<tr><td>[[behind]]</td><td>за, позаду</td><td>[[behind the door]]</td></tr>
<tr><td>[[in front of]]</td><td>перед</td><td>[[in front of the house]]</td></tr>
<tr><td>[[near]]</td><td>біля, недалеко від</td><td>[[near the park]]</td></tr></table></div>
<div class="note"><b>⚠️ Пастки з прийменниками.</b> [[next to]] — завжди з to; [[in front of]] — з of; [[opposite]] — без жодного прийменника (не «opposite of»). [[in front of]] — це «перед», а «навпроти, через дорогу» — [[opposite]]. «На зупинці», «на вокзалі» — [[at the bus stop]], [[at the station]]: at вживаємо, коли місце — як точка на мапі.</div>
<h3>Дім: кімнати й меблі</h3>
<p>Квартира — [[flat]] (UK) / [[apartment]] (US), будинок — [[house]]. Кімнати: [[living room]] — вітальня, [[bedroom]] — спальня, [[kitchen]] — кухня, [[bathroom]] — ванна кімната, [[hall]] — передпокій. Меблі: [[sofa]] — диван, [[armchair]] — крісло, [[bed]] — ліжко, [[wardrobe]] (US [[closet]]) — шафа, [[shelf]] — полиця, [[desk]] — письмовий стіл, [[fridge]] — холодильник.</p>
<p>[[There are three rooms in my flat: a living room, a bedroom and a small kitchen.]] [[The sofa is opposite the TV.]] [[My desk is next to the window.]]</p>
<div class="note"><b>⚠️ [[furniture]] — незлічуване:</b> [[some furniture]], [[a lot of furniture]] — без -s і без a. Один предмет — [[a piece of furniture]].</div>
<h3>Місто</h3>
<p>[[bank]] — банк, [[pharmacy]] / [[chemist's]] (UK) — аптека, [[supermarket]] — супермаркет, [[bus stop]] — автобусна зупинка, [[train station]] — вокзал, [[post office]] — пошта, [[park]] — парк, [[hospital]] — лікарня, [[shop]] (US [[store]]) — магазин.</p>
<p>[[Excuse me, is there a pharmacy near here?]] — [[Yes, there's one opposite the bank.]] / [[Sorry, I'm not from here.]]</p>
<div class="good"><b>Is there a… near here?</b> — універсальна фраза в незнайомому місті: [[Is there a supermarket near here?]] [[Is there a bus stop near here?]]</div>`,
  vocab: [['there is / there are', 'є, знаходиться (однина / множина)'], ['flat / apartment', 'квартира', 'flat — UK, apartment — US'], ['living room', 'вітальня'],
    ['bedroom', 'спальня'], ['kitchen', 'кухня'], ['bathroom', 'ванна кімната', 'US: також туалет'], ['sofa', 'диван'], ['bed', 'ліжко'],
    ['wardrobe', 'шафа для одягу', 'US: closet'], ['shelf', 'полиця', 'множина: shelves'], ['fridge', 'холодильник'], ['in / on / under', 'у / на / під'],
    ['next to', 'поруч із'], ['between', 'між'], ['opposite', 'навпроти', 'US також across from'], ['behind', 'за, позаду'], ['in front of', 'перед'],
    ['near', 'біля, недалеко від'], ['pharmacy / chemist\'s', 'аптека', 'chemist\'s — UK; US також drugstore'], ['supermarket', 'супермаркет'],
    ['bus stop', 'автобусна зупинка', 'at the bus stop'], ['train station', 'вокзал', 'at the station'], ['post office', 'пошта (відділення)'], ['bank', 'банк'], ['hospital', 'лікарня']],
  ex: [
    { t: 'i', q: 'Вставте is або are: There ___ two bedrooms in my flat.', a: 'are', e: 'Множина — there are: [[There are two bedrooms in my flat.]]' },
    { t: 'i', q: 'Вставте is або are: There ___ a sofa in the living room.', a: 'is', e: 'Однина — there is: [[There is a sofa in the living room.]]' },
    { t: 'c', q: '«У кімнаті є стіл.»', o: ['There is a table in the room.', 'In the room is a table.', 'It is a table in the room.'], e: 'Англійською починаємо з there is, а місце — в кінці: [[There is a table in the room.]]' },
    { t: 'c', q: '«На кухні немає стільців.»', o: ['There aren\'t any chairs in the kitchen.', 'There isn\'t any chairs in the kitchen.', 'There aren\'t some chairs in the kitchen.'], e: 'Множина — aren\'t, у запереченні — any: [[There aren\'t any chairs in the kitchen.]]' },
    { t: 'i', q: 'Вставте some або any: Are there ___ cafes in your street?', a: 'any', e: 'У питаннях — any: [[Are there any cafes in your street?]]' },
    { t: 'i', q: 'Вставте some або any: There are ___ chairs in the kitchen.', a: 'some', e: 'У стверджувальному реченні — some: [[There are some chairs in the kitchen.]]' },
    { t: 'c', q: 'Відповідь на «Are there any cafes near here?» — «Ні.»', o: ['No, there aren\'t.', 'No, there isn\'t.', 'No, they aren\'t.'], e: 'Питали з are there — відповідаємо так само: [[No, there aren\'t.]]' },
    { t: 'c', q: '«Кіт — під ліжком.»', o: ['The cat is under the bed.', 'The cat is on the bed.', 'The cat is behind the bed.'], e: 'Під — [[under]], на — [[on]], за — [[behind]].' },
    { t: 'c', q: '«Банк — навпроти пошти.»', o: ['The bank is opposite the post office.', 'The bank is next the post office.', 'The bank is in front the post office.'], e: '[[opposite]] — без прийменника; але [[next to]] і [[in front of]].' },
    { t: 'i', q: 'Вставте прийменник: The pharmacy is ___ the bank and the supermarket. (між)', a: 'between', e: 'Між двома місцями — [[between the bank and the supermarket]].' },
    { t: 'i', q: 'Допишіть прийменник: The bus stop is in ___ of the supermarket. (перед)', a: 'front', e: '«Перед» — [[in front of]]: [[The bus stop is in front of the supermarket.]]' },
    { t: 'o', q: 'Біля мого будинку є парк.', a: ['There is a park near my house.', 'Near my house there is a park.'] },
    { t: 'o', q: 'Тут поблизу є автобусна зупинка?', a: 'Is there a bus stop near here?' },
    { t: 'l', a: 'There\'s a supermarket next to the station.', tr: 'Поруч із вокзалом є супермаркет.' },
    { t: 'l', a: 'Are there any shops near here?', tr: 'Тут поблизу є магазини?' }
  ],
  say: [['Excuse me, is there a pharmacy near here?', 'Перепрошую, тут поблизу є аптека?'], ['Yes, there\'s one opposite the bank.', 'Так, одна є навпроти банку.'],
    ['There are two bedrooms and a big kitchen in my flat.', 'У моїй квартирі дві спальні й велика кухня.'], ['The bus stop is in front of the supermarket.', 'Автобусна зупинка — перед супермаркетом.'],
    ['There isn\'t a lift, but there\'s a big balcony.', 'Ліфта немає, зате є великий балкон.'], ['Where are my keys? — They\'re on the shelf, next to the TV.', 'Де мої ключі? — На полиці, поруч із телевізором.']],
  speak: ['Опишіть свою квартиру чи будинок у 6–8 реченнях: скільки кімнат, що є в кожній, де що стоїть (There are… In the kitchen there\'s… The sofa is next to…). Запишіть себе й послухайте.',
    'Опишіть свою вулицю чи район: що є поруч із вашим домом, а чого немає (There\'s a… opposite… There aren\'t any…).'],
  mission: 'Уявіть, що здаєте свою квартиру іноземцеві: напишіть англійською коротке оголошення з 5–6 речень — які є кімнати й меблі і що є поруч ([[There are two bedrooms.]] [[There\'s a bus stop opposite the house.]]). Прочитайте його вголос або надішліть другові.'
},
{
  id: 'a1-6', stage: 'a1', num: 'A1.6', title: 'Числа, ціни, магазин: How much is it?', dur: '1 тиждень',
  goals: ['називати й розуміти на слух числа до мільйона', 'розрізняти на слух 13 і 30, 14 і 40', 'читати ціни в £, $ і €', 'купувати: питати ціну, просити, платити карткою чи готівкою'],
  theory: `
<h3>Числа 0–100</h3>
<div class="tblwrap"><table><tr><th>0–9</th><th>10–19</th><th>десятки</th></tr>
<tr><td>0 [[zero]]</td><td>10 [[ten]]</td><td>20 [[twenty]]</td></tr>
<tr><td>1 [[one]]</td><td>11 [[eleven]]</td><td>30 [[thirty]]</td></tr>
<tr><td>2 [[two]]</td><td>12 [[twelve]]</td><td>40 [[forty]]</td></tr>
<tr><td>3 [[three]]</td><td>13 [[thirteen]]</td><td>50 [[fifty]]</td></tr>
<tr><td>4 [[four]]</td><td>14 [[fourteen]]</td><td>60 [[sixty]]</td></tr>
<tr><td>5 [[five]]</td><td>15 [[fifteen]]</td><td>70 [[seventy]]</td></tr>
<tr><td>6 [[six]]</td><td>16 [[sixteen]]</td><td>80 [[eighty]]</td></tr>
<tr><td>7 [[seven]]</td><td>17 [[seventeen]]</td><td>90 [[ninety]]</td></tr>
<tr><td>8 [[eight]]</td><td>18 [[eighteen]]</td><td>100 [[a hundred]]</td></tr>
<tr><td>9 [[nine]]</td><td>19 [[nineteen]]</td><td>1,000 [[a thousand]]</td></tr></table></div>
<div class="tip"><b>Нуль:</b> [[zero]]; у номерах телефонів, кімнат і рейсів його часто читають як букву O — [[oh]]: [[room two oh five]] — кімната 205.</div>
<h3>13 чи 30? Слухайте наголос!</h3>
<div class="tblwrap"><table><tr><th>-teen: наголос у кінці, довге [iː]</th><th>-ty: наголос на початку, коротке [i]</th></tr>
<tr><td>13 [[thirteen]]</td><td>30 [[thirty]]</td></tr>
<tr><td>14 [[fourteen]]</td><td>40 [[forty]]</td></tr>
<tr><td>15 [[fifteen]]</td><td>50 [[fifty]]</td></tr>
<tr><td>16 [[sixteen]]</td><td>60 [[sixty]]</td></tr>
<tr><td>17 [[seventeen]]</td><td>70 [[seventy]]</td></tr>
<tr><td>18 [[eighteen]]</td><td>80 [[eighty]]</td></tr>
<tr><td>19 [[nineteen]]</td><td>90 [[ninety]]</td></tr></table></div>
<p>thir<b>TEEN</b> [ˌθɜːˈtiːn] — <b>THIR</b>ty [ˈθɜːti]. Якщо не розчули, перепитайте: [[Sorry, fifteen or fifty?]] — [[Fifteen. One five.]]</p>
<div class="note"><b>⚠️ Правопис:</b> [[four]], [[fourteen]], але [[forty]] — без u; [[five]], але [[fifteen]], [[fifty]]; eight + teen = [[eighteen]] — з одним t; [[nine]] — [[ninety]] (з e).</div>
<h3>Від 21 до мільйона</h3>
<ul><li>десятки й одиниці — через дефіс: [[twenty-one]], [[thirty-five]], [[ninety-nine]];</li>
<li>сотні: [[a hundred]] / [[one hundred]], [[two hundred]], [[one hundred and five]], [[three hundred and forty-two]];</li>
<li>тисячі й мільйони: [[a thousand]], [[two thousand five hundred]], [[ten thousand]], [[a million]].</li></ul>
<div class="tip"><b>UK / US:</b> британці кажуть and після hundred: [[one hundred and five]]; американці часто без нього: [[one hundred five]]. Правильно обидва.</div>
<div class="note"><b>⚠️ hundred, thousand, million після числа — без -s:</b> [[three hundred people]], [[five thousand euros]] (не «five thousands»). З -s — лише «сотні, тисячі» без числа: [[hundreds of people]].</div>
<div class="note"><b>⚠️ Кома й крапка — навпаки.</b> В англійській тисячі відділяють <b>комою</b>: [[1,500|one thousand five hundred]], [[25,000|twenty-five thousand]], а дробову частину — <b>крапкою</b>, яку читають як point: [[2.5|two point five]], [[0.75|zero point seven five]]. В українській навпаки: 1 500 і 2,5.</div>
<p>Тренуйте числа на слух у розділі <a href="#/drill">🔢 Тренажер чисел</a> — там вправи без кінця.</p>
<h3>Ціни: £, $ і €</h3>
<div class="tblwrap"><table><tr><th>пишуть</th><th>кажуть</th></tr>
<tr><td>£3.49</td><td>[[three pounds forty-nine]] або коротко [[three forty-nine]]</td></tr>
<tr><td>80p</td><td>[[eighty p]] або [[eighty pence]]</td></tr>
<tr><td>$12.99</td><td>[[twelve dollars and ninety-nine cents]] або [[twelve ninety-nine]]</td></tr>
<tr><td>€5.50</td><td>[[five euros fifty]] або [[five fifty]]</td></tr>
<tr><td>$1,200</td><td>[[one thousand two hundred dollars]] або [[twelve hundred dollars]]</td></tr></table></div>
<div class="note"><b>⚠️ Знак валюти пишуть перед числом, а кажуть після:</b> £5 — [[five pounds]], $10 — [[ten dollars]]. У цінах слова point немає: £3.49 — не «three point four nine».</div>
<div class="tip">Британська «копійка»: одна — [[a penny]], кілька — [[pence]], у розмові просто [[p]] [piː]: [[50p|fifty p]]. Розмовне слово для фунта — [[quid]], без -s: [[five quid]].</div>
<h3>How much? How many?</h3>
<ul><li><b>How much is…?</b> — скільки коштує (однина): [[How much is this bag?]] [[How much is it?]]</li>
<li><b>How much are…?</b> — скільки коштують (множина): [[How much are these shoes?]] [[How much are the tickets?]]</li>
<li><b>How many…?</b> — скільки (штук) з множиною злічуваних: [[How many tickets?]] [[How many people are there?]]; <b>How much…?</b> — з незлічуваними: [[How much water?]] [[How much time do we have?]]</li></ul>
<p>Відповідь: [[It's five pounds.]] [[They're two euros each.]] — По два євро за штуку.</p>
<h3>У магазині й кав'ярні</h3>
<div class="tblwrap"><table><tr><th>продавець</th><th>ви</th></tr>
<tr><td>[[Hi, can I help you?]] — Вам допомогти?</td><td>[[I'm just looking, thanks.]] — Я просто дивлюся, дякую.</td></tr>
<tr><td>[[What can I get you?]] — Що вам подати?</td><td>[[Can I have a coffee, please?]] / [[I'd like a coffee, please.]]</td></tr>
<tr><td>[[Anything else?]] — Ще щось?</td><td>[[That's all, thanks.]] — Це все, дякую.</td></tr>
<tr><td>[[That's six fifty, please.]] — З вас шість п'ятдесят.</td><td>[[Do you take cards?]] / [[Can I pay by card?]] — Можна карткою?</td></tr>
<tr><td>[[Cash or card?]] — Готівкою чи карткою?</td><td>[[By card, please.]] / [[In cash.]]</td></tr>
<tr><td>[[Here's your change and your receipt.]] — Ваша решта й чек.</td><td>[[Thank you!]]</td></tr></table></div>
<div class="note"><b>⚠️ «Дайте мені…» звучить грубо.</b> Не «Give me a coffee», а [[Can I have a coffee, please?]] чи [[I'd like a coffee, please.]] І не забувайте please — без нього прохання звучить як наказ.</div>
<p>Корисні слова: [[cheap]] — дешевий, [[expensive]] — дорогий, [[discount]] — знижка, [[sale]] — розпродаж ([[in the sale]] UK / [[on sale]] US), [[size]] — розмір: [[Do you have this in a smaller size?]] Коли щось подаєте: [[Here you are.]] — Ось, прошу.</p>
<div class="tip"><b>Вимова:</b> [[receipt]] [rɪˈsiːt] — p не читається; [[euros]] [ˈjʊərəʊz] — на початку «ю», а не «е».</div>`,
  vocab: [['hundred', 'сто, сотня', 'two hundred — без -s'], ['thousand', 'тисяча', 'пишуть з комою: 1,000'], ['million', 'мільйон'], ['price', 'ціна'],
    ['How much is it?', 'Скільки це коштує?'], ['How many…?', 'Скільки? (про злічуване)'], ['pound / penny', 'фунт / пенні', '£; множина від penny — pence, розмовно p'],
    ['dollar / cent', 'долар / цент'], ['cheap', 'дешевий'], ['expensive', 'дорогий'], ['receipt', 'чек', '[rɪˈsiːt], p не читається'], ['change', 'решта; дрібні гроші'],
    ['discount', 'знижка'], ['sale', 'розпродаж', 'UK in the sale, US on sale'], ['size', 'розмір'], ['card / cash', 'картка / готівка', 'by card, in cash'],
    ['pay', 'платити', 'pay by card'], ['each', 'кожен; за штуку', 'two euros each'], ['shop / store', 'магазин', 'store — US'], ['Can I have…?', 'Можна мені…?'],
    ['I\'d like…', 'Я б хотів / хотіла…', 'I\'d = I would'], ['Anything else?', 'Ще щось?'], ['That\'s all, thanks.', 'Це все, дякую.'],
    ['Here you are.', 'Ось, прошу. (коли щось подаєте)'], ['Do you take cards?', 'Ви приймаєте картки?']],
  ex: [
    { t: 'g', g: 'numListen', min: 0, max: 20 },
    { t: 'g', g: 'teenListen' },
    { t: 'g', g: 'numListen', min: 20, max: 100 },
    { t: 'g', g: 'priceListen' },
    { t: 'g', g: 'numWords', min: 20, max: 99 },
    { t: 'c', q: '«Триста людей»', o: ['three hundred people', 'three hundreds people', 'three hundreds of people'], e: 'Після числа hundred — без -s: [[three hundred people]]. А [[hundreds of people]] — «сотні людей».' },
    { t: 'c', q: 'Як прочитати ціну £4.50?', o: ['four pounds fifty', 'four point fifty pounds', 'fifty four pounds'], e: 'Ціни читають без point: [[four pounds fifty]] або коротко [[four fifty]].' },
    { t: 'c', q: '«Скільки коштують ці яблука?»', o: ['How much are these apples?', 'How much is these apples?', 'How many are these apples?'], e: 'Про ціну — how much; яблука — множина, тож are: [[How much are these apples?]]' },
    { t: 'i', q: 'Вставте much або many: How ___ people are there?', a: 'many', e: 'people — злічуване, у множині: [[How many people are there?]]' },
    { t: 'c', q: 'Як увічливо попросити каву?', o: ['Can I have a coffee, please?', 'Give me a coffee.', 'May I a coffee, please?'], e: '«Дайте мені» звучить грубо. Увічливо: [[Can I have a coffee, please?]] або [[I\'d like a coffee, please.]]' },
    { t: 'c', q: 'Продавець питає «Anything else?». Ви: «Ні, це все, дякую.»', o: ['No, that\'s all, thanks.', 'No, is all, thanks.', 'No, this all, thanks.'], e: 'Сталий вираз: [[That\'s all, thanks.]]' },
    { t: 'i', q: 'Ви просите чек: Can I have the ___, please?', a: 'receipt', e: '[[receipt]] [rɪˈsiːt] — p не читається.' },
    { t: 'o', q: 'Можна оплатити карткою?', a: 'Can I pay by card?' },
    { t: 'o', q: 'Я б хотіла два квитки, будь ласка.', a: 'I\'d like two tickets, please.' },
    { t: 'l', a: 'How much are these shoes?', tr: 'Скільки коштують ці черевики?' },
    { t: 'l', a: 'Here\'s your change and the receipt.', tr: 'Ось ваша решта й чек.' }
  ],
  say: [['How much is it? — It\'s twelve ninety-nine.', 'Скільки це коштує? — Дванадцять дев\'яносто дев\'ять.'], ['Can I have a coffee and a croissant, please?', 'Можна мені каву й круасан, будь ласка?'],
    ['Do you take cards? — Yes, of course.', 'Ви приймаєте картки? — Так, звичайно.'], ['Anything else? — No, that\'s all, thanks.', 'Ще щось? — Ні, це все, дякую.'],
    ['Sorry, fifteen or fifty? — Fifteen. One five.', 'Перепрошую, п\'ятнадцять чи п\'ятдесят? — П\'ятнадцять. Один-п\'ять.'], ['Do you have this in a smaller size?', 'У вас є таке меншого розміру?']],
  speak: ['Візьміть чек або сторінку інтернет-магазину й прочитайте вголос 10 цін і кількостей англійською (£3.49 — three pounds forty-nine, €12.50 — twelve euros fifty, 1,500 — one thousand five hundred). Запишіть себе й послухайте.',
    'Розіграйте вголос діалог у кав\'ярні за обидві сторони: привітання, замовлення двох речей, ціна, оплата карткою, решта й чек.'],
  mission: 'У найближчому магазині чи кав\'ярні подумки «озвучте» покупку англійською: [[Can I have…, please?]] [[How much is it?]] [[Can I pay by card?]] Якщо є нагода, замовте англійською по-справжньому (в аеропорту, готелі, міжнародній кав\'ярні) або відкрийте англомовний інтернет-магазин і прочитайте вголос ціни десяти товарів.'
},
{
  id: 'a1-7', stage: 'a1', num: 'A1.7', title: 'Час, дні, місяці й дати; in, on, at', dur: '1 тиждень',
  goals: ['питати й називати час: half past three, quarter to five', 'називати дні тижня, місяці й пори року', 'казати й писати дати та роки', 'вживати in, on, at з часом'],
  theory: `
<h3>Котра година?</h3>
<p>[[What time is it?]] або [[What's the time?]] (UK) — [[It's three o'clock.]] Час можна сказати двома способами.</p>
<div class="tblwrap"><table><tr><th>час</th><th>традиційно</th><th>як на годиннику</th></tr>
<tr><td>3:00</td><td>[[three o'clock]]</td><td>[[three]]</td></tr>
<tr><td>3:05</td><td>[[five past three]] (US також [[five after three]])</td><td>[[three oh five]]</td></tr>
<tr><td>3:15</td><td>[[quarter past three]]</td><td>[[three fifteen]]</td></tr>
<tr><td>3:30</td><td>[[half past three]]</td><td>[[three thirty]]</td></tr>
<tr><td>3:45</td><td>[[quarter to four]]</td><td>[[three forty-five]]</td></tr>
<tr><td>3:50</td><td>[[ten to four]]</td><td>[[three fifty]]</td></tr></table></div>
<p>До половини — <b>past</b> (після години), після половини — <b>to</b> (до наступної). Якщо хвилин не 5, 10, 20 чи 25, додають minutes: [[seven minutes past two]]. [[o'clock]] — лише для рівних годин: [[It's nine o'clock.]], але [[It's nine thirty.]]</p>
<div class="note"><b>⚠️ «Пів на четверту» — це [[half past three]]</b>, дослівно «пів після третьої»: рахуємо від години, яка вже минула, а не від наступної. Обережно: британське розмовне [[half four]] означає 4:30 (half past four), а не «пів на четверту».</div>
<p><b>a.m.</b> — до полудня, <b>p.m.</b> — після полудня: [[9 a.m.|nine a.m.]] — дев'ята ранку, [[9 p.m.|nine p.m.]] — дев'ята вечора. 24-годинний формат у розмові рідкісний: 18:00 — [[six p.m.]] або [[six in the evening]]. 12:00 — [[noon]] / [[midday]], 0:00 — [[midnight]].</p>
<h3>Дні тижня, місяці, пори року</h3>
<p>[[Monday]], [[Tuesday]], [[Wednesday]], [[Thursday]], [[Friday]], [[Saturday]], [[Sunday]].</p>
<p>[[January]], [[February]], [[March]], [[April]], [[May]], [[June]], [[July]], [[August]], [[September]], [[October]], [[November]], [[December]].</p>
<p>Пори року: [[spring]] — весна, [[summer]] — літо, [[autumn]] (UK) / [[fall]] (US) — осінь, [[winter]] — зима.</p>
<div class="note"><b>⚠️ Дні тижня й місяці — завжди з великої літери</b>, навіть посеред речення: [[on Monday]], [[in March]]. Пори року — з малої: [[in spring]].</div>
<div class="tip"><b>Вимова:</b> [[Wednesday]] [ˈwenzdeɪ] — перша d не читається (≈ «ВЕНЗ-дей»); не плутайте [[Tuesday]] [ˈtjuːzdeɪ] (US [ˈtuːzdeɪ]) і [[Thursday]] [ˈθɜːzdeɪ]; [[February]] [ˈfebruəri]. На календарях скорочують: Mon, Tue, Wed, Thu, Fri, Sat, Sun.</div>
<h3>Порядкові числівники: first, second, third…</h3>
<div class="tblwrap"><table><tr><th>число</th><th>словами</th><th>число</th><th>словами</th></tr>
<tr><td>1st</td><td>[[first]]</td><td>11th</td><td>[[eleventh]]</td></tr>
<tr><td>2nd</td><td>[[second]]</td><td>12th</td><td>[[twelfth]]</td></tr>
<tr><td>3rd</td><td>[[third]]</td><td>13th</td><td>[[thirteenth]]</td></tr>
<tr><td>4th</td><td>[[fourth]]</td><td>20th</td><td>[[twentieth]]</td></tr>
<tr><td>5th</td><td>[[fifth]]</td><td>21st</td><td>[[twenty-first]]</td></tr>
<tr><td>8th</td><td>[[eighth]]</td><td>22nd</td><td>[[twenty-second]]</td></tr>
<tr><td>9th</td><td>[[ninth]]</td><td>31st</td><td>[[thirty-first]]</td></tr></table></div>
<p>Зазвичай додаємо <b>-th</b>: [[sixth]], [[seventh]], [[tenth]]. Особливі: first, second, third; [[fifth]] і [[twelfth]] (ve → f), [[eighth]] (одне t), [[ninth]] (без e); десятки на -ty → <b>-tieth</b>: [[twentieth]], [[thirtieth]]. У складених числах порядковим стає лише останнє слово: [[twenty-first]].</p>
<h3>Дати: як сказати й записати</h3>
<div class="tblwrap"><table><tr><th></th><th>UK</th><th>US</th></tr>
<tr><td>кажуть</td><td>[[the twenty-fourth of August]]</td><td>[[August twenty-fourth]]</td></tr>
<tr><td>пишуть</td><td>24 August 2026 · 24/08/2026</td><td>August 24, 2026 · 08/24/2026</td></tr></table></div>
<div class="good">Як і в українській, дату кажуть <b>порядковим</b> числівником: «перше травня» — [[the first of May]], а не «the one of May».</div>
<div class="note"><b>⚠️ 03/04 — це яка дата?</b> У Британії (і в нас) — 3 квітня, а в США — 4 березня: американці пишуть спершу місяць! Якщо дата важлива (квиток, дедлайн, зустріч), пишіть місяць словом: [[3 April]] або [[April 3]].</div>
<h3>Роки</h3>
<p>Роки до 2000 читають парами: 1990 — [[nineteen ninety]], 1985 — [[nineteen eighty-five]], 1905 — [[nineteen oh five]]. 2000 — [[two thousand]], 2005 — [[two thousand and five]] (US часто [[two thousand five]]). Після 2010 частіше знову парами: 2026 — [[twenty twenty-six]] (можна й [[two thousand and twenty-six]]). [[I was born in 1995.|I was born in nineteen ninety-five.]]</p>
<h3>in, on, at — прийменники часу</h3>
<div class="tblwrap"><table><tr><th></th><th>коли</th><th>приклади</th></tr>
<tr><td><b>at</b></td><td>точний час, ніч, свята</td><td>[[at seven o'clock]], [[at noon]], [[at night]], [[at Christmas]], [[at the weekend]] (UK)</td></tr>
<tr><td><b>on</b></td><td>дні й дати</td><td>[[on Monday]], [[on Fridays]], [[on the 24th of August]], [[on my birthday]], [[on the weekend]] (US)</td></tr>
<tr><td><b>in</b></td><td>частини дня, місяці, пори року, роки</td><td>[[in the morning]], [[in the evening]], [[in May]], [[in summer]], [[in 2026]]</td></tr></table></div>
<div class="tip"><b>Як запам'ятати:</b> at — точка на годиннику, on — клітинка в календарі, in — довший проміжок, «усередині» якого ми перебуваємо.</div>
<div class="note"><b>⚠️ [[in the morning]], [[in the afternoon]], [[in the evening]], але [[at night]].</b> Якщо названо день — on: [[on Monday morning]]. А з [[today]], [[tomorrow]], [[next week]], [[last year]], [[every day]], [[this morning]] прийменника немає: [[See you next Monday!]] (не «on next Monday»).</div>
<p>Тренуйте час, дати й роки на слух у розділі <a href="#/drill">🔢 Тренажер чисел</a>.</p>`,
  vocab: [['What time is it?', 'Котра година?'], ['o\'clock', 'рівно (про годину)', 'five o\'clock — п\'ята рівно'], ['half past', 'пів на (наступну годину)', 'half past three = 3:30'],
    ['quarter past / to', 'чверть на / за чверть', 'quarter to four = 3:45'], ['a.m. / p.m.', 'до полудня / після полудня'], ['noon / midnight', 'полудень / північ'],
    ['Monday', 'понеділок'], ['Tuesday', 'вівторок'], ['Wednesday', 'середа', '[ˈwenzdeɪ]'], ['Thursday', 'четвер'], ['Friday', 'п\'ятниця'], ['Saturday', 'субота'], ['Sunday', 'неділя'],
    ['spring', 'весна'], ['summer', 'літо'], ['autumn / fall', 'осінь', 'fall — US'], ['winter', 'зима'], ['first / second / third', 'перший / другий / третій', '1st, 2nd, 3rd'],
    ['date', 'дата; число'], ['week', 'тиждень'], ['month', 'місяць'], ['year', 'рік'], ['weekend', 'вихідні'], ['birthday', 'день народження'], ['at night', 'уночі']],
  ex: [
    { t: 'g', g: 'timeListen' },
    { t: 'g', g: 'timeWords' },
    { t: 'g', g: 'dateListen' },
    { t: 'g', g: 'dateWords' },
    { t: 'g', g: 'yearListen' },
    { t: 'c', q: 'Котра година: 3:30 («пів на четверту»)?', o: ['half past three', 'half past four', 'half three past'], e: 'Рахуємо від години, яка минула: [[half past three]] = 3:30. Або просто [[three thirty]].' },
    { t: 'c', q: '«За чверть п\'ята» (4:45)', o: ['quarter to five', 'quarter past five', 'quarter to four'], e: 'До п\'ятої лишилося 15 хвилин: [[quarter to five]] або [[four forty-five]].' },
    { t: 'c', q: '«Я працюю вранці, а сплю вночі.»', o: ['I work in the morning and sleep at night.', 'I work at the morning and sleep in the night.', 'I work on the morning and sleep at the night.'], e: '[[in the morning]], [[in the evening]], але [[at night]].' },
    { t: 'c', q: 'Як написати правильно?', o: ['on Friday, the 3rd of March', 'on friday, the 3rd of march', 'on Friday, the 3th of March'], exact: true, e: 'Дні тижня й місяці — з великої літери; 3 — [[third]], тому 3rd.' },
    { t: 'i', q: 'Вставте in, on або at (через кому): ___ May, ___ Monday, ___ 7 o\'clock', a: 'in, on, at', e: 'in — місяці, on — дні, at — точний час: [[in May]], [[on Monday]], [[at seven o\'clock]].' },
    { t: 'i', q: 'Вставте прийменник: What do you do ___ the weekend?', a: ['at', 'on'], e: 'UK: [[at the weekend]], US: [[on the weekend]] — правильно обидва.' },
    { t: 'i', q: 'Напишіть словами порядковий числівник: 12th → ___', a: 'twelfth', exact: true, e: 'twelve → [[twelfth]]: ve змінюється на f.' },
    { t: 'o', q: 'Мій день народження — двадцять четвертого серпня.', a: 'My birthday is on the 24th of August.' },
    { t: 'o', q: 'По неділях магазин зачинений.', a: ['The shop is closed on Sundays.', 'On Sundays the shop is closed.'] },
    { t: 'l', a: ['The meeting is on Wednesday at ten.', 'The meeting is on Wednesday at 10.'], tr: 'Зустріч — у середу о десятій.' },
    { t: 'l', a: 'See you on Friday evening!', tr: 'Побачимося в п\'ятницю ввечері!' }
  ],
  say: [['What time is it? — It\'s half past three.', 'Котра година? — Пів на четверту.'], ['The meeting is on Monday at ten a.m.', 'Зустріч — у понеділок о десятій ранку.'],
    ['My birthday is on the twenty-fourth of August.', 'Мій день народження — двадцять четвертого серпня.'], ['I usually work from home on Fridays.', 'По п\'ятницях я зазвичай працюю з дому.'],
    ['I was born in nineteen ninety-two.', 'Я народився в тисяча дев\'ятсот дев\'яносто другому році.'], ['See you next week!', 'До зустрічі наступного тижня!']],
  speak: ['Розкажіть про свій тиждень: що ви робите в кожен день і о котрій (On Monday I… On Wednesday evening I… At the weekend I…). Називайте час обома способами: at half past eight / at eight thirty.',
    'Назвіть уголос дні народження 4–5 близьких людей: My mother\'s birthday is on the 3rd of March. My son\'s birthday is in July.'],
  mission: 'Змініть мову телефона (або хоча б календаря й годинника) на англійську на тиждень. Щоранку кажіть уголос день, дату й час з екрана: [[It\'s Monday, the ninth of November. It\'s seven fifteen.]] І додайте в календар одну подію англійською: [[Dentist, Thursday, 4:30 p.m.]]'
}
);

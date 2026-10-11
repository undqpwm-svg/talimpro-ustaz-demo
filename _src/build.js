// Сборка сайта на двух языках:
//   _src/pages/*.html     → *.html в корне (русская версия)
//   _src/pages/kk/*.html  → kk/*.html (казахская версия)
// Шапка, меню, подвал и переключатель языка ҚАЗ / РУС подставляются здесь.
// Запуск: node _src/build.js
// В первой строке каждой страницы — JSON с метаданными: <!-- {"title": "...", "description": "...", "nav": "parents"} -->
// В страницах доступны подстановки: {{icon:имя}} — линейная иконка, {{root}} — путь к корню сайта ('' или '../').

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// Линейные иконки (24×24, обводка currentColor). В страницах: {{icon:имя}}
const ICONS = {
	backpack: '<path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M8 22v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M8 10h8"/>',
	users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
	book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
	school: '<path d="M14 22v-4a2 2 0 1 0-4 0v4"/><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/><path d="M18 5v17"/><path d="m4 6 8-4 8 4"/><path d="M6 5v17"/><circle cx="12" cy="9" r="2"/>',
	cap: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/><path d="M22 10v6"/>',
	play: '<rect x="2" y="4" width="20" height="16" rx="4"/><path d="m10 9 5 3-5 3z"/>',
	mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><path d="M12 18v4"/><path d="M8 22h8"/>',
	checklist: '<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',
	bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
	target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
	board: '<path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/><path d="M8 8h5"/><path d="M8 11h8"/>',
	heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
	bookmark: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M8 7h8"/>',
	books: '<path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/>',
	compass: '<circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36z"/>',
	landmark: '<path d="M3 22h18"/><path d="M6 18v-7"/><path d="M10 18v-7"/><path d="M14 18v-7"/><path d="M18 18v-7"/><path d="m12 2 8 5H4z"/>',
	doc: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/>',
	chat: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/>',
	instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
	at: '<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/>',
	globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
};
const icon = (name) => {
	if (!ICONS[name]) throw new Error(`Нет иконки: ${name}`);
	return `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;
};

// Тексты общей части сайта на каждом языке
const LANGS = {
	ru: {
		src: path.join(__dirname, 'pages'),
		out: ROOT,
		root: '',
		nav: ['Школьникам', 'Родителям', 'Учёба за рубежом', 'Учителям', 'Школам', 'О нас', 'Контакты'],
		menu: 'Основное меню',
		home: 'talim.pro — на главную',
		cta: 'Тегін тест',
		tagline: 'Өзіңе сай мамандығыңды табуға көмектесеміз. Профориентация для школьников, родителей и педагогов по всему Казахстану.',
		f1: ['Услуги', 'Бесплатный профтест', 'Консультация и план поступления', 'Каникулярный интенсив', 'Учёба за рубежом'],
		f2: ['Педагогам и школам', 'Курс «Профориентация в школе»', 'Книги для учителей', 'Профориентационный урок для класса'],
		f3: ['Связаться', 'Все контакты'],
		waFooter: 'Сәлеметсіз бе! Хочу узнать подробнее об услугах talim.pro',
		waFloat: 'Сәлеметсіз бе! Пишу с сайта talim.pro',
		waLabel: 'Написать в WhatsApp',
		company: '© 2026 ТОО «Talim.Pro». talim.pro',
		langs: 'Обучение на казахском и русском языках',
	},
	kk: {
		src: path.join(__dirname, 'pages', 'kk'),
		out: path.join(ROOT, 'kk'),
		root: '../',
		nav: ['Оқушыларға', 'Ата-аналарға', 'Шетелде оқу', 'Мұғалімдерге', 'Мектептерге', 'Біз туралы', 'Байланыс'],
		menu: 'Негізгі мәзір',
		home: 'talim.pro — басты бетке',
		cta: 'Тегін тест',
		tagline: 'Өзіңе сай мамандығыңды табуға көмектесеміз. Қазақстан бойынша оқушыларға, ата-аналарға және педагогтерге кәсіптік бағдар.',
		f1: ['Қызметтер', 'Тегін кәсіби тест', 'Кеңес және түсу жоспары', 'Каникулдағы интенсив', 'Шетелде оқу'],
		f2: ['Педагогтер мен мектептерге', '«Мектептегі кәсіптік бағдар» курсы', 'Мұғалімдерге арналған кітаптар', 'Сыныпқа кәсіптік бағдар сабағы'],
		f3: ['Байланыс', 'Барлық байланыстар'],
		waFooter: 'Сәлеметсіз бе! talim.pro қызметтері туралы толығырақ білгім келеді',
		waFloat: 'Сәлеметсіз бе! talim.pro сайтынан жазып отырмын',
		waLabel: 'WhatsApp-қа жазу',
		company: '© 2026 «Talim.Pro» ЖШС. talim.pro',
		langs: 'Қазақ және орыс тілдерінде оқыту',
	},
};

const NAV_KEYS = [
	['students', 'students.html'],
	['parents', 'parents.html'],
	['abroad', 'abroad.html'],
	['teachers', 'teachers.html'],
	['schools', 'schools.html'],
	['about', 'about.html'],
	['contacts', 'contacts.html'],
];

const logo = (t, cls = '') => `<a href="index.html" class="logo ${cls}" aria-label="${t.home}"><b>tal<span class="i">ı</span>m</b><span class="pro">.pro</span></a>`;

// Ссылка на ту же страницу на другом языке
const langSwitch = (lang, file) => {
	const kkHref = lang === 'kk' ? file : `kk/${file}`;
	const ruHref = lang === 'ru' ? file : `../${file}`;
	return `<div class="site-lang" role="group" aria-label="Тіл / Язык">` +
		`<a href="${kkHref}" hreflang="kk" lang="kk"${lang === 'kk' ? ' class="on" aria-current="true"' : ''}>ҚАЗ</a>` +
		`<a href="${ruHref}" hreflang="ru" lang="ru"${lang === 'ru' ? ' class="on" aria-current="true"' : ''}>РУС</a></div>`;
};

const header = (t, lang, file, active) => `
<header class="header">
	<div class="wrap">
		${logo(t)}
		<nav class="nav" aria-label="${t.menu}">
			${NAV_KEYS.map(([key, href], i) => `<a href="${href}"${key === active ? ' class="active"' : ''}>${t.nav[i]}</a>`).join('\n\t\t\t')}
		</nav>
		<div class="header-cta">
			${langSwitch(lang, file)}
			<a href="test.html" class="btn btn-orange btn-sm">${t.cta}</a>
			<button class="burger" aria-label="${t.menu}" aria-expanded="false"><span></span></button>
		</div>
	</div>
</header>`;

const footer = (t) => `
<footer class="footer">
	<div class="wrap">
		<div class="cols">
			<div>
				${logo(t, 'logo-white')}
				<p class="tagline">${t.tagline}</p>
			</div>
			<div>
				<h4>${t.f1[0]}</h4>
				<a href="test.html">${t.f1[1]}</a>
				<a href="parents.html#consult">${t.f1[2]}</a>
				<a href="students.html#intensive">${t.f1[3]}</a>
				<a href="abroad.html">${t.f1[4]}</a>
			</div>
			<div>
				<h4>${t.f2[0]}</h4>
				<a href="teachers.html">${t.f2[1]}</a>
				<a href="teachers.html#books">${t.f2[2]}</a>
				<a href="schools.html">${t.f2[3]}</a>
			</div>
			<div>
				<h4>${t.f3[0]}</h4>
				<a href="#" data-wa="${t.waFooter}">WhatsApp</a>
				<a href="https://www.instagram.com/talim.pro/" target="_blank" rel="noopener">Instagram @talim.pro</a>
				<a href="https://www.threads.net/@talim.pro" target="_blank" rel="noopener">Threads @talim.pro</a>
				<a href="contacts.html">${t.f3[1]}</a>
			</div>
		</div>
		<div class="bottom">
			<span>${t.company}</span>
			<span>${t.langs}</span>
		</div>
	</div>
</footer>
<a class="wa-float" href="#" data-wa="${t.waFloat}" aria-label="${t.waLabel}"></a>`;

const layout = (t, lang, file, meta, body) => {
	const r = t.root;
	const ruUrl = lang === 'ru' ? file : `../${file}`;
	const kkUrl = lang === 'kk' ? file : `kk/${file}`;
	return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${meta.title}</title>
<meta name="description" content="${meta.description}">
<meta name="theme-color" content="#3458F1">
<meta property="og:title" content="${meta.title}">
<meta property="og:description" content="${meta.description}">
<meta property="og:type" content="website">
<meta property="og:locale" content="${lang === 'kk' ? 'kk_KZ' : 'ru_RU'}">
<link rel="alternate" hreflang="ru" href="${ruUrl}">
<link rel="alternate" hreflang="kk" href="${kkUrl}">
<link rel="icon" href="${r}assets/img/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${r}assets/css/site.css">
</head>
<body>
${header(t, lang, file, meta.nav)}
<main>
${body.trim()}
</main>
${footer(t)}
<script src="${r}assets/js/site.js"></script>
${(meta.scripts || []).map((s) => `<script src="${r}assets/js/${s}"></script>`).join('\n')}
</body>
</html>
`;
};

const list = (dir) => fs.readdirSync(dir).filter((f) => f.endsWith('.html')).sort();
const ruFiles = list(LANGS.ru.src);
const kkFiles = list(LANGS.kk.src);
const missing = ruFiles.filter((f) => !kkFiles.includes(f)).concat(kkFiles.filter((f) => !ruFiles.includes(f)));
if (missing.length) throw new Error(`Нет пары на другом языке: ${missing.join(', ')}`);

let count = 0;
for (const [lang, t] of Object.entries(LANGS)) {
	fs.mkdirSync(t.out, { recursive: true });
	for (const file of list(t.src)) {
		const src = fs.readFileSync(path.join(t.src, file), 'utf8');
		const m = src.match(/^<!--\s*(\{[\s\S]*?\})\s*-->/);
		if (!m) throw new Error(`${lang}/${file}: нет метаданных в первой строке`);
		const meta = JSON.parse(m[1]);
		const body = src.slice(m[0].length)
			.replace(/\{\{icon:([a-z]+)\}\}/g, (_, n) => icon(n))
			.replace(/\{\{root\}\}/g, t.root);
		fs.writeFileSync(path.join(t.out, file), layout(t, lang, file, meta, body));
		count++;
	}
}
console.log(`Собрано страниц: ${count}`);

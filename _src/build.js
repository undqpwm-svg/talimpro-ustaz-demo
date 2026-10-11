// Сборка сайта: _src/pages/*.html + общая шапка и подвал → *.html в корне репозитория.
// Запуск: node _src/build.js
// В первой строке каждой страницы — JSON с метаданными: <!-- {"title": "...", "description": "...", "nav": "parents"} -->

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PAGES = path.join(__dirname, 'pages');

const NAV = [
	['students', 'students.html', 'Школьникам'],
	['parents', 'parents.html', 'Родителям'],
	['abroad', 'abroad.html', 'Учёба за рубежом'],
	['teachers', 'teachers.html', 'Учителям'],
	['schools', 'schools.html', 'Школам'],
	['about', 'about.html', 'О нас'],
	['contacts', 'contacts.html', 'Контакты'],
];

const logo = (cls = '') => `<a href="index.html" class="logo ${cls}" aria-label="talim.pro — на главную"><b>tal<span class="i">ı</span>m</b><span class="pro">.pro</span></a>`;

const header = (active) => `
<header class="header">
	<div class="wrap">
		${logo()}
		<nav class="nav" aria-label="Основное меню">
			${NAV.map(([key, href, label]) => `<a href="${href}"${key === active ? ' class="active"' : ''}>${label}</a>`).join('\n\t\t\t')}
		</nav>
		<div class="header-cta">
			<a href="test.html" class="btn btn-orange btn-sm">Тегін тест</a>
			<button class="burger" aria-label="Меню" aria-expanded="false"><span></span></button>
		</div>
	</div>
</header>`;

const footer = `
<footer class="footer">
	<div class="wrap">
		<div class="cols">
			<div>
				${logo('logo-white')}
				<p class="tagline">Өзіңе сай мамандығыңды табуға көмектесеміз. Профориентация для школьников, родителей и педагогов по всему Казахстану.</p>
			</div>
			<div>
				<h4>Услуги</h4>
				<a href="test.html">Бесплатный профтест</a>
				<a href="parents.html#consult">Консультация и план поступления</a>
				<a href="students.html#intensive">Каникулярный интенсив</a>
				<a href="abroad.html">Учёба за рубежом</a>
			</div>
			<div>
				<h4>Педагогам и школам</h4>
				<a href="teachers.html">Курс «Профориентация в школе»</a>
				<a href="teachers.html#books">Книги для учителей</a>
				<a href="schools.html">Профориентационный урок для класса</a>
			</div>
			<div>
				<h4>Связаться</h4>
				<a href="#" data-wa="Сәлеметсіз бе! Хочу узнать подробнее об услугах talim.pro">WhatsApp</a>
				<a href="https://www.instagram.com/talim.pro/" target="_blank" rel="noopener">Instagram @talim.pro</a>
				<a href="https://www.threads.net/@talim.pro" target="_blank" rel="noopener">Threads @talim.pro</a>
				<a href="contacts.html">Все контакты</a>
			</div>
		</div>
		<div class="bottom">
			<span>© 2026 ТОО «Talim.Pro». talim.pro</span>
			<span>Обучение на казахском и русском языках</span>
		</div>
	</div>
</footer>
<a class="wa-float" href="#" data-wa="Сәлеметсіз бе! Пишу с сайта talim.pro" aria-label="Написать в WhatsApp"></a>`;

const layout = (meta, body) => `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${meta.title}</title>
<meta name="description" content="${meta.description}">
<meta name="theme-color" content="#3458F1">
<meta property="og:title" content="${meta.title}">
<meta property="og:description" content="${meta.description}">
<meta property="og:type" content="website">
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/site.css">
</head>
<body>
${header(meta.nav)}
<main>
${body.trim()}
</main>
${footer}
<script src="assets/js/site.js"></script>
${(meta.scripts || []).map((s) => `<script src="assets/js/${s}"></script>`).join('\n')}
</body>
</html>
`;

let count = 0;
for (const file of fs.readdirSync(PAGES).filter((f) => f.endsWith('.html'))) {
	const src = fs.readFileSync(path.join(PAGES, file), 'utf8');
	const m = src.match(/^<!--\s*(\{[\s\S]*?\})\s*-->/);
	if (!m) throw new Error(`${file}: нет метаданных в первой строке`);
	const meta = JSON.parse(m[1]);
	fs.writeFileSync(path.join(ROOT, file), layout(meta, src.slice(m[0].length)));
	count++;
}
console.log(`Собрано страниц: ${count}`);

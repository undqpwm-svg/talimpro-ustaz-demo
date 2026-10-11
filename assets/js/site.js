/* talim.pro — общий скрипт сайта */

// Рабочий номер WhatsApp в международном формате без «+» и пробелов, например '77001234567'.
// Пока номер не указан, кнопки WhatsApp ведут на страницу контактов с формой заявки.
var TALIM_WHATSAPP = '';

function talimWaUrl(text) {
	if (!TALIM_WHATSAPP) {
		return 'contacts.html#form';
	}
	return 'https://wa.me/' + TALIM_WHATSAPP + (text ? '?text=' + encodeURIComponent(text) : '');
}

document.addEventListener('DOMContentLoaded', function () {
	// Мобильное меню
	var burger = document.querySelector('.burger');
	var nav = document.querySelector('.nav');
	if (burger && nav) {
		burger.addEventListener('click', function () {
			var open = nav.classList.toggle('open');
			burger.setAttribute('aria-expanded', open ? 'true' : 'false');
		});
	}

	// Кнопки WhatsApp: <a data-wa="Текст сообщения">
	document.querySelectorAll('[data-wa]').forEach(function (a) {
		a.href = talimWaUrl(a.getAttribute('data-wa'));
		if (TALIM_WHATSAPP) {
			a.target = '_blank';
			a.rel = 'noopener';
		}
	});

	// Форма заявки
	document.querySelectorAll('form[data-lead]').forEach(function (form) {
		form.addEventListener('submit', function (e) {
			e.preventDefault();
			var data = new FormData(form);
			var lines = ['Сәлеметсіз бе! Заявка с сайта talim.pro'];
			data.forEach(function (value, key) {
				if (value && key !== 'consent') {
					var label = form.querySelector('[name="' + key + '"]').getAttribute('data-label') || key;
					lines.push(label + ': ' + value);
				}
			});
			if (TALIM_WHATSAPP) {
				window.open(talimWaUrl(lines.join('\n')), '_blank', 'noopener');
			}
			var ok = form.parentNode.querySelector('.form-ok');
			if (ok) {
				ok.style.display = 'block';
			}
			form.reset();
		});
	});

	// Подставляем тему в форму по ссылке contacts.html?topic=...
	var params = new URLSearchParams(window.location.search);
	var topic = params.get('topic');
	var topicField = document.querySelector('form[data-lead] [name="topic"]');
	if (topic && topicField) {
		topicField.value = topic;
	}
});

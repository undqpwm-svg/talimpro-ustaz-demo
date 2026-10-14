# talim.pro — сайт

**Открыть сайт:** https://undqpwm-svg.github.io/talimpro-ustaz-demo/

Объединённый двуязычный (RU / ҚАЗ) сайт talim.pro: навигатор абитуриента (вузы, колледжи,
профессии, ЕНТ, гранты, учёба за рубежом), бесплатный профтест Климова с переходом в WhatsApp,
разделы для родителей, учителей и школ, услуги и книги.

В этом репозитории лежит **готовая статическая сборка** (папки `ru/`, `kk/`, `_next/`), её
публикует GitHub Pages: Settings → Pages → Deploy from a branch → `main`, `/ (root)`.
Исходники (Next.js) хранятся отдельно, в этих файлах их не правят: сайт пересобирается
из исходников командой `BASE_PATH=/talimpro-ustaz-demo bash scripts/build-static.sh`.

Заявки с форм и результат теста уходят в WhatsApp: +7 707 330 5464.

---

# talim.pro/ustaz — демо

Демо-копия доработок портала на WordPress Playground: тестовый курс и тестовые слушатели, без данных рабочего сайта.

- [Открыть как слушатель](https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/undqpwm-svg/talimpro-ustaz-demo/main/blueprint-student.json) — урок с видео: кнопка завершения активна после 90% просмотра.
- [Открыть как администратор](https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/undqpwm-svg/talimpro-ustaz-demo/main/blueprint-admin.json) — раздел «Сертификаты», курс «(демо)», слушатель «Тестовый Выпускник».

Сайт создаётся в браузере заново при каждом открытии (около минуты) и ничего не сохраняет.

Файлы собираются из приватного репозитория `talimpro-ustaz` (`playground/build.sh`, `playground/make-blueprints.js`).

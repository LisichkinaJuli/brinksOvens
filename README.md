# Кирпичные печи
<p align="left">
  <!-- Style Dictionary -->
  <img src="https://badgen.net" alt="Style Dictionary" />
  <!-- Tokens Studio (Figma) -->
  <img src="https://badgen.net" alt="Tokens Studio" />
  <!-- Node.js -->
  <img src="https://badgen.net" alt="Node.js" />
  <!-- Лицензия -->
  <img src="https://badgen.net" alt="License" />
</p>

brinks Ovens

Design Tokens Build System (Style Dictionary + Tokens Studio)
Данный проект предназначен для автоматизации сборки дизайн-токенов, экспортированных из Figma через плагин Tokens Studio.
Система автоматически обрабатывает JSON-экспорт, разделяет его на отдельные наборы (Sets) и преобразует в готовые к использованию CSS-переменные.
🚀 Как это работает
Источник: Скрипт берет основной файл src/tokens/tokens.json (полный экспорт из Figma).
Разделение: Из файла извлекаются метаданные ($themes, $metadata), а остальные наборы токенов (например, global, light, dark) сохраняются как отдельные файлы в папку src/tokens/build/.
Трансформация: Используется библиотека @tokens-studio/sd-transforms для обработки специфичных форматов (математические выражения, алиасы, тени).
Сборка: Style Dictionary генерирует финальный файл src/tokens/variables.css.
🛠 Установка
Убедитесь, что у вас установлен Node.js (версии 18+).
bash
npm install
Используйте код с осторожностью.

📦 Основные зависимости
style-dictionary: Ядро системы сборки.
@tokens-studio/sd-transforms: Трансформы для поддержки логики Tokens Studio.
fs/promises: Для асинхронной работы с файловой системой.
🏃‍♂️ Запуск сборки
Чтобы запустить процесс обработки и генерации CSS, выполните команду:
bash
node build-tokens.js
Используйте код с осторожностью.

(Замените build-tokens.js на имя вашего файла со скриптом)
📁 Структура проекта
src/tokens/tokens.json — исходный файл экспорта.
src/tokens/build/ — временная папка с разделенными наборами токенов (генерируется автоматически).
src/tokens/variables.css — готовый результат для подключения в ваш проект.
⚙️ Особенности конфигурации
Имя переменных: Используется формат kebab-case (например, --color-primary-main).
Валидация: Скрипт настроен на throw (остановку сборки) при наличии "битых" ссылок (Broken References), что гарантирует корректность CSS.
Игнорирование системных файлов: Процесс автоматически пропускает файлы метаданных плагина, чтобы избежать ошибок парсинга.
💡 Использование в CSS
После успешной сборки просто импортируйте файл в ваш основной CSS:
css
@import "./tokens/variables.css";

.button {
  background-color: var(--colors-button-primary);
}

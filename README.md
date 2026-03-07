# Tasks App — Ежедневник / Task Manager

Полноценное React-приложение для управления задачами, проектами и заметками.

https://silverkain.github.io/TasksApp/

## Технологии

- **Vite** + **React 18**
- **Context API** (TaskContext, ThemeContext)
- **CSS Custom Properties** (светлая / тёмная тема)
- **localStorage** (хранение данных)
- **react-calendar** (виджет календаря)
- Адаптивная верстка (desktop 3-колонки / mobile вкладки)

## Возможности

- 📁 Иерархия проектов и подпроектов (сворачивание / разворачивание)
- ✅ Создание задач с описанием, ссылками, заметками, датой, статусом
- 📅 Задачи на сегодня + просроченные задачи — в левой панели
- 🗓 Календарь с подсвеченными днями — в правой панели
- 📥 Входящие (задачи без проекта) — быстрое добавление и назначение
- 🔍 Поиск по задачам
- 🌙 Светлая / тёмная тема
- 💾 Автосохранение в localStorage
- 📤 Экспорт / импорт данных в JSON

## Запуск

```bash
# Установить зависимости
npm install

# Запустить dev-сервер
npm run dev
```

Откройте http://localhost:5173

## Деплой на GitHub Pages

1. В `vite.config.js` укажите правильный `base`:
   ```js
   base: '/ваш-репозиторий/'
   ```
2. В `package.json` замените `homepage` на URL:
   ```json
   "homepage": "https://username.github.io/Tasks-App"
   ```
3. Выполните деплой:
   ```bash
   npm run deploy
   ```

## Структура проекта

```
src/
├── components/
│   ├── Calendar/        — Виджет календаря
│   ├── CenterPanel/     — Центральная панель
│   ├── Inbox/           — Входящие задачи
│   ├── Layout/          — Основной layout
│   ├── Projects/        — Дерево проектов
│   ├── SearchBar/       — Поиск
│   ├── SidebarLeft/     — Левая панель
│   ├── SidebarRight/    — Правая панель
│   ├── TaskDetails/     — Детали задачи
│   ├── TaskItem/        — Карточка задачи
│   ├── ThemeToggle/     — Переключатель темы
│   └── TodayTasks/      — Задачи на сегодня
├── context/
│   ├── TaskContext.jsx  — Контекст задач и проектов
│   └── ThemeContext.jsx — Контекст темы
├── data/
│   └── seedData.js      — Тестовые данные
├── hooks/
│   └── useTasks.js      — Хук для доступа к задачам
├── models/
│   ├── Task.js          — Модель задачи
│   └── Project.js       — Модель проекта
├── pages/
│   └── MainPage.jsx
├── services/
│   ├── storageService.js  — localStorage
│   └── firebaseService.js — Заглушки Firebase
├── styles/
│   ├── global.css
│   └── variables.css    — CSS variables (light/dark)
└── utils/
    └── dateUtils.js     — Утилиты для работы с датами
```

## Подключение Firebase

В `src/services/firebaseService.js` находятся заглушки. Для активации:
1. Создайте проект в Firebase Console
2. Установите SDK: `npm install firebase`
3. Раскомментируйте код в `firebaseService.js` и добавьте конфиг
4. Замените вызовы `storageService` на `firebaseService` в `TaskContext.jsx`

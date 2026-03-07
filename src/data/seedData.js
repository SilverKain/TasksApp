function localDateStr(offset = 0) {
  const d = new Date(Date.now() + offset * 86400000)
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-')
}
const today = localDateStr(0)
const yesterday = localDateStr(-1)
const tomorrow = localDateStr(1)

export const seedProjects = [
  { id: 'p1', title: 'Рабочий проект', parentId: null },
  { id: 'p1-1', title: 'Дизайн', parentId: 'p1' },
  { id: 'p1-2', title: 'Разработка', parentId: 'p1' },
  { id: 'p2', title: 'Личное', parentId: null },
  { id: 'p2-1', title: 'Здоровье', parentId: 'p2' },
]

export const seedTasks = [
  {
    id: 't1',
    title: 'Сделать макет главной страницы',
    description: 'Создать Figma-макет для главной страницы в соответствии с брендбуком.',
    links: ['https://figma.com', 'https://notion.so'],
    notes: 'Согласовать с PM перед началом.',
    projectId: 'p1-1',
    dueDate: today,
    status: 'in-progress',
    createdAt: new Date().toISOString(),
  },
  {
    id: 't2',
    title: 'Настроить CI/CD pipeline',
    description: 'Настроить GitHub Actions для автоматического деплоя.',
    links: [],
    notes: '',
    projectId: 'p1-2',
    dueDate: tomorrow,
    status: 'todo',
    createdAt: new Date().toISOString(),
  },
  {
    id: 't3',
    title: 'Провести code review',
    description: 'Проверить PR #42 от коллеги.',
    links: ['https://github.com'],
    notes: 'Обратить внимание на типизацию.',
    projectId: 'p1-2',
    dueDate: today,
    status: 'todo',
    createdAt: new Date().toISOString(),
  },
  {
    id: 't4',
    title: 'Запись к врачу',
    description: 'Плановый осмотр.',
    links: [],
    notes: '',
    projectId: 'p2-1',
    dueDate: yesterday,
    status: 'todo',
    createdAt: new Date().toISOString(),
  },
  {
    id: 't5',
    title: 'Купить продукты',
    description: 'Молоко, хлеб, овощи.',
    links: [],
    notes: '',
    projectId: null,
    dueDate: today,
    status: 'todo',
    createdAt: new Date().toISOString(),
  },
  {
    id: 't6',
    title: 'Прочитать книгу по React',
    description: '',
    links: ['https://react.dev'],
    notes: 'Chapter 5-7',
    projectId: null,
    dueDate: null,
    status: 'todo',
    createdAt: new Date().toISOString(),
  },
]

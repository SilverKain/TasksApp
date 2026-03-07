/** Форматирует локальную дату «DD.MM.YYYY» из ISO-строки «YYYY-MM-DD» */
export function formatDate(isoString) {
  if (!isoString) return ''
  // Добавляем T00:00:00 чтобы Date не делал UTC-конвертацию
  const [y, m, d] = isoString.slice(0, 10).split('-')
  return `${d}.${m}.${y}`
}

/** Возвращает сегодняшнюю дату в формате «YYYY-MM-DD» по локальному времени */
export function localToday() {
  const now = new Date()
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-')
}

/** Переводит Date-объект в «YYYY-MM-DD» по локальному времени */
export function dateToLocalString(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-')
}

export function isToday(isoString) {
  if (!isoString) return false
  return isoString.slice(0, 10) === localToday()
}

export function isOverdue(isoString) {
  if (!isoString) return false
  return isoString.slice(0, 10) < localToday()
}

export function toDateInputValue(isoString) {
  if (!isoString) return ''
  return isoString.slice(0, 10)
}

export function getTasksForDate(tasks, date) {
  const dateStr = date instanceof Date ? dateToLocalString(date) : date
  return tasks.filter(t => t.dueDate === dateStr)
}

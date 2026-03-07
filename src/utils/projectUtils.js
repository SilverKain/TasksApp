/**
 * Возвращает массив проектов от корня до указанного id,
 * например: [{ id: 'p1', title: 'Работа' }, { id: 'p1-2', title: 'Разработка' }]
 */
export function getProjectPath(projectId, allProjects) {
  if (!projectId) return []
  const map = new Map(allProjects.map(p => [p.id, p]))
  const path = []
  let current = map.get(projectId)
  while (current) {
    path.unshift(current)
    current = current.parentId ? map.get(current.parentId) : null
  }
  return path
}

/**
 * Возвращает строку пути вида "Проект / Подпроект"
 */
export function getProjectPathString(projectId, allProjects) {
  return getProjectPath(projectId, allProjects).map(p => p.title).join(' / ')
}

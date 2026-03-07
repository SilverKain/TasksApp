const STORAGE_KEY = 'tasks_app_data'

const defaultData = {
  tasks: [],
  projects: [],
}

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultData
    return JSON.parse(raw)
  } catch {
    return defaultData
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('storageService: unable to save data', e)
  }
}

export function exportJSON() {
  const data = loadData()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `tasks-app-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        saveData(data)
        resolve(data)
      } catch {
        reject(new Error('Некорректный файл JSON'))
      }
    }
    reader.onerror = reject
    reader.readAsText(file)
  })
}

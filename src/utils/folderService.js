/**
 * folderService — сохранение / открытие файлов через File System Access API.
 * В браузерах без поддержки (Firefox, Safari < 15.2) используется fallback.
 */

const FS_SUPPORTED = typeof window !== 'undefined' && 'showSaveFilePicker' in window

/** Сохранить JSON-строку в файл. Если API доступен — открывает диалог выбора места. */
export async function saveJSONFile(jsonString, suggestedName) {
  if (FS_SUPPORTED) {
    try {
      const fileHandle = await window.showSaveFilePicker({
        suggestedName,
        types: [{ description: 'JSON файл', accept: { 'application/json': ['.json'] } }],
      })
      const writable = await fileHandle.createWritable()
      await writable.write(jsonString)
      await writable.close()
      return true
    } catch (e) {
      if (e.name === 'AbortError') return false // пользователь закрыл диалог
      throw e
    }
  } else {
    // Fallback: обычное скачивание
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = suggestedName
    a.click()
    URL.revokeObjectURL(url)
    return true
  }
}

/** Открыть JSON-файл через диалог выбора. Возвращает распарсенный объект. */
export async function openJSONFile() {
  if ('showOpenFilePicker' in window) {
    try {
      const [fileHandle] = await window.showOpenFilePicker({
        types: [{ description: 'JSON файл', accept: { 'application/json': ['.json'] } }],
        multiple: false,
      })
      const file = await fileHandle.getFile()
      const text = await file.text()
      return JSON.parse(text)
    } catch (e) {
      if (e.name === 'AbortError') return null
      throw e
    }
  }
  // Если API нет — возвращаем null, caller должен использовать <input type="file">
  return null
}

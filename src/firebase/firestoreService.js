import { db } from './firebaseConfig'
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore'

const tasksCol  = (uid) => collection(db, 'users', uid, 'tasks')
const projsCol  = (uid) => collection(db, 'users', uid, 'projects')
const taskDoc   = (uid, id) => doc(db, 'users', uid, 'tasks', id)
const projectDoc = (uid, id) => doc(db, 'users', uid, 'projects', id)

/** Подписка на задачи пользователя в реальном времени */
export function subscribeUserTasks(uid, callback, onError) {
  return onSnapshot(tasksCol(uid), (snap) => {
    callback(snap.docs.map(d => d.data()))
  }, (err) => {
    console.error('subscribeUserTasks error:', err)
    onError && onError(err)
  })
}

/** Подписка на проекты пользователя в реальном времени */
export function subscribeUserProjects(uid, callback, onError) {
  return onSnapshot(projsCol(uid), (snap) => {
    callback(snap.docs.map(d => d.data()))
  }, (err) => {
    console.error('subscribeUserProjects error:', err)
    onError && onError(err)
  })
}

/** Создать / обновить задачу */
export function upsertTask(uid, task) {
  return setDoc(taskDoc(uid, task.id), task)
}

/** Удалить задачу */
export function deleteTaskDoc(uid, taskId) {
  return deleteDoc(taskDoc(uid, taskId))
}

/** Создать / обновить проект */
export function upsertProject(uid, project) {
  return setDoc(projectDoc(uid, project.id), project)
}

/** Удалить проект */
export function deleteProjectDoc(uid, projectId) {
  return deleteDoc(projectDoc(uid, projectId))
}

/** Записать начальные (seed) данные пачкой (только при первом входе) */
export async function seedUserData(uid, tasks, projects) {
  const batch = writeBatch(db)
  tasks.forEach(t => batch.set(taskDoc(uid, t.id), t))
  projects.forEach(p => batch.set(projectDoc(uid, p.id), p))
  await batch.commit()
}

/** Экспорт всех данных пользователя в JSON-файл */
export function exportToJSON(tasks, projects) {
  const data = { tasks, projects, exportedAt: new Date().toISOString() }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `tasks-app-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

/** Импорт данных из JSON-файла и запись в Firestore (перезаписывает текущие данные) */
export async function importFromJSON(uid, file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result)
        if (!Array.isArray(data.tasks) || !Array.isArray(data.projects)) {
          throw new Error('Неверный формат файла: ожидаются поля tasks и projects')
        }
        const batch = writeBatch(db)
        data.tasks.forEach(t => batch.set(taskDoc(uid, t.id), t))
        data.projects.forEach(p => batch.set(projectDoc(uid, p.id), p))
        await batch.commit()
        resolve(data)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(new Error('Ошибка чтения файла'))
    reader.readAsText(file)
  })
}

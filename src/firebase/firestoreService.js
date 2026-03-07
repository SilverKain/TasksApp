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
export function subscribeUserTasks(uid, callback) {
  return onSnapshot(tasksCol(uid), (snap) => {
    callback(snap.docs.map(d => d.data()))
  })
}

/** Подписка на проекты пользователя в реальном времени */
export function subscribeUserProjects(uid, callback) {
  return onSnapshot(projsCol(uid), (snap) => {
    callback(snap.docs.map(d => d.data()))
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

/**
 * Firebase Service — заглушки для будущей интеграции
 * Подключите Firebase SDK и замените реализации.
 */

// import { initializeApp } from 'firebase/app'
// import { getFirestore, collection, doc, onSnapshot, setDoc, deleteDoc } from 'firebase/firestore'

// const firebaseConfig = { /* ваш конфиг */ }
// const app = initializeApp(firebaseConfig)
// const db = getFirestore(app)

export async function loadTasks() {
  // TODO: return getDocs(collection(db, 'tasks'))
  console.warn('firebaseService.loadTasks — not implemented')
  return []
}

export async function saveTask(task) {
  // TODO: return setDoc(doc(db, 'tasks', task.id), task)
  console.warn('firebaseService.saveTask — not implemented', task)
}

export async function deleteTask(taskId) {
  // TODO: return deleteDoc(doc(db, 'tasks', taskId))
  console.warn('firebaseService.deleteTask — not implemented', taskId)
}

export function subscribeTasks(callback) {
  // TODO: return onSnapshot(collection(db, 'tasks'), snapshot => callback(snapshot.docs.map(d => d.data())))
  console.warn('firebaseService.subscribeTasks — not implemented')
  return () => {}  // unsubscribe noop
}

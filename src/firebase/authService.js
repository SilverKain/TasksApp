import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { auth } from './firebaseConfig'

const googleProvider = new GoogleAuthProvider()

/** Регистрация по email/паролю */
export async function registerWithEmail(email, password, displayName) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password)
  if (displayName) {
    await updateProfile(user, { displayName })
  }
  return user
}

/** Вход по email/паролю */
export async function loginWithEmail(email, password) {
  const { user } = await signInWithEmailAndPassword(auth, email, password)
  return user
}

/** Вход через Google */
export async function loginWithGoogle() {
  const { user } = await signInWithPopup(auth, googleProvider)
  return user
}

/** Сброс пароля */
export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email)
}

/** Выход */
export async function logout() {
  await signOut(auth)
}

import React, { useState } from 'react'
import { loginWithEmail, registerWithEmail, loginWithGoogle, resetPassword } from '../../firebase/authService'
import './LoginPage.css'

export default function LoginPage() {
  const [mode, setMode] = useState('login') // 'login' | 'register' | 'reset'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  const clearMessages = () => { setError(''); setInfo('') }

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearMessages()
    setLoading(true)
    try {
      if (mode === 'login') {
        await loginWithEmail(email, password)
      } else if (mode === 'register') {
        await registerWithEmail(email, password, name)
      } else if (mode === 'reset') {
        await resetPassword(email)
        setInfo('Письмо для сброса пароля отправлено на ' + email)
        setMode('login')
      }
    } catch (err) {
      setError(localizeError(err.code))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    clearMessages()
    setLoading(true)
    try {
      await loginWithGoogle()
    } catch (err) {
      setError(localizeError(err.code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__logo">📓</div>
        <h1 className="login-card__title">Tasks App</h1>
        <p className="login-card__subtitle">
          {mode === 'login' && 'Войдите, чтобы продолжить'}
          {mode === 'register' && 'Создайте аккаунт'}
          {mode === 'reset' && 'Сброс пароля'}
        </p>

        {error && <div className="login-card__error">{error}</div>}
        {info && <div className="login-card__info">{info}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="login-form__field">
              <label>Имя</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ваше имя"
                required
              />
            </div>
          )}
          <div className="login-form__field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
          </div>
          {mode !== 'reset' && (
            <div className="login-form__field">
              <label>Пароль</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Минимум 6 символов"
                required
                minLength={6}
              />
            </div>
          )}
          <button
            type="submit"
            className="login-form__submit"
            disabled={loading}
          >
            {mode === 'login' && 'Войти'}
            {mode === 'register' && 'Зарегистрироваться'}
            {mode === 'reset' && 'Отправить письмо'}
          </button>
        </form>

        {mode !== 'reset' && (
          <>
            <div className="login-divider"><span>или</span></div>
            <button
              className="login-google-btn"
              onClick={handleGoogle}
              disabled={loading}
              type="button"
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.8 2.2 30.2 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.4 13.1 17.8 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.6 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.2-10.1 7.2-17z"/>
                <path fill="#FBBC05" d="M10.6 28.6A14.6 14.6 0 0 1 9.5 24c0-1.6.3-3.1.8-4.6l-7.9-6.1A23.8 23.8 0 0 0 0 24c0 3.8.9 7.4 2.5 10.6l8.1-6z"/>
                <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2.1 1.4-4.7 2.2-7.7 2.2-6.2 0-11.5-4.2-13.4-9.8l-8.1 6C6.6 42.6 14.6 48 24 48z"/>
              </svg>
              Войти через Google
            </button>
          </>
        )}

        <div className="login-card__links">
          {mode === 'login' && (
            <>
              <button className="login-link" onClick={() => { setMode('register'); clearMessages() }}>
                Создать аккаунт
              </button>
              <button className="login-link" onClick={() => { setMode('reset'); clearMessages() }}>
                Забыли пароль?
              </button>
            </>
          )}
          {mode === 'register' && (
            <button className="login-link" onClick={() => { setMode('login'); clearMessages() }}>
              Уже есть аккаунт? Войти
            </button>
          )}
          {mode === 'reset' && (
            <button className="login-link" onClick={() => { setMode('login'); clearMessages() }}>
              ← Назад к входу
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function localizeError(code) {
  const map = {
    'auth/invalid-email': 'Некорректный email',
    'auth/user-not-found': 'Пользователь не найден',
    'auth/wrong-password': 'Неверный пароль',
    'auth/invalid-credential': 'Неверный email или пароль',
    'auth/email-already-in-use': 'Этот email уже используется',
    'auth/weak-password': 'Пароль слишком простой (минимум 6 символов)',
    'auth/too-many-requests': 'Слишком много попыток. Попробуйте позже',
    'auth/popup-closed-by-user': 'Окно входа было закрыто',
    'auth/network-request-failed': 'Ошибка сети. Проверьте подключение',
  }
  return map[code] || 'Произошла ошибка. Попробуйте снова'
}

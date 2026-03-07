import React from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { TaskProvider } from './context/TaskContext'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/AuthContext'
import MainPage from './pages/MainPage'
import LoginPage from './components/Auth/LoginPage'

function AppContent() {
  const { currentUser, authLoading } = useAuth()

  if (authLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--color-bg)', color: 'var(--color-text-muted)', fontSize: 16 }}>
        ⏳ Загрузка...
      </div>
    )
  }

  if (!currentUser) {
    return <LoginPage />
  }

  return (
    <TaskProvider>
      <MainPage />
    </TaskProvider>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

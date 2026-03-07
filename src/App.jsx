import React from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { TaskProvider } from './context/TaskContext'
import MainPage from './pages/MainPage'

function App() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <MainPage />
      </TaskProvider>
    </ThemeProvider>
  )
}

export default App

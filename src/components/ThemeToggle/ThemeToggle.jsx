import React from 'react'
import { useTheme } from '../../context/ThemeContext'
import './ThemeToggle.css'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      title={theme === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему'}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}

export default ThemeToggle

import React, { useState } from 'react'
import Projects from '../Projects/Projects'
import TodayTasks from '../TodayTasks/TodayTasks'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import Stats from '../Stats/Stats'
import UserBadge from '../Auth/UserBadge'
import { useTaskContext } from '../../context/TaskContext'
import { useAuth } from '../../context/AuthContext'
import { exportToJSON, importFromJSON } from '../../firebase/firestoreService'
import './SidebarLeft.css'

function SidebarLeft({ activeTab }) {
  const [view, setView] = useState('main') // 'main' | 'stats'
  const { tasks, projects } = useTaskContext()
  const { currentUser } = useAuth()

  const showProjects = !activeTab || activeTab === 'projects'
  const showToday = !activeTab || activeTab === 'today'

  const handleExport = () => {
    exportToJSON(tasks, projects)
  }

  const handleImport = async (e) => {
    const file = e.target.files[0]
    if (!file || !currentUser) return
    try {
      await importFromJSON(currentUser.uid, file)
      alert('Импорт выполнен успешно!')
    } catch (err) {
      alert('Ошибка импорта: ' + err.message)
    }
    e.target.value = ''
  }

  return (
    <aside className="sidebar-left">
      <div className="sidebar-left__topbar">
        <span className="sidebar-left__app-name">📓 Tasks App</span>
        <div className="sidebar-left__topbar-right">
          <div className="sidebar-left__view-tabs">
            <button
              className={`sidebar-left__view-tab ${view === 'main' ? 'sidebar-left__view-tab--active' : ''}`}
              onClick={() => setView('main')}
              title="Проекты"
            >📁</button>
            <button
              className={`sidebar-left__view-tab ${view === 'stats' ? 'sidebar-left__view-tab--active' : ''}`}
              onClick={() => setView('stats')}
              title="Статистика"
            >📊</button>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {view === 'stats' ? (
        <div className="sidebar-left__section sidebar-left__section--full">
          <Stats onExport={handleExport} onImport={handleImport} />
        </div>
      ) : (
        <>
          {showProjects && (
            <div className={`sidebar-left__section sidebar-left__section--projects ${showToday ? 'sidebar-left__section--half' : 'sidebar-left__section--full'}`}>
              <Projects />
            </div>
          )}

          {!activeTab && <div className="sidebar-left__divider" />}

          {showToday && (
            <div className={`sidebar-left__section sidebar-left__section--today ${showProjects ? 'sidebar-left__section--half' : 'sidebar-left__section--full'}`}>
              <TodayTasks />
            </div>
          )}
        </>
      )}

      {/* Показываем аккаунт только в десктопной версии */}
      {!activeTab && <UserBadge variant="sidebar" />}
    </aside>
  )
}

export default SidebarLeft

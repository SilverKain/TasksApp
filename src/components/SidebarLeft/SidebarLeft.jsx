import React from 'react'
import Projects from '../Projects/Projects'
import TodayTasks from '../TodayTasks/TodayTasks'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import SearchBar from '../SearchBar/SearchBar'
import UserBadge from '../Auth/UserBadge'
import './SidebarLeft.css'

function SidebarLeft({ activeTab }) {
  // On mobile, activeTab tells which section to show
  const showProjects = !activeTab || activeTab === 'projects'
  const showToday = !activeTab || activeTab === 'today'

  return (
    <aside className="sidebar-left">
      <div className="sidebar-left__topbar">
        <span className="sidebar-left__app-name">📓 Tasks App</span>
        <ThemeToggle />
      </div>

      <SearchBar />

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

      {/* Показываем аккаунт только в десктопной версии */}
      {!activeTab && <UserBadge variant="sidebar" />}
    </aside>
  )
}

export default SidebarLeft

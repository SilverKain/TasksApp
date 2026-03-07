import React, { useState, useRef, useCallback } from 'react'
import Projects from '../Projects/Projects'
import TodayTasks from '../TodayTasks/TodayTasks'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import Stats from '../Stats/Stats'
import UserBadge from '../Auth/UserBadge'
import { useTaskContext } from '../../context/TaskContext'
import { useAuth } from '../../context/AuthContext'
import { exportToJSON, importFromData } from '../../firebase/firestoreService'
import { saveJSONFile, openJSONFile } from '../../utils/folderService'
import './SidebarLeft.css'

function SidebarLeft({ activeTab }) {
  const [view, setView] = useState('main') // 'main' | 'stats'
  const [splitPct, setSplitPct] = useState(50)
  const importInputRef = useRef(null)
  const sidebarRef = useRef(null)
  const { tasks, projects, archiveCompleted } = useTaskContext()
  const { currentUser } = useAuth()

  const showProjects = !activeTab || activeTab === 'projects'
  const showToday = !activeTab || activeTab === 'today'

  const handleExport = async () => {
    const data = { tasks, projects, exportedAt: new Date().toISOString() }
    const name = `tasks-app-backup-${new Date().toISOString().slice(0, 10)}.json`
    await saveJSONFile(JSON.stringify(data, null, 2), name)
  }

  const handleImportClick = async () => {
    // Сначала пробуем File System Access API
    const data = await openJSONFile()
    if (data) {
      await doImport(data)
      return
    }
    // Fallback: обычный <input>
    importInputRef.current?.click()
  }

  const handleFileInput = async (e) => {
    const file = e.target.files[0]
    if (!file || !currentUser) return
    try {
      const reader = new FileReader()
      reader.onload = async (ev) => {
        try {
          const data = JSON.parse(ev.target.result)
          await doImport(data)
        } catch (err) {
          alert('Ошибка импорта: ' + err.message)
        }
      }
      reader.readAsText(file)
    } catch (err) {
      alert('Ошибка чтения файла: ' + err.message)
    }
    e.target.value = ''
  }

  const doImport = async (data) => {
    if (!currentUser) return
    if (!Array.isArray(data.tasks) || !Array.isArray(data.projects)) {
      alert('Неверный формат файла')
      return
    }
    try {
      await importFromData(currentUser.uid, data)
      alert('Импорт выполнен успешно!')
    } catch (err) {
      alert('Ошибка импорта: ' + err.message)
    }
  }

  const handleDividerMouseDown = useCallback((e) => {
    e.preventDefault()
    const sidebar = sidebarRef.current
    if (!sidebar) return
    const onMouseMove = (ev) => {
      const rect = sidebar.getBoundingClientRect()
      const topbarEl = sidebar.querySelector('.sidebar-left__topbar')
      const badgeEl = sidebar.querySelector('.user-badge--sidebar')
      const topbarH = topbarEl ? topbarEl.offsetHeight : 50
      const badgeH = badgeEl ? badgeEl.offsetHeight : 48
      const contentH = rect.height - topbarH - badgeH - 1
      const relY = ev.clientY - rect.top - topbarH
      const pct = Math.min(Math.max((relY / contentH) * 100, 10), 90)
      setSplitPct(pct)
    }
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    document.body.style.cursor = 'row-resize'
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }, [])

  return (
    <aside className="sidebar-left" ref={sidebarRef}>
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
          <button
            className="sidebar-left__archive-btn"
            onClick={archiveCompleted}
            title="Переместить выполненные в архив"
          >📦</button>
          <ThemeToggle />
        </div>
      </div>

      {/* Скрытый input для Safari/Firefox fallback */}
      <input
        ref={importInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileInput}
      />

      {view === 'stats' ? (
        <div className="sidebar-left__section sidebar-left__section--full">
          <Stats onExport={handleExport} onImport={handleImportClick} onArchive={archiveCompleted} />
        </div>
      ) : (
        <>
          {showProjects && (
            <div
              className="sidebar-left__section"
              style={showProjects && showToday ? { flexGrow: splitPct, flexShrink: 1, flexBasis: 0 } : { flex: 1 }}
            >
              <Projects />
            </div>
          )}

          {!activeTab && showProjects && showToday && (
            <div
              className="sidebar-left__divider sidebar-left__divider--resizable"
              onMouseDown={handleDividerMouseDown}
            />
          )}

          {showToday && (
            <div
              className="sidebar-left__section"
              style={showProjects && showToday ? { flexGrow: 100 - splitPct, flexShrink: 1, flexBasis: 0 } : { flex: 1 }}
            >
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


import React, { useState, useRef } from 'react'
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
  const importInputRef = useRef(null)
  const { tasks, projects } = useTaskContext()
  const { currentUser } = useAuth()

  const showProjects = !activeTab || activeTab === 'projects'
  const showToday = !activeTab || activeTab === 'today'

  const handleExport = async () => {
    const data = { tasks, projects, exportedAt: new Date().toISOString() }
    const name = `tasks-app-backup-${new Date().toISOString().slice(0, 10)}.json`
    await saveJSONFile(JSON.stringify(data, null, 2), name)
  }

  const handleImportClick = async () => {
    // РЎРЅР°С‡Р°Р»Р° РїСЂРѕР±СѓРµРј File System Access API
    const data = await openJSONFile()
    if (data) {
      await doImport(data)
      return
    }
    // Fallback: РѕР±С‹С‡РЅС‹Р№ <input>
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
          alert('РћС€РёР±РєР° РёРјРїРѕСЂС‚Р°: ' + err.message)
        }
      }
      reader.readAsText(file)
    } catch (err) {
      alert('РћС€РёР±РєР° С‡С‚РµРЅРёСЏ С„Р°Р№Р»Р°: ' + err.message)
    }
    e.target.value = ''
  }

  const doImport = async (data) => {
    if (!currentUser) return
    if (!Array.isArray(data.tasks) || !Array.isArray(data.projects)) {
      alert('РќРµРІРµСЂРЅС‹Р№ С„РѕСЂРјР°С‚ С„Р°Р№Р»Р°')
      return
    }
    try {
      await importFromData(currentUser.uid, data)
      alert('РРјРїРѕСЂС‚ РІС‹РїРѕР»РЅРµРЅ СѓСЃРїРµС€РЅРѕ!')
    } catch (err) {
      alert('РћС€РёР±РєР° РёРјРїРѕСЂС‚Р°: ' + err.message)
    }
  }

  return (
    <aside className="sidebar-left">
      <div className="sidebar-left__topbar">
        <span className="sidebar-left__app-name">рџ““ Tasks App</span>
        <div className="sidebar-left__topbar-right">
          <div className="sidebar-left__view-tabs">
            <button
              className={`sidebar-left__view-tab ${view === 'main' ? 'sidebar-left__view-tab--active' : ''}`}
              onClick={() => setView('main')}
              title="РџСЂРѕРµРєС‚С‹"
            >рџ“Ѓ</button>
            <button
              className={`sidebar-left__view-tab ${view === 'stats' ? 'sidebar-left__view-tab--active' : ''}`}
              onClick={() => setView('stats')}
              title="РЎС‚Р°С‚РёСЃС‚РёРєР°"
            >рџ“Љ</button>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* РЎРєСЂС‹С‚С‹Р№ input РґР»СЏ Safari/Firefox fallback */}
      <input
        ref={importInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileInput}
      />

      {view === 'stats' ? (
        <div className="sidebar-left__section sidebar-left__section--full">
          <Stats onExport={handleExport} onImport={handleImportClick} />
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

      {/* РџРѕРєР°Р·С‹РІР°РµРј Р°РєРєР°СѓРЅС‚ С‚РѕР»СЊРєРѕ РІ РґРµСЃРєС‚РѕРїРЅРѕР№ РІРµСЂСЃРёРё */}
      {!activeTab && <UserBadge variant="sidebar" />}
    </aside>
  )
}

export default SidebarLeft


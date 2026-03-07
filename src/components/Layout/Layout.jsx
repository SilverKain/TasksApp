import React from 'react'
import './Layout.css'
import SidebarLeft from '../SidebarLeft/SidebarLeft'
import CenterPanel from '../CenterPanel/CenterPanel'
import SidebarRight from '../SidebarRight/SidebarRight'
import UserBadge from '../Auth/UserBadge'
import { useTaskContext } from '../../context/TaskContext'

const TABS = [
  { id: 'projects', label: 'Проекты', icon: '📁' },
  { id: 'today', label: 'Сегодня', icon: '📅' },
  { id: 'task', label: 'Задача', icon: '📝' },
  { id: 'calendar', label: 'Календарь', icon: '🗓' },
  { id: 'inbox', label: 'Входящие', icon: '📥' },
]

function Layout() {
  const { mobileTab, setMobileTab } = useTaskContext()

  return (
    <>
      {/* Desktop layout */}
      <div className="layout">
        <div className="layout__sidebar-left">
          <SidebarLeft />
        </div>
        <div className="layout__center">
          <CenterPanel />
        </div>
        <div className="layout__sidebar-right">
          <SidebarRight />
        </div>
      </div>

      {/* Mobile layout */}
      <div className="mobile-tabs">
        <div className="mobile-content">
          {(mobileTab === 'projects' || mobileTab === 'today') && <SidebarLeft activeTab={mobileTab} />}
          {mobileTab === 'task' && <CenterPanel />}
          {(mobileTab === 'calendar' || mobileTab === 'inbox') && <SidebarRight activeTab={mobileTab} />}
        </div>
        <nav className="mobile-tab-bar">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={mobileTab === tab.id ? 'active' : ''}
              onClick={() => setMobileTab(tab.id)}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
          <div className="mobile-tab-bar__user">
            <UserBadge variant="mobile" />
          </div>
        </nav>
      </div>
    </>
  )
}

export default Layout

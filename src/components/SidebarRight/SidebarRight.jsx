import React from 'react'
import CalendarWidget from '../Calendar/CalendarWidget'
import Inbox from '../Inbox/Inbox'
import './SidebarRight.css'

function SidebarRight({ activeTab }) {
  const showCalendar = !activeTab || activeTab === 'calendar'
  const showInbox = !activeTab || activeTab === 'inbox'

  return (
    <aside className="sidebar-right">
      {showCalendar && (
        <div className={`sidebar-right__section ${showInbox ? 'sidebar-right__section--half' : 'sidebar-right__section--full'}`}>
          <CalendarWidget />
        </div>
      )}

      {!activeTab && <div className="sidebar-right__divider" />}

      {showInbox && (
        <div className={`sidebar-right__section ${showCalendar ? 'sidebar-right__section--half' : 'sidebar-right__section--full'}`}>
          <Inbox />
        </div>
      )}
    </aside>
  )
}

export default SidebarRight

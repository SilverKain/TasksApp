import React, { useState, useRef, useCallback } from 'react'
import CalendarWidget from '../Calendar/CalendarWidget'
import Inbox from '../Inbox/Inbox'
import './SidebarRight.css'

function SidebarRight({ activeTab }) {
  const [splitPct, setSplitPct] = useState(55)
  const sidebarRef = useRef(null)
  const showCalendar = !activeTab || activeTab === 'calendar'
  const showInbox = !activeTab || activeTab === 'inbox'

  const handleDividerMouseDown = useCallback((e) => {
    e.preventDefault()
    const sidebar = sidebarRef.current
    if (!sidebar) return
    const onMouseMove = (ev) => {
      const rect = sidebar.getBoundingClientRect()
      const contentH = rect.height - 1
      const relY = ev.clientY - rect.top
      const pct = Math.min(Math.max((relY / contentH) * 100, 15), 85)
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
    <aside className="sidebar-right" ref={sidebarRef}>
      {showCalendar && (
        <div
          className="sidebar-right__section"
          style={showCalendar && showInbox ? { flexGrow: splitPct, flexShrink: 1, flexBasis: 0 } : { flex: 1 }}
        >
          <CalendarWidget />
        </div>
      )}

      {!activeTab && showCalendar && showInbox && (
        <div
          className="sidebar-right__divider sidebar-right__divider--resizable"
          onMouseDown={handleDividerMouseDown}
        />
      )}

      {showInbox && (
        <div
          className="sidebar-right__section"
          style={showCalendar && showInbox ? { flexGrow: 100 - splitPct, flexShrink: 1, flexBasis: 0 } : { flex: 1 }}
        >
          <Inbox />
        </div>
      )}
    </aside>
  )
}

export default SidebarRight

import React, { useState } from 'react'
import { useTaskContext } from '../../context/TaskContext'
import { getProjectPathString } from '../../utils/projectUtils'
import './Stats.css'

const SECTIONS = [
  { id: 'projects', label: 'Проекты', emoji: '📁' },
  { id: 'subprojects', label: 'Подпроекты', emoji: '📂' },
  { id: 'tasks', label: 'Задачи', emoji: '✅' },
  { id: 'notes', label: 'Заметки', emoji: '📄' },
]

export default function Stats({ onImport, onExport }) {
  const { tasks, projects, setSelectedTaskId, setMobileTab } = useTaskContext()
  const [expanded, setExpanded] = useState(null)

  const rootProjects = projects.filter(p => !p.parentId)
  const subProjects = projects.filter(p => !!p.parentId)
  const taskList = tasks.filter(t => t.type !== 'note')
  const noteList = tasks.filter(t => t.type === 'note')

  const counts = {
    projects: rootProjects.length,
    subprojects: subProjects.length,
    tasks: taskList.length,
    notes: noteList.length,
  }

  const items = {
    projects: rootProjects,
    subprojects: subProjects,
    tasks: taskList,
    notes: noteList,
  }

  const handleItemClick = (item) => {
    if (item.type !== undefined) {
      // это задача / заметка
      setSelectedTaskId(item.id)
      setMobileTab('task')
    }
  }

  const toggle = (id) => setExpanded(prev => prev === id ? null : id)

  return (
    <div className="stats">
      <div className="stats__header">
        <span className="stats__title">Статистика</span>
        <div className="stats__io">
          <button className="stats__io-btn" onClick={onExport} title="Экспортировать в JSON">
            ⬆ Экспорт
          </button>
          <label className="stats__io-btn stats__io-btn--import" title="Импортировать из JSON">
            ⬇ Импорт
            <input type="file" accept=".json" onChange={onImport} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      <div className="stats__grid">
        {SECTIONS.map(sec => (
          <div key={sec.id} className="stats__card">
            <span className="stats__card-emoji">{sec.emoji}</span>
            <span className="stats__card-count">{counts[sec.id]}</span>
            <span className="stats__card-label">{sec.label}</span>
          </div>
        ))}
      </div>

      <div className="stats__lists">
        {SECTIONS.map(sec => (
          <div key={sec.id} className="stats__section">
            <button
              className={`stats__section-header ${expanded === sec.id ? 'stats__section-header--open' : ''}`}
              onClick={() => toggle(sec.id)}
            >
              <span>{sec.emoji} {sec.label} ({counts[sec.id]})</span>
              <span className="stats__chevron">{expanded === sec.id ? '▾' : '▸'}</span>
            </button>
            {expanded === sec.id && (
              <ul className="stats__list">
                {items[sec.id].length === 0 ? (
                  <li className="stats__list-empty">Нет элементов</li>
                ) : items[sec.id].map(item => (
                  <li key={item.id} className="stats__list-item">
                    {/* Проекты и подпроекты — не кликабельны как задачи */}
                    {item.type !== undefined ? (
                      <button
                        className="stats__item-btn"
                        onClick={() => handleItemClick(item)}
                        title="Открыть"
                      >
                        <span className="stats__item-name">{item.title || 'Без названия'}</span>
                        <ProjectPath item={item} projects={projects} />
                      </button>
                    ) : (
                      <span className="stats__item-name">{item.title || 'Без названия'}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ProjectPath({ item, projects }) {
  if (!item.projectId) return null
  const path = getProjectPathString(item.projectId, projects)
  if (!path) return null
  return <span className="stats__item-path">{path}</span>
}

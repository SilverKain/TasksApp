import React, { useState } from 'react'
import { useTaskContext } from '../../context/TaskContext'
import TaskItem from '../TaskItem/TaskItem'
import './Inbox.css'

function Inbox() {
  const { inboxTasks, addTask, projects, updateTask } = useTaskContext()
  const [newTitle, setNewTitle] = useState('')
  const [assignProject, setAssignProject] = useState('')
  const [assignDate, setAssignDate] = useState('')

  const handleAdd = (e) => {
    e.preventDefault()
    if (newTitle.trim()) {
      addTask({
        title: newTitle.trim(),
        projectId: assignProject || null,
        dueDate: assignDate || null,
      })
      setNewTitle('')
      setAssignProject('')
      setAssignDate('')
    }
  }

  return (
    <div className="inbox">
      <div className="inbox__header">
        <span className="inbox__heading">Входящие</span>
        <span className="inbox__count">{inboxTasks.length}</span>
      </div>

      <div className="inbox__list">
        {inboxTasks.length === 0 ? (
          <p className="inbox__empty">Нет задач без проекта</p>
        ) : (
          inboxTasks.map(task => (
            <div key={task.id} className="inbox__task-row">
              <TaskItem task={task} />
              {/* Quick assign project */}
              <select
                className="inbox__assign-select"
                value={task.projectId || ''}
                onChange={e => updateTask(task.id, { projectId: e.target.value || null })}
                title="Назначить проект"
              >
                <option value="">Без проекта</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
          ))
        )}
      </div>

      <form className="inbox__add-form" onSubmit={handleAdd}>
        <input
          className="inbox__add-input"
          placeholder="+ Быстро добавить задачу..."
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
        />
        <div className="inbox__add-meta">
          <select
            className="inbox__add-select"
            value={assignProject}
            onChange={e => setAssignProject(e.target.value)}
          >
            <option value="">Без проекта</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
          <input
            type="date"
            className="inbox__add-date"
            value={assignDate}
            onChange={e => setAssignDate(e.target.value)}
          />
          <button type="submit" className="inbox__add-btn">→</button>
        </div>
      </form>
    </div>
  )
}

export default Inbox

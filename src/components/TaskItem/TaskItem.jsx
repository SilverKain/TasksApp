import React from 'react'
import { useTaskContext } from '../../context/TaskContext'
import { formatDate, isOverdue, isToday } from '../../utils/dateUtils'
import './TaskItem.css'

function TaskItem({ task, showProject = false }) {
  const { selectedTaskId, setSelectedTaskId, toggleTaskDone, projects, setMobileTab } = useTaskContext()

  const isSelected = selectedTaskId === task.id
  const isNote = task.type === 'note'
  const overdue = !isNote && task.status !== 'done' && isOverdue(task.dueDate)
  const today = !isNote && isToday(task.dueDate)

  const project = showProject && task.projectId
    ? projects.find(p => p.id === task.projectId)
    : null

  const handleCheck = (e) => {
    e.stopPropagation()
    toggleTaskDone(task.id)
  }

  const handleDoubleClick = () => {
    setSelectedTaskId(task.id)
    setMobileTab('task')
  }

  return (
    <div
      className={[
        'task-item',
        isSelected ? 'task-item--selected' : '',
        !isNote && task.status === 'done' ? 'task-item--done' : '',
        overdue ? 'task-item--overdue' : '',
        today ? 'task-item--today' : '',
        isNote ? 'task-item--note' : '',
      ].filter(Boolean).join(' ')}
      onClick={() => setSelectedTaskId(task.id)}
      onDoubleClick={handleDoubleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && setSelectedTaskId(task.id)}
    >
      {/* Чекбокс — только для задач */}
      {!isNote ? (
        <button
          className="task-item__check"
          onClick={handleCheck}
          aria-label={task.status === 'done' ? 'Отметить невыполненной' : 'Отметить выполненной'}
        >
          {task.status === 'done' ? (
            <span className="task-item__check-icon task-item__check-icon--done">✓</span>
          ) : (
            <span className="task-item__check-icon" />
          )}
        </button>
      ) : (
        <span className="task-item__note-icon">📄</span>
      )}

      <div className="task-item__body">
        <span className="task-item__title">{task.title || 'Без названия'}</span>
        <div className="task-item__meta">
          {project && (
            <span className="task-item__project">{project.title}</span>
          )}
          {!isNote && task.dueDate && (
            <span className={`task-item__date ${overdue ? 'task-item__date--overdue' : ''} ${today ? 'task-item__date--today' : ''}`}>
              {overdue ? '⚠ ' : ''}{formatDate(task.dueDate)}
            </span>
          )}
          {isNote && <span className="task-item__note-label">заметка</span>}
        </div>
      </div>

      {!isNote && (
        <span className={`status-badge status-${task.status}`}>
          {task.status === 'todo' && 'todo'}
          {task.status === 'in-progress' && '●'}
          {task.status === 'done' && '✓'}
        </span>
      )}
    </div>
  )
}

export default TaskItem

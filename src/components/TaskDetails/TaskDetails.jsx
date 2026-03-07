import React, { useState, useEffect } from 'react'
import { useTaskContext } from '../../context/TaskContext'
import { formatDate, toDateInputValue } from '../../utils/dateUtils'
import { getProjectPath, getProjectPathString } from '../../utils/projectUtils'
import './TaskDetails.css'

const STATUS_OPTIONS = [
  { value: 'todo', label: 'Todo' },
  { value: 'in-progress', label: 'В процессе' },
  { value: 'done', label: 'Выполнено' },
]

const STATUS_LABELS = { todo: 'Todo', 'in-progress': 'В процессе', done: 'Выполнено' }

function TaskDetails() {
  const { selectedTask, updateTask, deleteTask, toggleTaskDone, projects, addTask, newTaskId, setNewTaskId } = useTaskContext()
  const [newLink, setNewLink] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  // Local form state synced with selectedTask
  const [form, setForm] = useState(null)

  useEffect(() => {
    if (selectedTask) {
      setForm({ ...selectedTask })
      // Новые задачи/заметки сразу открываются в режиме редактирования
      if (newTaskId && selectedTask.id === newTaskId) {
        setIsEditing(true)
        setNewTaskId(null)
      } else {
        setIsEditing(false)
      }
    } else {
      setForm(null)
      setIsEditing(false)
    }
  }, [selectedTask?.id])

  if (!selectedTask || !form) {
    return (
      <div className="task-details task-details--empty">
        <div className="task-details__empty-icon">📝</div>
        <p className="task-details__empty-text">Выберите задачу, чтобы просмотреть детали</p>
        <div className="task-details__empty-actions">
          <button
            className="task-details__new-btn"
            onClick={() => addTask({ title: 'Новая задача' })}
          >
            + Создать задачу
          </button>
          <button
            className="task-details__new-btn task-details__new-btn--note"
            onClick={() => addTask({ title: 'Новая заметка', type: 'note' })}
          >
            + Создать заметку
          </button>
        </div>
      </div>
    )
  }

  const isNote = form.type === 'note'

  const handleField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    updateTask(selectedTask.id, { [field]: value })
  }

  const handleAddLink = (e) => {
    e.preventDefault()
    if (newLink.trim()) {
      handleField('links', [...(form.links || []), newLink.trim()])
      setNewLink('')
    }
  }

  const handleRemoveLink = (idx) => {
    handleField('links', form.links.filter((_, i) => i !== idx))
  }

  // Полный путь к проекту
  const projectPath = getProjectPath(form.projectId, projects)
  const projectPathStr = projectPath.map(p => p.title).join(' / ')

  const allProjectsSorted = [...projects].sort((a, b) => {
    const aLabel = a.parentId ? (projects.find(p => p.id === a.parentId)?.title ?? '') + ' / ' + a.title : a.title
    const bLabel = b.parentId ? (projects.find(p => p.id === b.parentId)?.title ?? '') + ' / ' + b.title : b.title
    return aLabel.localeCompare(bLabel)
  })

  return (
    <div className="task-details">
      {/* Topbar */}
      <div className="task-details__topbar">
        <div className="task-details__breadcrumb">
          {isNote
            ? projectPathStr
              ? <span className="task-details__breadcrumb-project">📄 {projectPathStr}</span>
              : <span className="task-details__breadcrumb-note">📄 Заметка</span>
            : projectPathStr
              ? <span className="task-details__breadcrumb-project">{projectPathStr}</span>
              : <span className="task-details__breadcrumb-empty">Без проекта</span>}
        </div>
        <div className="task-details__topbar-actions">
          {/* Кнопка выполнить — только для задач в режиме просмотра */}
          {!isNote && !isEditing && (
            <button
              className={`task-details__done-btn ${form.status === 'done' ? 'task-details__done-btn--done' : ''}`}
              onClick={() => {
                toggleTaskDone(selectedTask.id)
                setForm(prev => ({ ...prev, status: prev.status === 'done' ? 'todo' : 'done' }))
              }}
              title={form.status === 'done' ? 'Отменить выполнение' : 'Отметить выполненной'}
            >
              {form.status === 'done' ? '✓ Выполнено' : '○ Выполнить'}
            </button>
          )}

          {/* Статус в режиме редактирования */}
          {!isNote && isEditing && (
            <select
              className="task-details__status-select"
              value={form.status}
              onChange={e => handleField('status', e.target.value)}
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          )}

          {/* Статус badge в режиме просмотра */}
          {!isNote && !isEditing && (
            <span className={`status-badge status-${form.status}`}>
              {STATUS_LABELS[form.status]}
            </span>
          )}

          <button
            className={`task-details__edit-btn ${isEditing ? 'task-details__edit-btn--active' : ''}`}
            onClick={() => setIsEditing(v => !v)}
            title={isEditing ? 'Завершить редактирование' : 'Редактировать'}
          >
            {isEditing ? '✓ Готово' : '✎ Изменить'}
          </button>

          <button
            className="task-details__delete-btn"
            onClick={() => deleteTask(selectedTask.id)}
            title="Удалить"
          >
            🗑
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="task-details__content">
        {/* Title */}
        {isEditing ? (
          <div className="task-details__title-edit-wrap">
            <label className="task-details__title-edit-label">
              {isNote ? '📄 Название заметки' : '✅ Название задачи'}
            </label>
            <input
              className="task-details__title-input"
              value={form.title}
              onChange={e => handleField('title', e.target.value)}
              placeholder={isNote ? 'Название заметки...' : 'Название задачи...'}
            />
          </div>
        ) : (
          <h2 className={`task-details__title-view ${form.status === 'done' ? 'task-details__title-view--done' : ''}`}>
            {form.title || <span className="task-details__placeholder">{isNote ? 'Без названия' : 'Без названия'}</span>}
          </h2>
        )}

        {/* Description */}
        {isEditing ? (
          <div className="task-details__field">
            <label className="task-details__label">Описание</label>
            <textarea
              className="task-details__textarea"
              value={form.description}
              onChange={e => handleField('description', e.target.value)}
              placeholder="Добавьте описание..."
              rows={4}
            />
          </div>
        ) : null}

        {/* Links */}
        {isEditing ? (
          <div className="task-details__field">
            <label className="task-details__label">Ссылки</label>
            <div className="task-details__links">
              {(form.links || []).map((link, idx) => (
                <div key={idx} className="task-details__link-row">
                  <a href={link} target="_blank" rel="noopener noreferrer" className="task-details__link">
                    🔗 {link}
                  </a>
                  <button
                    className="task-details__link-remove"
                    onClick={() => handleRemoveLink(idx)}
                    title="Удалить ссылку"
                  >×</button>
                </div>
              ))}
              <form className="task-details__link-form" onSubmit={handleAddLink}>
                <input
                  className="task-details__link-input"
                  value={newLink}
                  onChange={e => setNewLink(e.target.value)}
                  placeholder="https://..."
                  type="url"
                />
                <button type="submit" className="task-details__link-add-btn">Добавить</button>
              </form>
            </div>
          </div>
        ) : null}

        {/* Notes */}
        {isEditing ? (
          <div className="task-details__field">
            <label className="task-details__label">Заметки</label>
            <textarea
              className="task-details__textarea task-details__textarea--notes"
              value={form.notes}
              onChange={e => handleField('notes', e.target.value)}
              placeholder="Заметки..."
              rows={5}
            />
          </div>
        ) : null}

        {/* VIEW MODE: единый текстовый блок */}
        {!isEditing && (
          <div className="task-details__view-body">
            {form.description && (
              <p className="task-details__view-description">{form.description}</p>
            )}
            {(form.links || []).length > 0 && (
              <div className="task-details__view-links">
                {(form.links || []).map((link, idx) => (
                  <a
                    key={idx}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="task-details__view-link"
                  >
                    🔗 {link}
                  </a>
                ))}
              </div>
            )}
            {form.notes && (
              <>
                {(form.description || (form.links || []).length > 0) && (
                  <hr className="task-details__view-divider" />
                )}
                <p className="task-details__view-notes">{form.notes}</p>
              </>
            )}
            {!form.description && !form.notes && (form.links || []).length === 0 && (
              <p className="task-details__placeholder task-details__placeholder--body">
                Нет содержимого. Нажмите «✎ Изменить» чтобы добавить.
              </p>
            )}
          </div>
        )}

        {/* Date + Project — for tasks; Project only — for notes */}
        {!isNote ? (
          <div className="task-details__meta-row">
            <div className="task-details__field task-details__field--inline">
              <label className="task-details__label">📅 Дата</label>
              {isEditing ? (
                <input
                  type="date"
                  className="task-details__date-input"
                  value={toDateInputValue(form.dueDate)}
                  onChange={e => handleField('dueDate', e.target.value || null)}
                />
              ) : (
                <span className="task-details__meta-value">
                  {form.dueDate ? formatDate(form.dueDate) : <span className="task-details__placeholder">Не задана</span>}
                </span>
              )}
            </div>

            <div className="task-details__field task-details__field--inline">
              <label className="task-details__label">📁 Проект</label>
              {isEditing ? (
                <select
                  className="task-details__project-select"
                  value={form.projectId || ''}
                  onChange={e => handleField('projectId', e.target.value || null)}
                >
                  <option value="">— Без проекта —</option>
                  {allProjectsSorted.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.parentId ? `  ↳ ${p.title}` : p.title}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="task-details__meta-value">
                  {projectPathStr ? projectPathStr : <span className="task-details__placeholder">Без проекта</span>}
                </span>
              )}
            </div>
          </div>
        ) : (
          /* Для заметок — только выбор проекта */
          <div className="task-details__meta-row">
            <div className="task-details__field task-details__field--inline">
              <label className="task-details__label">📁 Проект</label>
              {isEditing ? (
                <select
                  className="task-details__project-select"
                  value={form.projectId || ''}
                  onChange={e => handleField('projectId', e.target.value || null)}
                >
                  <option value="">— Без проекта —</option>
                  {allProjectsSorted.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.parentId ? `  ↳ ${p.title}` : p.title}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="task-details__meta-value">
                  {projectPathStr ? projectPathStr : <span className="task-details__placeholder">Без проекта</span>}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="task-details__footer">
          <span className="task-details__created">
            Создано: {formatDate(form.createdAt)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default TaskDetails

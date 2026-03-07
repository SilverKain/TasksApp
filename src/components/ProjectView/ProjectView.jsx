import React from 'react'
import { useTaskContext } from '../../context/TaskContext'
import { getProjectPath } from '../../utils/projectUtils'
import TaskItem from '../TaskItem/TaskItem'
import './ProjectView.css'

function ProjectView() {
  const {
    selectedProjectId,
    setSelectedProjectId,
    projects,
    tasks,
    addTask,
    setMobileTab,
  } = useTaskContext()

  const project = projects.find(p => p.id === selectedProjectId)
  if (!project) return null

  const projectPath = getProjectPath(selectedProjectId, projects)
  const pathStr = projectPath.map(p => p.title).join(' / ')

  const projectTasks = tasks.filter(t => t.type !== 'note' && t.projectId === selectedProjectId)
  const projectNotes = tasks.filter(t => t.type === 'note' && t.projectId === selectedProjectId)

  const handleCreateTask = () => {
    addTask({ projectId: selectedProjectId })
    setMobileTab('task')
  }

  const handleCreateNote = () => {
    addTask({ projectId: selectedProjectId, type: 'note', title: 'Новая заметка' })
    setMobileTab('task')
  }

  return (
    <div className="project-view">
      {/* Header — путь к проекту */}
      <div className="project-view__topbar">
        <div className="project-view__breadcrumb">
          <span className="project-view__breadcrumb-path">📁 {pathStr}</span>
        </div>
        <button
          className="project-view__close"
          onClick={() => setSelectedProjectId(null)}
          title="Закрыть"
        >
          ✕
        </button>
      </div>

      {/* Содержимое */}
      <div className="project-view__body">
        {projectTasks.length === 0 && projectNotes.length === 0 ? (
          <div className="project-view__empty">
            <div className="project-view__empty-icon">📁</div>
            <p>В этом проекте пока нет задач или заметок</p>
          </div>
        ) : (
          <>
            {projectTasks.length > 0 && (
              <div className="project-view__section">
                <div className="project-view__section-title">Задачи ({projectTasks.length})</div>
                {projectTasks.map(task => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            )}
            {projectNotes.length > 0 && (
              <div className="project-view__section">
                <div className="project-view__section-title">Заметки ({projectNotes.length})</div>
                {projectNotes.map(task => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Кнопки создания */}
      <div className="project-view__actions">
        <button className="project-view__btn" onClick={handleCreateTask}>
          + Создать задачу
        </button>
        <button className="project-view__btn project-view__btn--note" onClick={handleCreateNote}>
          + Создать заметку
        </button>
      </div>
    </div>
  )
}

export default ProjectView

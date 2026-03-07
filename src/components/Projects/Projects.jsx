import React, { useState, useRef, useEffect } from 'react'
import { useTaskContext } from '../../context/TaskContext'
import './Projects.css'

function ProjectMenu({ onAddTask, onAddNote, onAddChild, onRename, onDelete }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div className="project-menu" ref={ref}>
      <button
        className="project-menu__trigger"
        title="Действия"
        onClick={e => { e.stopPropagation(); setOpen(v => !v) }}
      >
        ⋯
      </button>
      {open && (
        <div className="project-menu__dropdown">
          <button onClick={() => { onAddTask(); setOpen(false) }}>
            <span>✏</span> Добавить задачу
          </button>
          <button onClick={() => { onAddNote(); setOpen(false) }}>
            <span>📄</span> Добавить заметку
          </button>
          <button onClick={() => { onAddChild(); setOpen(false) }}>
            <span>+</span> Добавить подпроект
          </button>
          <div className="project-menu__divider" />
          <button onClick={() => { onRename(); setOpen(false) }}>
            <span>✎</span> Переименовать
          </button>
          <button className="project-menu__danger" onClick={() => { onDelete(); setOpen(false) }}>
            <span>×</span> Удалить проект
          </button>
        </div>
      )}
    </div>
  )
}

function ProjectNode({ project, allProjects, tasks, depth = 0 }) {
  const { setSelectedTaskId, selectedTaskId, addProject, deleteProject, updateProject, setFilterProjectId, filterProjectId, addTask, setSelectedProjectId, selectedProjectId } = useTaskContext()
  const [collapsed, setCollapsed] = useState(false)
  const [editingTitle, setEditingTitle] = useState(project.title === '')
  const [titleValue, setTitleValue] = useState(project.title)

  const children = allProjects.filter(p => p.parentId === project.id)
  const projectTasks = tasks.filter(t => t.projectId === project.id)
  const isActive = filterProjectId === project.id || selectedProjectId === project.id

  const handleTitleBlur = () => {
    if (titleValue.trim()) {
      updateProject(project.id, { title: titleValue.trim() })
    }
    setEditingTitle(false)
  }

  const handleAddChild = () => {
    addProject({ parentId: project.id })
    setCollapsed(false)
  }

  return (
    <div className="project-node" style={{ paddingLeft: depth * 16 + 'px' }}>
      <div
        className={`project-node__header ${isActive ? 'project-node__header--active' : ''}`}
        onClick={() => {
          setSelectedProjectId(selectedProjectId === project.id ? null : project.id)
          setFilterProjectId(project.id)
        }}
      >
        <button
          className="project-node__toggle"
          onClick={(e) => {
            e.stopPropagation()
            setCollapsed(c => !c)
          }}
        >
          {(children.length > 0 || projectTasks.length > 0)
            ? (collapsed ? '▶' : '▼')
            : '•'}
        </button>

        {editingTitle ? (
          <input
            autoFocus
            className="project-node__input"
            value={titleValue}
            onChange={e => setTitleValue(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={e => {
              if (e.key === 'Enter') handleTitleBlur()
              if (e.key === 'Escape') {
                if (!project.title) deleteProject(project.id)
                setEditingTitle(false)
              }
            }}
            onClick={e => e.stopPropagation()}
          />
        ) : (
          <span
            className="project-node__title"
            onDoubleClick={e => { e.stopPropagation(); setEditingTitle(true) }}
          >
            {project.title || 'Новый проект'}
          </span>
        )}

        <span className="project-node__count">{projectTasks.length > 0 ? projectTasks.length : ''}</span>

        <ProjectMenu
          onAddTask={() => addTask({ projectId: project.id })}
          onAddNote={() => addTask({ projectId: project.id, type: 'note', title: 'Новая заметка' })}
          onAddChild={() => handleAddChild()}
          onRename={() => setEditingTitle(true)}
          onDelete={() => deleteProject(project.id)}
        />
      </div>

      {!collapsed && (
        <div className="project-node__children">
          {children.map(child => (
            <ProjectNode
              key={child.id}
              project={child}
              allProjects={allProjects}
              tasks={tasks}
              depth={depth + 1}
            />
          ))}
          {projectTasks.map(task => (
            <div
              key={task.id}
              className={`project-task ${selectedTaskId === task.id ? 'project-task--selected' : ''} ${task.status === 'done' ? 'project-task--done' : ''} ${task.type === 'note' ? 'project-task--note' : ''}`}
              style={{ paddingLeft: (depth + 1) * 16 + 16 + 'px' }}
              onClick={(e) => { e.stopPropagation(); setSelectedTaskId(task.id) }}
            >
              {task.type === 'note'
                ? <span className="project-task__note-icon">📄</span>
                : <span className={`project-task__dot project-task__dot--${task.status}`} />}
              <span className="project-task__title">{task.title || 'Без названия'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Projects() {
  const { projects, tasks, filteredTasks, searchQuery, addProject, addTask } = useTaskContext()
  const rootProjects = projects.filter(p => !p.parentId)
  // Use filtered tasks when searching
  const displayTasks = searchQuery ? filteredTasks : tasks

  return (
    <div className="projects">
      <div className="projects__header">
        <span className="projects__heading">Проекты</span>
        <button className="projects__add-btn" onClick={() => addProject({})} title="Новый проект">
          +
        </button>
      </div>
      <div className="projects__list">
        {rootProjects.length === 0 && (
          <p className="projects__empty">Нет проектов. Нажмите + чтобы создать.</p>
        )}
        {rootProjects.map(project => (
          <ProjectNode
            key={project.id}
            project={project}
            allProjects={projects}
            tasks={displayTasks}
            depth={0}
          />
        ))}
      </div>
    </div>
  )
}

export default Projects

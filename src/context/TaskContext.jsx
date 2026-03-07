import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { loadData, saveData } from '../services/storageService'
import { seedTasks, seedProjects } from '../data/seedData'
import { localToday } from '../utils/dateUtils'

const TaskContext = createContext(null)

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const [newTaskId, setNewTaskId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterProjectId, setFilterProjectId] = useState(null)

  // Загрузка данных при старте
  useEffect(() => {
    const data = loadData()
    if (data.tasks.length === 0 && data.projects.length === 0) {
      // Первый запуск — загружаем тестовые данные
      setTasks(seedTasks)
      setProjects(seedProjects)
      saveData({ tasks: seedTasks, projects: seedProjects })
    } else {
      setTasks(data.tasks)
      setProjects(data.projects)
    }
  }, [])

  // Автосохранение при изменении
  useEffect(() => {
    if (tasks.length > 0 || projects.length > 0) {
      saveData({ tasks, projects })
    }
  }, [tasks, projects])

  // ---- Tasks CRUD ----

  const addTask = useCallback((taskData) => {
    const task = {
      id: crypto.randomUUID(),
      title: '',
      description: '',
      links: [],
      notes: '',
      projectId: null,
      dueDate: null,
      status: 'todo',
      type: 'task',
      createdAt: new Date().toISOString(),
      ...taskData,
    }
    setTasks(prev => [...prev, task])
    setSelectedTaskId(task.id)
    setNewTaskId(task.id)
    return task
  }, [])

  const updateTask = useCallback((id, changes) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...changes } : t)))
  }, [])

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id))
    setSelectedTaskId(prev => (prev === id ? null : prev))
  }, [])

  const toggleTaskDone = useCallback((id) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === id ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t
      )
    )
  }, [])

  // ---- Projects CRUD ----

  const addProject = useCallback((data) => {
    const project = {
      id: crypto.randomUUID(),
      title: '',
      parentId: null,
      ...data,
    }
    setProjects(prev => [...prev, project])
    return project
  }, [])

  const updateProject = useCallback((id, changes) => {
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, ...changes } : p)))
  }, [])

  const deleteProject = useCallback((id) => {
    // Удаляем проект и все подпроекты
    const idsToDelete = new Set()
    const collectIds = (parentId) => {
      idsToDelete.add(parentId)
      projects.filter(p => p.parentId === parentId).forEach(p => collectIds(p.id))
    }
    collectIds(id)
    setProjects(prev => prev.filter(p => !idsToDelete.has(p.id)))
    // Снимаем проект с задач
    setTasks(prev =>
      prev.map(t => (idsToDelete.has(t.projectId) ? { ...t, projectId: null } : t))
    )
  }, [projects])

  // ---- Computed ----

  const selectedTask = tasks.find(t => t.id === selectedTaskId) || null

  const filteredTasks = tasks.filter(t => {
    const matchSearch = searchQuery
      ? t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    const matchProject = filterProjectId ? t.projectId === filterProjectId : true
    return matchSearch && matchProject
  })

  const todayStr = localToday()

  const todayTasks = tasks.filter(
    t => t.type !== 'note' && t.dueDate === todayStr && t.status !== 'done'
  )

  const overdueTasks = tasks.filter(
    t => t.type !== 'note' && t.dueDate && t.dueDate < todayStr && t.status !== 'done'
  )

  const inboxTasks = tasks.filter(t => !t.projectId)

  return (
    <TaskContext.Provider
      value={{
        tasks,
        projects,
        filteredTasks,
        selectedTask,
        selectedTaskId,
        setSelectedTaskId,
        newTaskId,
        setNewTaskId,
        todayTasks,
        overdueTasks,
        inboxTasks,
        searchQuery,
        setSearchQuery,
        filterProjectId,
        setFilterProjectId,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskDone,
        addProject,
        updateProject,
        deleteProject,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export function useTaskContext() {
  const ctx = useContext(TaskContext)
  if (!ctx) throw new Error('useTaskContext must be used inside TaskProvider')
  return ctx
}

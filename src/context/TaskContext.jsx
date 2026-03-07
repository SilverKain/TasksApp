import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import {
  subscribeUserTasks,
  subscribeUserProjects,
  upsertTask,
  deleteTaskDoc,
  upsertProject,
  deleteProjectDoc,
  seedUserData,
} from '../firebase/firestoreService'
import { seedTasks, seedProjects } from '../data/seedData'
import { localToday } from '../utils/dateUtils'

const TaskContext = createContext(null)

export function TaskProvider({ children }) {
  const { currentUser } = useAuth()
  const uid = currentUser?.uid

  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [syncLoading, setSyncLoading] = useState(true)
  const [selectedTaskId, setSelectedTaskIdRaw] = useState(null)
  const [selectedProjectId, setSelectedProjectIdRaw] = useState(null)
  const [newTaskId, setNewTaskId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterProjectId, setFilterProjectId] = useState(null)
  const [mobileTab, setMobileTab] = useState('today')

  // Взаимное исключение: выбор задачи сбрасывает проект и наоборот
  const setSelectedTaskId = useCallback((id) => {
    setSelectedTaskIdRaw(id)
    if (id) setSelectedProjectIdRaw(null)
  }, [])

  const setSelectedProjectId = useCallback((id) => {
    setSelectedProjectIdRaw(id)
    if (id) setSelectedTaskIdRaw(null)
  }, [])

  // Подписываемся на Firestore в реальном времени
  useEffect(() => {
    if (!uid) return

    setSyncLoading(true)

    let tasksReady = false
    let projectsReady = false
    let seeded = false

    const checkReady = () => {
      if (tasksReady && projectsReady) setSyncLoading(false)
    }

    // Таймаут — если Firestore не ответил за 10 сек, снимаем спиннер
    const timeout = setTimeout(() => {
      console.warn('Firestore sync timeout')
      setSyncLoading(false)
    }, 10000)

    const handleError = () => {
      setSyncLoading(false)
      clearTimeout(timeout)
    }

    const unsubTasks = subscribeUserTasks(uid, (remoteTasks) => {
      if (!seeded && remoteTasks.length === 0) {
        // Первый вход — записываем seed-данные одним батчем
        seeded = true
        seedUserData(uid, seedTasks, seedProjects).catch(console.error)
        // Не ждём — snapshot придёт сам после записи
        return
      }
      seeded = true
      setTasks(remoteTasks)
      tasksReady = true
      checkReady()
    }, handleError)

    const unsubProjects = subscribeUserProjects(uid, (remoteProjects) => {
      setProjects(remoteProjects)
      projectsReady = true
      checkReady()
    }, handleError)

    return () => {
      clearTimeout(timeout)
      unsubTasks()
      unsubProjects()
    }
  }, [uid])

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
    // Оптимистичное обновление
    setTasks(prev => [...prev, task])
    setSelectedTaskId(task.id)
    setNewTaskId(task.id)
    // Запись в Firestore
    if (uid) upsertTask(uid, task)
    return task
  }, [uid])

  const updateTask = useCallback((id, changes) => {
    setTasks(prev => {
      const updated = prev.map(t => (t.id === id ? { ...t, ...changes } : t))
      if (uid) {
        const task = updated.find(t => t.id === id)
        if (task) upsertTask(uid, task)
      }
      return updated
    })
  }, [uid])

  const archiveCompleted = useCallback(() => {
    setTasks(prev => {
      const updated = prev.map(t =>
        (t.type !== 'note' && t.status === 'done' && !t.archived)
          ? { ...t, archived: true }
          : t
      )
      if (uid) {
        updated.forEach(t => {
          const old = prev.find(p => p.id === t.id)
          if (t.archived && !old?.archived) upsertTask(uid, t)
        })
      }
      return updated
    })
  }, [uid])

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id))
    setSelectedTaskId(prev => (prev === id ? null : prev))
    if (uid) deleteTaskDoc(uid, id)
  }, [uid])

  const toggleTaskDone = useCallback((id) => {
    setTasks(prev => {
      const updated = prev.map(t =>
        t.id === id ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t
      )
      if (uid) {
        const task = updated.find(t => t.id === id)
        if (task) upsertTask(uid, task)
      }
      return updated
    })
  }, [uid])

  // ---- Projects CRUD ----

  const addProject = useCallback((data) => {
    const project = {
      id: crypto.randomUUID(),
      title: '',
      parentId: null,
      ...data,
    }
    setProjects(prev => [...prev, project])
    if (uid) upsertProject(uid, project)
    return project
  }, [uid])

  const updateProject = useCallback((id, changes) => {
    setProjects(prev => {
      const updated = prev.map(p => (p.id === id ? { ...p, ...changes } : p))
      if (uid) {
        const project = updated.find(p => p.id === id)
        if (project) upsertProject(uid, project)
      }
      return updated
    })
  }, [uid])

  const deleteProject = useCallback((id) => {
    // Собираем все id для удаления (проект + подпроекты)
    const idsToDelete = new Set()
    const collectIds = (parentId) => {
      idsToDelete.add(parentId)
      projects.filter(p => p.parentId === parentId).forEach(p => collectIds(p.id))
    }
    collectIds(id)

    setProjects(prev => prev.filter(p => !idsToDelete.has(p.id)))
    setTasks(prev =>
      prev.map(t => {
        if (idsToDelete.has(t.projectId)) {
          const updated = { ...t, projectId: null }
          if (uid) upsertTask(uid, updated)
          return updated
        }
        return t
      })
    )

    if (uid) {
      idsToDelete.forEach(pid => deleteProjectDoc(uid, pid))
    }
  }, [uid, projects])

  // ---- Computed ----

  const selectedTask = tasks.find(t => t.id === selectedTaskId) || null

  const filteredTasks = tasks.filter(t => {
    if (t.archived) return false
    const matchSearch = searchQuery
      ? t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    const matchProject = filterProjectId ? t.projectId === filterProjectId : true
    return matchSearch && matchProject
  })

  const todayStr = localToday()

  const todayTasks = tasks.filter(
    t => !t.archived && t.type !== 'note' && t.dueDate === todayStr && t.status !== 'done'
  )

  const overdueTasks = tasks.filter(
    t => !t.archived && t.type !== 'note' && t.dueDate && t.dueDate < todayStr && t.status !== 'done'
  )

  const inboxTasks = tasks.filter(t => !t.archived && !t.projectId)

  return (
    <TaskContext.Provider
      value={{
        tasks,
        projects,
        filteredTasks,
        selectedTask,
        selectedTaskId,
        setSelectedTaskId,
        selectedProjectId,
        setSelectedProjectId,
        newTaskId,
        setNewTaskId,
        mobileTab,
        setMobileTab,
        syncLoading,
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
        archiveCompleted,
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

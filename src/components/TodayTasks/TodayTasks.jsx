import React, { useState } from 'react'
import { useTaskContext } from '../../context/TaskContext'
import TaskItem from '../TaskItem/TaskItem'
import './TodayTasks.css'

function TodayTasks() {
  const { todayTasks, overdueTasks, addTask } = useTaskContext()
  const [newTitle, setNewTitle] = useState('')

  const handleAdd = (e) => {
    e.preventDefault()
    if (newTitle.trim()) {
      addTask({
        title: newTitle.trim(),
        dueDate: new Date().toISOString().slice(0, 10),
      })
      setNewTitle('')
    }
  }

  return (
    <div className="today-tasks">
      <div className="today-tasks__header">
        <span className="today-tasks__heading">Сегодня</span>
        <span className="today-tasks__count">{todayTasks.length}</span>
      </div>

      {overdueTasks.length > 0 && (
        <div className="today-tasks__section">
          <div className="today-tasks__section-label today-tasks__section-label--overdue">
            ⚠ Просроченные ({overdueTasks.length})
          </div>
          {overdueTasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}

      <div className="today-tasks__section">
        {todayTasks.length === 0 && overdueTasks.length === 0 && (
          <p className="today-tasks__empty">Задач на сегодня нет 🎉</p>
        )}
        {todayTasks.map(task => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>

      <form className="today-tasks__add-form" onSubmit={handleAdd}>
        <input
          className="today-tasks__add-input"
          placeholder="+ Быстро добавить задачу..."
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
        />
      </form>
    </div>
  )
}

export default TodayTasks

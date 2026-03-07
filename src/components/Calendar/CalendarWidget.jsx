import React, { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { useTaskContext } from '../../context/TaskContext'
import { getTasksForDate } from '../../utils/dateUtils'
import TaskItem from '../TaskItem/TaskItem'
import './CalendarWidget.css'

function CalendarWidget() {
  const { tasks, setSelectedTaskId } = useTaskContext()
  const [selectedDate, setSelectedDate] = useState(new Date())

  const tasksForDate = getTasksForDate(tasks, selectedDate)

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null
    const dayTasks = getTasksForDate(tasks, date)
    if (dayTasks.length === 0) return null
    return (
      <span className="calendar-widget__task-badge">
        {dayTasks.length}
      </span>
    )
  }

  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return null
    const dayTasks = getTasksForDate(tasks, date)
    if (dayTasks.length > 0) return 'has-tasks'
    return null
  }

  return (
    <div className="calendar-widget">
      <div className="calendar-widget__header">
        <span className="calendar-widget__heading">Календарь</span>
      </div>
      <div className="calendar-widget__calendar-wrap">
        <Calendar
          value={selectedDate}
          onChange={setSelectedDate}
          locale="ru-RU"
          tileContent={tileContent}
          tileClassName={tileClassName}
        />
      </div>
      {tasksForDate.length > 0 && (
        <div className="calendar-widget__tasks">
          <div className="calendar-widget__tasks-label">
            Задачи на {selectedDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}:
          </div>
          {tasksForDate.map(task => (
            <TaskItem key={task.id} task={task} showProject />
          ))}
        </div>
      )}
      {tasksForDate.length === 0 && (
        <div className="calendar-widget__tasks-empty">
          Задач на этот день нет
        </div>
      )}
    </div>
  )
}

export default CalendarWidget

import React from 'react'
import TaskDetails from '../TaskDetails/TaskDetails'
import ProjectView from '../ProjectView/ProjectView'
import { useTaskContext } from '../../context/TaskContext'
import './CenterPanel.css'

function CenterPanel() {
  const { selectedProjectId, selectedTaskId } = useTaskContext()

  return (
    <main className="center-panel">
      {selectedProjectId && !selectedTaskId
        ? <ProjectView />
        : <TaskDetails />}
    </main>
  )
}

export default CenterPanel

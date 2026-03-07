import React from 'react'
import Layout from '../components/Layout/Layout'
import { useTaskContext } from '../context/TaskContext'
import './MainPage.css'

function MainPage() {
  const { syncLoading } = useTaskContext()

  if (syncLoading) {
    return (
      <div className="main-page main-page--loading">
        <div className="main-page__spinner" />
        <p>Синхронизация данных...</p>
      </div>
    )
  }

  return (
    <div className="main-page">
      <Layout />
    </div>
  )
}

export default MainPage

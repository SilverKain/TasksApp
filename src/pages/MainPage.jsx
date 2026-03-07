import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout'
import { useTaskContext } from '../context/TaskContext'
import './MainPage.css'

function MainPage() {
  const { syncLoading } = useTaskContext()
  const [slowNetwork, setSlowNetwork] = useState(false)

  useEffect(() => {
    if (!syncLoading) { setSlowNetwork(false); return }
    const t = setTimeout(() => setSlowNetwork(true), 5000)
    return () => clearTimeout(t)
  }, [syncLoading])

  if (syncLoading) {
    return (
      <div className="main-page main-page--loading">
        <div className="main-page__spinner" />
        <p>Синхронизация данных...</p>
        {slowNetwork && (
          <p className="main-page__hint">
            Долго идёт? Проверьте настройки Firestore Rules и включённую базу данных в Firebase Console.
          </p>
        )}
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

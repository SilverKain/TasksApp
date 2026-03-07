import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { logout } from '../../firebase/authService'
import './UserBadge.css'

/**
 * variant: 'sidebar' (desktop left panel) | 'mobile' (mobile tab bar area)
 */
export default function UserBadge({ variant = 'sidebar' }) {
  const { currentUser } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  if (!currentUser) return null

  const displayName = currentUser.displayName || currentUser.email?.split('@')[0] || 'Пользователь'
  const email = currentUser.email || ''
  const photoURL = currentUser.photoURL
  const initials = displayName.slice(0, 2).toUpperCase()

  const handleLogout = async () => {
    setMenuOpen(false)
    await logout()
  }

  return (
    <div className={`user-badge user-badge--${variant}`}>
      <button
        className="user-badge__trigger"
        onClick={() => setMenuOpen(v => !v)}
        title={email}
      >
        {photoURL ? (
          <img className="user-badge__avatar" src={photoURL} alt={displayName} referrerPolicy="no-referrer" />
        ) : (
          <span className="user-badge__initials">{initials}</span>
        )}
        {variant === 'sidebar' && (
          <div className="user-badge__info">
            <span className="user-badge__name">{displayName}</span>
            <span className="user-badge__email">{email}</span>
          </div>
        )}
      </button>

      {menuOpen && (
        <>
          <div className="user-badge__overlay" onClick={() => setMenuOpen(false)} />
          <div className="user-badge__dropdown">
            <div className="user-badge__dropdown-header">
              <strong>{displayName}</strong>
              <span>{email}</span>
            </div>
            <hr className="user-badge__dropdown-divider" />
            <button className="user-badge__logout" onClick={handleLogout}>
              🚪 Выйти
            </button>
          </div>
        </>
      )}
    </div>
  )
}

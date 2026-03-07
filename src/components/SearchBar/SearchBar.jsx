import React from 'react'
import { useTaskContext } from '../../context/TaskContext'
import './SearchBar.css'

function SearchBar() {
  const { searchQuery, setSearchQuery } = useTaskContext()

  return (
    <div className="search-bar">
      <span className="search-bar__icon">🔍</span>
      <input
        className="search-bar__input"
        type="search"
        placeholder="Поиск задач..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <button className="search-bar__clear" onClick={() => setSearchQuery('')} title="Очистить">
          ×
        </button>
      )}
    </div>
  )
}

export default SearchBar

import React, { useEffect } from 'react'
import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { socket } from './api'
import VotePage from './pages/VotePage'
import LeaderboardPage from './pages/LeaderboardPage'
import AdminPage from './pages/AdminPage'
import './App.css'

export default function App() {
  const location = useLocation()
  useEffect(() => {
    socket.connect()
    return () => socket.disconnect()
  }, [])

  const isBoard = location.pathname === '/board'
  const isAdmin = location.pathname === '/admin'

  // Leaderboard: full screen no nav
  // Admin: show nav with all links
  // Vote page: show nav with ONLY Vote link (no leaderboard for voters)

  return (
    <div className="app-shell">
      {!isBoard && (
        <nav className="top-nav">
          <span className="nav-logo">🗳 HackVote</span>
          <div className="nav-links">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Vote
            </NavLink>
            {isAdmin && (
              <>
                <NavLink to="/board" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  Leaderboard
                </NavLink>
                <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  Admin
                </NavLink>
              </>
            )}
          </div>
        </nav>
      )}
      <main className={isBoard ? 'main-full' : 'main-content'}>
        <Routes>
          <Route path="/" element={<VotePage />} />
          <Route path="/board" element={<LeaderboardPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { api, getStoredPin, storePin, clearPin } from '../api'
import './AdminPage.css'

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(!!getStoredPin())
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  const [event, setEvent] = useState(null)
  const [teams, setTeams] = useState([])
  const [stats, setStats] = useState(null)
  const [qr, setQr] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [newTeamName, setNewTeamName] = useState('')
  const [editingTeam, setEditingTeam] = useState(null)
  const [loading, setLoading] = useState(false)
  const [{ event, teams }, stats, qrData] = await Promise.all([
  api.getEvent(),
  api.getStats(),
  api.getQR(),
])
  useEffect(() => {
    if (loggedIn) loadAll()
  }, [loggedIn])

  async function loadAll() {
    setLoading(true)
    try {
      const [{ event, teams }, stats, qrData] = await Promise.all([
        api.getEvent(),
        api.getStats(),
        api.getQR(),
      ])

      setEvent(event)
      setTeams(teams)
      setStats(stats)
      setEditTitle(event?.title || '')
      setQr(qrData)
    } catch (e) {
      if (e.response?.status === 401 || e.status === 401) {
        logout()
        return
      }
      console.error(e)
    }
    setLoading(false)
  }

  async function handleLogin() {
    setLoginLoading(true)
    setPinError('')
    try {
      await api.verifyPin(pin)
      storePin(pin)
      setLoggedIn(true)
    } catch (e) {
      setPinError('Incorrect PIN. Try again.')
    }
    setLoginLoading(false)
  }

  function logout() {
    clearPin()
    setLoggedIn(false)
    setPin('')
  }

  async function handleUpdateTitle() {
    if (!editTitle.trim()) return
    const updated = await api.updateEvent({ title: editTitle.trim() })
    setEvent(updated)
  }

  async function handleToggleVoting() {
    const updated = await api.updateEvent({ isVotingOpen: !event.isVotingOpen })
    setEvent(updated)
  }

  async function handleAddTeam() {
    if (!newTeamName.trim()) return
    const t = await api.addTeam(newTeamName.trim())
    setTeams(prev => [...prev, t])
    setNewTeamName('')
    loadStats()
  }

  async function handleRenameTeam(id) {
    if (!editingTeam?.name.trim()) return
    const updated = await api.renameTeam(id, editingTeam.name)
    setTeams(prev => prev.map(t => t._id === id ? { ...t, name: updated.name } : t))
    setEditingTeam(null)
  }

  async function handleDeleteTeam(id) {
    if (!window.confirm('Delete this team and all its votes?')) return
    await api.deleteTeam(id)
    setTeams(prev => prev.filter(t => t._id !== id))
    loadStats()
  }

  async function handleResetVotes() {
    if (!window.confirm('Reset ALL votes? This cannot be undone.')) return
    await api.resetVotes()
    loadStats()
  }

  async function loadStats() {
    const s = await api.getStats()
    setStats(s)
  }

  function downloadQR() {
    if (!qr?.qr) return
    const a = document.createElement('a')
    a.href = qr.qr
    a.download = 'hackvote-qr.png'
    a.click()
  }

  if (!loggedIn) {
    return (
      <div className="admin-login-wrap fade-in">
        <div className="card admin-login-card">
          <div className="admin-login-icon">🔐</div>
          <h2>Admin Access</h2>
          <p className="admin-login-sub">Enter your admin PIN to continue</p>

          <input
            className="input"
            type="password"
            placeholder="PIN"
            value={pin}
            onChange={e => setPin(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            autoFocus
          />

          {pinError && <p className="pin-error">{pinError}</p>}

          <button
            className="btn btn-primary"
            onClick={handleLogin}
            disabled={loginLoading || !pin}
          >
            {loginLoading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : 'Login'}
          </button>

          <p className="admin-hint">Default PIN: 1234 · Set in backend .env</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}>
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div className="admin-page slide-up">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <button className="btn" onClick={logout}>Logout</button>
      </div>

      {stats && (
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-num">{stats.teams}</div>
            <div className="stat-label">Teams</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">{stats.totalVotes}</div>
            <div className="stat-label">Total Votes</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">{stats.uniqueVoters}</div>
            <div className="stat-label">Unique Voters</div>
          </div>
        </div>
      )}

      <section className="admin-section">
        <h3 className="section-title">Event Title</h3>
        <div className="row-gap">
          <input
            className="input"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            placeholder="Event title"
          />
          <button className="btn btn-primary" onClick={handleUpdateTitle}>Update</button>
        </div>

        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 14, color: 'var(--text2)' }}>
            Voting:{' '}
            <strong style={{ color: event?.isVotingOpen ? 'var(--green)' : 'var(--red)' }}>
              {event?.isVotingOpen ? 'Open' : 'Closed'}
            </strong>
          </span>

          <button
            className={`btn ${event?.isVotingOpen ? 'btn-danger' : 'btn-success'}`}
            style={{ padding: '6px 14px', fontSize: 13 }}
            onClick={handleToggleVoting}
          >
            {event?.isVotingOpen ? 'Close Voting' : 'Open Voting'}
          </button>
        </div>
      </section>

      <section className="admin-section">
        <h3 className="section-title">Teams</h3>

        <div className="teams-admin-list">
          {teams.map((t, i) => (
            <div key={t._id} className="team-admin-row">
              <span
                className={`tag team-color-${t.colorIndex % 6}`}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  border: '1px solid',
                  flexShrink: 0
                }}
              >
                {i + 1}
              </span>

              {editingTeam?._id === t._id ? (
                <>
                  <input
                    className="input"
                    value={editingTeam.name}
                    onChange={e => setEditingTeam(prev => ({ ...prev, name: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && handleRenameTeam(t._id)}
                    autoFocus
                    style={{ flex: 1 }}
                  />
                  <button
                    className="btn btn-success"
                    style={{ padding: '6px 12px', fontSize: 13 }}
                    onClick={() => handleRenameTeam(t._id)}
                  >
                    Save
                  </button>
                  <button
                    className="btn"
                    style={{ padding: '6px 12px', fontSize: 13 }}
                    onClick={() => setEditingTeam(null)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span className="team-admin-name">{t.name}</span>
                  <button
                    className="btn"
                    style={{ padding: '6px 12px', fontSize: 13 }}
                    onClick={() => setEditingTeam({ _id: t._id, name: t.name })}
                  >
                    ✏️ Rename
                  </button>
                  <button
                    className="btn btn-danger"
                    style={{ padding: '6px 12px', fontSize: 13 }}
                    onClick={() => handleDeleteTeam(t._id)}
                  >
                    ✕
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="row-gap" style={{ marginTop: 12 }}>
          <input
            className="input"
            value={newTeamName}
            onChange={e => setNewTeamName(e.target.value)}
            placeholder="New team name"
            onKeyDown={e => e.key === 'Enter' && handleAddTeam()}
          />
          <button
            className="btn btn-primary"
            onClick={handleAddTeam}
            disabled={!newTeamName.trim()}
          >
            + Add Team
          </button>
        </div>
      </section>

      <section className="admin-section">
        <h3 className="section-title">Voting QR Code</h3>
        <div className="qr-section card">
          {qr?.qr ? (
            <>
              <img src={qr.qr} alt="QR Code" className="qr-img" />
              <p className="qr-url">{qr.url}</p>
              <button className="btn btn-primary" onClick={downloadQR}>
                ⬇️ Download QR
              </button>
              <p className="qr-hint">Only share this with the event team. Voters don't see QR options.</p>
            </>
          ) : (
            <div className="spinner" />
          )}
        </div>
      </section>

      <section className="admin-section">
        <h3 className="section-title">Danger Zone</h3>
        <button className="btn btn-danger" onClick={handleResetVotes}>
          🗑 Reset All Votes
        </button>
      </section>
    </div>
  )
}
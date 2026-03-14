import React, { useState, useEffect, useRef } from 'react'
import { api, socket } from '../api'
import './LeaderboardPage.css'

const RANKS = ['🥇', '🥈', '🥉']

export default function LeaderboardPage() {
  const [teams, setTeams] = useState([])
  const [eventTitle, setEventTitle] = useState('Hackathon 2025')
  const [totalVotes, setTotalVotes] = useState(0)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)
  const prevCountsRef = useRef({})

  useEffect(() => {
    // Initial load
    loadData()

    // Socket.io for live updates
    socket.on('leaderboard_update', handleUpdate)
    socket.on('event_update', (e) => setEventTitle(e.title))

    return () => {
      socket.off('leaderboard_update', handleUpdate)
      socket.off('event_update')
    }
  }, [])

  async function loadData() {
    try {
      const [lb, { event }] = await Promise.all([
        api.getLeaderboard(),
        api.getEvent(),
      ])
      handleUpdate(lb)
      setEventTitle(event.title)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  function handleUpdate(data) {
    setTeams(data)
    const total = data.reduce((s, t) => s + t.votes, 0)
    setTotalVotes(total)
    setLastUpdated(new Date())
    prevCountsRef.current = Object.fromEntries(data.map(t => [t._id, t.votes]))
  }

  const maxVotes = Math.max(...teams.map(t => t.votes), 1)

  if (loading) return (
    <div className="board-loading">
      <div className="spinner" style={{ width: 32, height: 32 }} />
    </div>
  )

  return (
    <div className="board-page">
      {/* Header */}
      <div className="board-header">
        <div className="board-title-row">
          <h1 className="board-title">{eventTitle}</h1>
          <div className="live-badge">
            <span className="live-dot" />
            LIVE
          </div>
        </div>
        <p className="board-sub">
          {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'} cast
          {lastUpdated && <span> · updated {lastUpdated.toLocaleTimeString()}</span>}
        </p>
      </div>

      {/* Leaderboard rows */}
      <div className="board-list">
        {teams.length === 0 ? (
          <div className="board-empty">No votes yet. Be the first!</div>
        ) : teams.map((team, i) => {
          const pct = totalVotes > 0 ? Math.round((team.votes / totalVotes) * 100) : 0
          const barWidth = maxVotes > 0 ? (team.votes / maxVotes) * 100 : 0
          const isFirst = i === 0 && team.votes > 0

          return (
            <div key={team._id} className={`board-row ${isFirst ? 'board-row-first' : ''} fade-in`} style={{ animationDelay: `${i * 0.06}s` }}>
              <div className="board-rank">
                {i < 3 && team.votes > 0 ? RANKS[i] : <span className="rank-num">{i + 1}</span>}
              </div>

              <div className="board-team-info">
                <div className="board-team-name">{team.name}</div>
                <div className="board-bar-row">
                  <div className="board-bar-bg">
                    <div
                      className={`board-bar-fill bar-color-${team.colorIndex % 6}`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <span className="board-pct">{pct}%</span>
                </div>
              </div>

              <div className="board-votes">
                <span className="board-vote-num" key={team.votes}>
                  {team.votes}
                </span>
                <span className="board-vote-label">votes</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="board-footer">
        <span>Scan the QR code to vote</span>
      </div>
    </div>
  )
}

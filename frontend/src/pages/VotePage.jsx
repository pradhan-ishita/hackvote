import React, { useState, useEffect } from 'react'
import { api, getVoterId } from '../api'
import './VotePage.css'

export default function VotePage() {
  const [event, setEvent] = useState(null)
  const [teams, setTeams] = useState([])
  const [myVoteId, setMyVoteId] = useState(null)
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [voted, setVoted] = useState(false)
  const [votedTeamName, setVotedTeamName] = useState('')
  const [wasChange, setWasChange] = useState(false)
  const voterId = getVoterId()

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const [{ event, teams }, { teamId }] = await Promise.all([
        api.getEvent(),
        api.getMyVote(voterId),
      ])
      setEvent(event)
      setTeams(teams)
      setMyVoteId(teamId)
      setSelected(teamId)
      if (teamId) setVoted(true)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  async function handleVote() {
    if (!selected) return
    setSubmitting(true)
    try {
      const res = await api.castVote(voterId, selected)
      setMyVoteId(selected)
      setVoted(true)
      setVotedTeamName(res.teamName)
      setWasChange(res.changed)
    } catch (e) {
      alert(e.response?.data?.error || 'Something went wrong')
    }
    setSubmitting(false)
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}>
      <div className="spinner" />
    </div>
  )

  if (!event?.isVotingOpen) return (
    <div className="vote-closed card">
      <div className="vote-closed-icon">🔒</div>
      <h2>Voting is Closed</h2>
      <p>The organizers have closed voting. Check the leaderboard for results!</p>
    </div>
  )

  if (voted) return (
    <div className="voted-confirm fade-in card">
      <div className="voted-icon">✅</div>
      <h2>Vote Recorded!</h2>
      <p className="voted-for">You voted for <strong>{votedTeamName}</strong></p>
      {wasChange && <p className="voted-changed">Your previous vote was cancelled.</p>}
      <button className="btn" onClick={() => { setVoted(false) }} style={{ marginTop: 20 }}>
        ✏️ Change my vote
      </button>
    </div>
  )

  return (
    <div className="vote-page slide-up">
      <div className="vote-header">
        <h1>{event?.title}</h1>
        <p className="vote-sub">Pick your favourite team. You can change your vote — your previous one will be cancelled.</p>
      </div>

      <div className="teams-list">
        {teams.map((t, i) => {
          const isSelected = selected === t._id
          const isMine = myVoteId === t._id
          return (
            <button
              key={t._id}
              className={`team-card ${isSelected ? 'selected' : ''} ${isMine && !isSelected ? 'my-prev' : ''}`}
              onClick={() => setSelected(t._id)}
            >
              <span className={`team-badge tag team-color-${t.colorIndex % 6}`}>
                {i + 1}
              </span>
              <span className="team-card-name">{t.name}</span>
              {isMine && (
                <span className="current-tag tag">Your vote</span>
              )}
              <span className={`radio-dot ${isSelected ? 'radio-on' : ''}`} />
            </button>
          )
        })}
      </div>

      {selected && myVoteId && selected !== myVoteId && (
        <div className="change-warning fade-in">
          ⚠️ This will cancel your vote for <strong>{teams.find(t => t._id === myVoteId)?.name}</strong> and count it for the new team.
        </div>
      )}

      <button
        className="btn btn-primary cast-btn"
        onClick={handleVote}
        disabled={!selected || submitting}
      >
        {submitting ? <span className="spinner" style={{ width: 16, height: 16 }} /> : '🗳 Cast Vote'}
      </button>
    </div>
  )
}

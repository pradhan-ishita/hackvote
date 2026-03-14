import axios from 'axios'
import { io } from 'socket.io-client'

const API_BASE = import.meta.env.VITE_API_URL || 'https://hackvote.onrender.com'
const SOCKET_URL = import.meta.env.VITE_API_URL || 'https://hackvote.onrender.com'
export function getVoterId() {
  let id = localStorage.getItem('hackvote_voter_id')
  if (!id) {
    id = 'v_' + Math.random().toString(36).slice(2, 12) + Date.now().toString(36)
    localStorage.setItem('hackvote_voter_id', id)
  }
  return id
}

export function getStoredPin() { return sessionStorage.getItem('hackvote_admin_pin') || '' }
export function storePin(pin) { sessionStorage.setItem('hackvote_admin_pin', pin) }
export function clearPin() { sessionStorage.removeItem('hackvote_admin_pin') }

function adminHeaders() {
  return { 'x-admin-pin': getStoredPin() }
}

export const api = {
  getEvent:     () => axios.get(`${API_BASE}/api/event`).then(r => r.data),
  getLeaderboard: () => axios.get(`${API_BASE}/api/leaderboard`).then(r => r.data),
  getMyVote:    (voterId) => axios.get(`${API_BASE}/api/my-vote/${voterId}`).then(r => r.data),
  castVote:     (voterId, teamId) => axios.post(`${API_BASE}/api/vote`, { voterId, teamId }).then(r => r.data),
  verifyPin:    (pin) => axios.post(`${API_BASE}/api/admin/verify`, { pin }).then(r => r.data),
  updateEvent:  (data) => axios.put(`${API_BASE}/api/admin/event`, data, { headers: adminHeaders() }).then(r => r.data),
  addTeam:      (name) => axios.post(`${API_BASE}/api/admin/teams`, { name }, { headers: adminHeaders() }).then(r => r.data),
  renameTeam:   (id, name) => axios.put(`${API_BASE}/api/admin/teams/${id}`, { name }, { headers: adminHeaders() }).then(r => r.data),
  deleteTeam:   (id) => axios.delete(`${API_BASE}/api/admin/teams/${id}`, { headers: adminHeaders() }).then(r => r.data),
  resetVotes:   () => axios.delete(`${API_BASE}/api/admin/votes`, { headers: adminHeaders() }).then(r => r.data),
  getStats:     () => axios.get(`${API_BASE}/api/admin/stats`, { headers: adminHeaders() }).then(r => r.data),
  getQR:        () => axios.get(`${API_BASE}/api/admin/qr`, { headers: adminHeaders() }).then(r => r.data),
}

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['polling', 'websocket'],  // polling first for Render
})
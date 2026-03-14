const API_BASE_URL = 'https://hackvote.onrender.com'
const PIN_KEY = 'adminPin'

export function getStoredPin() {
  return localStorage.getItem(PIN_KEY) || ''
}

export function storePin(pin) {
  localStorage.setItem(PIN_KEY, pin)
}

export function clearPin() {
  localStorage.removeItem(PIN_KEY)
}

async function request(path, options = {}) {
  const pin = getStoredPin()

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  if (pin) {
    headers['x-admin-pin'] = pin
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const error = new Error(data?.error || 'Request failed')
    error.status = res.status
    error.response = { status: res.status, data }
    throw error
  }

  return data
}

export const api = {
  getEvent: () => request('/api/event'),

  verifyPin: (pin) =>
    request('/api/admin/verify', {
      method: 'POST',
      body: JSON.stringify({ pin }),
    }),

  getStats: () => request('/api/admin/stats'),

  getQR: () => request('/api/admin/qr'),

  updateEvent: (payload) =>
    request('/api/admin/event', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  addTeam: (name) =>
    request('/api/admin/teams', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),

  renameTeam: (id, name) =>
    request(`/api/admin/teams/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    }),

  deleteTeam: (id) =>
    request(`/api/admin/teams/${id}`, {
      method: 'DELETE',
    }),

  resetVotes: () =>
    request('/api/admin/votes', {
      method: 'DELETE',
    }),
}
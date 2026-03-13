# 🗳 HackVote — Hackathon Voting System

A real-time voting system with a live leaderboard, QR-based voter access, and an admin panel.

## Project Structure

```
hackvote/
├── backend/          # Node.js + Express + MongoDB + Socket.io
│   ├── server.js
│   ├── models.js
│   ├── .env.example
│   └── package.json
├── frontend/         # React + Vite
│   ├── src/
│   │   ├── pages/
│   │   │   ├── VotePage.jsx       ← Mobile voting screen
│   │   │   ├── LeaderboardPage.jsx ← Public display screen
│   │   │   └── AdminPage.jsx      ← Admin panel
│   │   ├── App.jsx
│   │   ├── api.js
│   │   └── index.css
│   └── package.json
└── README.md
```

---

## Prerequisites

Make sure these are installed:

- **Node.js** v18+ → https://nodejs.org
- **MongoDB** (local) → https://www.mongodb.com/try/download/community
  - Or use **MongoDB Atlas** (free cloud) → https://www.mongodb.com/atlas

---

## Setup (Step by Step)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your values:

```env
MONGO_URI=mongodb://localhost:27017/hackvote
PORT=5000
ADMIN_PIN=1234
FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

You should see:
```
✅ MongoDB connected
📋 Default event created
👥 Default teams created
🚀 Server running on http://localhost:5000
```

---

### 2. Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

---

## The Three Screens

| Screen | URL | Who uses it |
|--------|-----|-------------|
| **Vote** | `http://localhost:5173/` | Voters (after scanning QR) |
| **Leaderboard** | `http://localhost:5173/board` | Public display / projector |
| **Admin** | `http://localhost:5173/admin` | Organizer only |

---

## How It Works

### Voting Flow
1. Admin generates QR from the Admin panel
2. Audience scans QR → lands on Vote page
3. Voter selects a team → clicks Cast Vote
4. If they vote again → previous vote is cancelled, new vote is counted
5. Leaderboard updates **instantly** via Socket.io

### Admin Panel (PIN: `1234` by default)
- ✏️ Rename event title at any time
- ➕ Add / rename / delete teams
- 🔒 Open or close voting
- 📊 See live stats (total votes, unique voters)
- 📲 Download QR code for printing
- 🗑 Reset all votes

### Leaderboard
- Live updates via Socket.io (no refresh needed)
- Designed to look great on a projector or large screen
- Open `http://localhost:5173/board` in full-screen mode

---

## Changing the Admin PIN

In `backend/.env`:
```
ADMIN_PIN=your_new_pin_here
```
Restart the backend after changing.

---

## Using MongoDB Atlas (Cloud, No Local Install)

1. Go to https://www.mongodb.com/atlas and create a free cluster
2. Get your connection string — looks like:
   `mongodb+srv://username:password@cluster.mongodb.net/hackvote`
3. Paste it into `backend/.env` as `MONGO_URI`

---

## VS Code Tips

- Install the **MongoDB for VS Code** extension to browse your database
- Install **Thunder Client** extension to test API endpoints
- Use the **split terminal** to run backend and frontend side by side

---

## Common Issues

**MongoDB connection error**
→ Make sure MongoDB is running: `mongod` or start it from MongoDB Compass

**Port already in use**
→ Change `PORT=5001` in `.env` and update `vite.config.js` proxy target

**Votes not updating on leaderboard**
→ Check that both backend and frontend are running; Socket.io needs the backend

require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const QRCode = require('qrcode');
const { Event, Team, Vote } = require('./models');

const app = express();
const server = http.createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ── Socket.io ──────────────────────────────────────────────────────
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
  transports: ['polling', 'websocket'],
  allowEIO3: true,
});

// ── Middleware ─────────────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());

// ── DB ─────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hackvote')
  .then(() => { console.log('✅ MongoDB connected'); seedDefaultData(); })
  .catch(err => console.error('❌ MongoDB error:', err));

const DEFAULT_TEAMS = [
  { id: 'S-1',  name: 'Maze Runner' },
  { id: 'S-2',  name: 'Smart AI Assistant' },
  { id: 'S-3',  name: 'Path Hole Detector' },
  { id: 'S-4',  name: 'AI-Based Study Productivity & Consistency Intelligence System' },
  { id: 'S-5',  name: 'Anti Theft Protection Module' },
  { id: 'S-6',  name: 'Drone System' },
  { id: 'S-7',  name: 'Autonomous Disaster Mapping Robot using CPS & Digital Twin' },
  { id: 'S-8',  name: 'Smart Waste Segregation and Recycling System' },
  { id: 'S-9',  name: 'Smart Accident Detection & Emergency Response System' },
  { id: 'S-10', name: 'Autonomous Multi-Agent Energy Negotiation System for Smart Hotels' },
  { id: 'S-11', name: 'Ultra-Wideband Real-Time Location System' },
  { id: 'S-12', name: 'Current Theft Detection' },
  { id: 'S-13', name: 'Face Recognition Based Attendance System using ESP32 CAM & OpenCV' },
  { id: 'S-14', name: 'Obstacle Avoider' },
  { id: 'S-15', name: 'WiFi Internet Clock' },
  { id: 'S-16', name: 'Edge AI-Powered Industrial Fault Prediction System' },
  { id: 'S-17', name: 'Smart Home Automation' },
  { id: 'S-18', name: 'Smart Classroom' },
  { id: 'S-19', name: 'Smart Airport Health Monitoring System (ESP32)' },
  { id: 'S-20', name: 'KIIT Bus Tracking' },
  { id: 'S-21', name: 'AI Predictive Maintenance Agent' },
  { id: 'S-22', name: 'IoT-Based Animal Trespassing Alert System' },
  { id: 'S-23', name: 'Camera-Based AI Crowd Management System (RPi5 + YOLO + OpenCV)' },
  { id: 'S-24', name: 'Automatic Traffic Management System' },
  { id: 'S-25', name: 'AI-Powered IoT Smart Agriculture System' },
  { id: 'S-26', name: 'Health Monitoring System' },
  { id: 'S-27', name: 'Intelligent IoT Cloud Platform' },
  { id: 'S-28', name: 'IoT-Based Women Safety Device with Live Location + Emergency Alert' },
  { id: 'S-29', name: 'AI-Based Centralized Smart LPG Safety Monitoring & Valve Control' },
  { id: 'S-30', name: 'Smart Parking System' },
  { id: 'S-31', name: 'Obstacle Detection Car' },
  { id: 'S-32', name: 'IoT-Based Smart Greenhouse Monitoring and Automation System' },
  { id: 'S-33', name: 'KIIT Predictive Crowd & Infrastructure Intelligence System (K-PCIS)' },
  { id: 'S-34', name: 'Smart IV Drip Sensor' },
  { id: 'S-35', name: 'LPG Gas Detection' },
  { id: 'S-36', name: 'Smart Pill Box' },
  { id: 'S-37', name: 'AI-Powered Smart Patient Safety & Early Warning Monitoring System' },
  { id: 'S-38', name: 'Eco-Flow: Automated IoT Waste Management & Logistics System' },
  { id: 'S-39', name: 'AgroMind AI' },
  { id: 'S-40', name: 'IoT-Based Intelligent Monitoring & Control System (ESP8266 + Cloud)' },
  { id: 'S-41', name: 'Smart SeatX: Real-Time Occupancy and Seating Analytics Platform' },
];

async function seedDefaultData() {
  const count = await Event.countDocuments();
  if (count === 0) await Event.create({ title: 'Hackathon 2025' });
  const teamCount = await Team.countDocuments();
  if (teamCount === 0) {
    for (let i = 0; i < DEFAULT_TEAMS.length; i++) {
      const { id, name } = DEFAULT_TEAMS[i];
      await Team.create({ name: `[${id}] ${name}`, colorIndex: i % 6, order: i });
    }
    console.log(`👥 ${DEFAULT_TEAMS.length} teams seeded`);
  }
}

async function buildLeaderboard() {
  const teams = await Team.find().sort({ order: 1 });
  const votes = await Vote.find();
  const countMap = {};
  teams.forEach(t => (countMap[t._id.toString()] = 0));
  votes.forEach(v => { const k = v.teamId.toString(); if (countMap[k] !== undefined) countMap[k]++; });
  const result = teams.map(t => ({ _id: t._id, name: t.name, colorIndex: t.colorIndex, order: t.order, votes: countMap[t._id.toString()] }));
  result.sort((a, b) => b.votes - a.votes);
  return result;
}

function emitLeaderboardUpdate() {
  buildLeaderboard().then(data => io.emit('leaderboard_update', data));
}

function adminAuth(req, res, next) {
  const pin = req.headers['x-admin-pin'];
  if (pin !== (process.env.ADMIN_PIN || '1234')) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

// ── Routes ─────────────────────────────────────────────────────────
app.get('/api/event', async (req, res) => {
  try { const event = await Event.findOne(); const teams = await Team.find().sort({ order: 1 }); res.json({ event, teams }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/leaderboard', async (req, res) => {
  try { res.json(await buildLeaderboard()); } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/my-vote/:voterId', async (req, res) => {
  try { const vote = await Vote.findOne({ voterId: req.params.voterId }); res.json({ teamId: vote?.teamId || null }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/vote', async (req, res) => {
  try {
    const { voterId, teamId } = req.body;
    if (!voterId || !teamId) return res.status(400).json({ error: 'Missing fields' });
    const event = await Event.findOne();
    if (!event?.isVotingOpen) return res.status(403).json({ error: 'Voting is closed' });
    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ error: 'Team not found' });
    const prev = await Vote.findOne({ voterId });
    const wasChange = prev && prev.teamId.toString() !== teamId;
    await Vote.findOneAndUpdate({ voterId }, { teamId, votedAt: new Date() }, { upsert: true, new: true });
    emitLeaderboardUpdate();
    res.json({ success: true, changed: wasChange, teamName: team.name });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/admin/verify', (req, res) => {
  const { pin } = req.body;
  if (pin !== (process.env.ADMIN_PIN || '1234')) return res.status(401).json({ error: 'Wrong PIN' });
  res.json({ success: true });
});

app.put('/api/admin/event', adminAuth, async (req, res) => {
  try {
    const { title, isVotingOpen } = req.body;
    const event = await Event.findOneAndUpdate({}, { ...(title !== undefined && { title }), ...(isVotingOpen !== undefined && { isVotingOpen }) }, { new: true });
    io.emit('event_update', event);
    res.json(event);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/admin/teams', adminAuth, async (req, res) => {
  try {
    const { name } = req.body;
    const count = await Team.countDocuments();
    const team = await Team.create({ name, colorIndex: count % 6, order: count });
    emitLeaderboardUpdate();
    res.json(team);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/admin/teams/:id', adminAuth, async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    emitLeaderboardUpdate();
    res.json(team);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/admin/teams/:id', adminAuth, async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    await Vote.deleteMany({ teamId: req.params.id });
    emitLeaderboardUpdate();
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/admin/votes', adminAuth, async (req, res) => {
  try { await Vote.deleteMany({}); emitLeaderboardUpdate(); res.json({ success: true }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/admin/stats', adminAuth, async (req, res) => {
  try {
    const totalVotes = await Vote.countDocuments();
    const uniqueVoters = await Vote.distinct('voterId');
    const teams = await Team.countDocuments();
    res.json({ totalVotes, uniqueVoters: uniqueVoters.length, teams });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/admin/qr', adminAuth, async (req, res) => {
  try {
    const voteUrl = FRONTEND_URL + '/';
    const qr = await QRCode.toDataURL(voteUrl, { width: 300, margin: 2 });
    res.json({ qr, url: voteUrl });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);
  buildLeaderboard().then(data => socket.emit('leaderboard_update', data));
  socket.on('disconnect', () => console.log(`🔌 Disconnected: ${socket.id}`));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
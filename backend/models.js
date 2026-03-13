const mongoose = require('mongoose');

// ── Event (one per hackathon) ──────────────────────────────────────
const eventSchema = new mongoose.Schema({
  title: { type: String, default: 'Hackathon 2025' },
  isVotingOpen: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});
const Event = mongoose.model('Event', eventSchema);

// ── Team ───────────────────────────────────────────────────────────
const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  colorIndex: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});
const Team = mongoose.model('Team', teamSchema);

// ── Vote ───────────────────────────────────────────────────────────
// One doc per voter — upsert on change keeps "one active vote" logic clean
const voteSchema = new mongoose.Schema({
  voterId: { type: String, required: true, unique: true }, // device fingerprint
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  votedAt: { type: Date, default: Date.now },
});
const Vote = mongoose.model('Vote', voteSchema);

module.exports = { Event, Team, Vote };

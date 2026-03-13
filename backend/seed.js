// seed.js — Run once to populate your MongoDB with all teams
// Usage: node seed.js
// WARNING: This will DELETE all existing teams and votes before seeding

require('dotenv').config();
const mongoose = require('mongoose');
const { Event, Team, Vote } = require('./models');

const TEAMS = [
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

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hackvote');
  console.log('✅ Connected to MongoDB');

  // Clear existing data
  await Team.deleteMany({});
  await Vote.deleteMany({});
  console.log('🗑  Cleared existing teams and votes');

  // Ensure event exists
  const eventCount = await Event.countDocuments();
  if (eventCount === 0) {
    await Event.create({ title: 'Hackathon 2025' });
    console.log('📋 Created default event');
  }

  // Insert all teams
  for (let i = 0; i < TEAMS.length; i++) {
    const { id, name } = TEAMS[i];
    await Team.create({ name: `[${id}] ${name}`, colorIndex: i % 6, order: i });
  }

  console.log(`✅ Seeded ${TEAMS.length} teams successfully!`);
  console.log('\nTeams added:');
  TEAMS.forEach((t, i) => console.log(`  ${i + 1}. [${t.id}] ${t.name}`));

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});

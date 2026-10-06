require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Ensure db and schema are ready
const db = require('./database/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teamRoutes = require('./routes/teamRoutes');
const matchRoutes = require('./routes/matchRoutes');
const requestRoutes = require('./routes/requestRoutes');
const { getMetadata, generateIdealTeam } = require('./controllers/matchesController');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging in development
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  }
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'TEVIX Backend API',
    timestamp: new Date().toISOString()
  });
});

// Metadata endpoint (skills, roles, hackathons)
app.get('/api/metadata', getMetadata);

// Build My Ideal Team endpoint
app.post('/api/ideal-team', generateIdealTeam);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/requests', requestRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server if run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`  TEVIX Backend running on http://localhost:${PORT}`);
    console.log(`  Team Composition Intelligence Engine active`);
    console.log(`===============================================`);
  });
}

module.exports = app;

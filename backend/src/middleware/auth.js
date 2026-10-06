const jwt = require('jsonwebtoken');
const db = require('../database/db');

const JWT_SECRET = process.env.JWT_SECRET || 'tevix_super_secure_jwt_secret_key_2026_hackathon';

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Fetch profile id if not in token
    const profile = db.prepare('SELECT id, full_name FROM profiles WHERE user_id = ?').get(decoded.userId);
    
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      profileId: profile ? profile.id : null,
      fullName: profile ? profile.full_name : null
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
  }
}

function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const profile = db.prepare('SELECT id, full_name FROM profiles WHERE user_id = ?').get(decoded.userId);
    if (profile) {
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        profileId: profile.id,
        fullName: profile.full_name
      };
    }
  } catch (err) {
    // Ignore invalid token in optional auth
  }
  next();
}

module.exports = {
  requireAuth,
  optionalAuth,
  JWT_SECRET
};

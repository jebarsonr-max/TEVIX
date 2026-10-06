const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db');
const { JWT_SECRET } = require('../middleware/auth');
const { getFullProfileById } = require('../database/helpers');

function register(req, res) {
  const {
    email,
    password,
    fullName,
    department,
    year,
    gender,
    experienceLevel = 'Intermediate',
    contactPreference = 'Email',
    bio = '',
    skills = [],
    roles = []
  } = req.body;

  // Validation
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }
  if (!fullName || !department || !year || !gender) {
    return res.status(400).json({ error: 'Please fill in all required profile fields.' });
  }

  // Check existing user
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists.' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);

  // Execute in transaction
  const insertUser = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)');
  const insertProfile = db.prepare(`
    INSERT INTO profiles (
      user_id, full_name, department, year, gender,
      contact_preference, experience_level, bio
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertAvailability = db.prepare(`
    INSERT INTO availability (profile_id, days, time_slots, hours_per_week)
    VALUES (?, 'Weekends', 'Evening, Night', 15)
  `);

  try {
    const runRegister = db.transaction(() => {
      const userRes = insertUser.run(email.toLowerCase().trim(), passwordHash);
      const userId = userRes.lastInsertRowid;

      const profRes = insertProfile.run(
        userId,
        fullName.trim(),
        department,
        parseInt(year, 10),
        gender,
        contactPreference,
        experienceLevel,
        bio.trim()
      );
      const profileId = profRes.lastInsertRowid;
      insertAvailability.run(profileId);

      // Add skills if provided
      if (Array.isArray(skills) && skills.length > 0) {
        const insertSkill = db.prepare('INSERT OR IGNORE INTO student_skills (profile_id, skill_id, proficiency) VALUES (?, ?, ?)');
        for (const s of skills) {
          const sId = typeof s === 'object' ? s.id : s;
          const sProf = (typeof s === 'object' && s.proficiency) ? s.proficiency : 'Intermediate';
          if (sId) insertSkill.run(profileId, sId, sProf);
        }
      }

      // Add roles if provided
      if (Array.isArray(roles) && roles.length > 0) {
        const insertRole = db.prepare('INSERT OR IGNORE INTO student_roles (profile_id, role_id, is_primary) VALUES (?, ?, ?)');
        roles.forEach((r, idx) => {
          const rId = typeof r === 'object' ? r.id : r;
          if (rId) insertRole.run(profileId, rId, idx === 0 ? 1 : 0);
        });
      }

      return { userId, profileId };
    });

    const { userId, profileId } = runRegister();
    const token = jwt.sign({ userId, email: email.toLowerCase().trim() }, JWT_SECRET, { expiresIn: '7d' });
    const fullProfile = getFullProfileById(profileId);

    return res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: {
        userId,
        email: email.toLowerCase().trim(),
        profile: fullProfile
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Failed to create account. Please try again.' });
  }
}

function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const isMatch = bcrypt.compareSync(password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const profile = db.prepare('SELECT id FROM profiles WHERE user_id = ?').get(user.id);
  const fullProfile = profile ? getFullProfileById(profile.id) : null;

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

  return res.json({
    message: 'Login successful!',
    token,
    user: {
      userId: user.id,
      email: user.email,
      profile: fullProfile
    }
  });
}

function getMe(req, res) {
  if (!req.user || !req.user.profileId) {
    return res.status(401).json({ error: 'User profile not found.' });
  }
  const fullProfile = getFullProfileById(req.user.profileId);
  return res.json({ profile: fullProfile });
}

module.exports = {
  register,
  login,
  getMe
};

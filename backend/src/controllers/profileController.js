const db = require('../database/db');
const { getFullProfileById } = require('../database/helpers');

function getProfile(req, res) {
  const profileId = req.user.profileId;
  const profile = getFullProfileById(profileId);
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found.' });
  }
  return res.json(profile);
}

function updateProfile(req, res) {
  const profileId = req.user.profileId;
  const {
    fullName,
    avatarUrl,
    department,
    year,
    gender,
    contactPreference,
    experienceLevel,
    hackathonsCount,
    githubUrl,
    linkedinUrl,
    bio,
    skills,
    roles,
    availability
  } = req.body;

  try {
    const updateTransaction = db.transaction(() => {
      // 1. Update basic profile fields
      db.prepare(`
        UPDATE profiles SET
          full_name = COALESCE(?, full_name),
          avatar_url = COALESCE(?, avatar_url),
          department = COALESCE(?, department),
          year = COALESCE(?, year),
          gender = COALESCE(?, gender),
          contact_preference = COALESCE(?, contact_preference),
          experience_level = COALESCE(?, experience_level),
          hackathons_count = COALESCE(?, hackathons_count),
          github_url = COALESCE(?, github_url),
          linkedin_url = COALESCE(?, linkedin_url),
          bio = COALESCE(?, bio),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(
        fullName,
        avatarUrl,
        department,
        year ? parseInt(year, 10) : null,
        gender,
        contactPreference,
        experienceLevel,
        hackathonsCount !== undefined ? parseInt(hackathonsCount, 10) : null,
        githubUrl,
        linkedinUrl,
        bio,
        profileId
      );

      // 2. Update skills if supplied
      if (Array.isArray(skills)) {
        db.prepare('DELETE FROM student_skills WHERE profile_id = ?').run(profileId);
        const insertSkill = db.prepare('INSERT INTO student_skills (profile_id, skill_id, proficiency) VALUES (?, ?, ?)');
        for (const s of skills) {
          const sId = typeof s === 'object' ? s.id : s;
          const sProf = (typeof s === 'object' && s.proficiency) ? s.proficiency : 'Intermediate';
          if (sId) insertSkill.run(profileId, sId, sProf);
        }
      }

      // 3. Update roles if supplied
      if (Array.isArray(roles)) {
        db.prepare('DELETE FROM student_roles WHERE profile_id = ?').run(profileId);
        const insertRole = db.prepare('INSERT INTO student_roles (profile_id, role_id, is_primary) VALUES (?, ?, ?)');
        roles.forEach((r, idx) => {
          const rId = typeof r === 'object' ? r.id : r;
          if (rId) insertRole.run(profileId, rId, idx === 0 ? 1 : 0);
        });
      }

      // 4. Update availability if supplied
      if (availability) {
        db.prepare(`
          INSERT INTO availability (profile_id, days, time_slots, hours_per_week)
          VALUES (?, ?, ?, ?)
          ON CONFLICT(profile_id) DO UPDATE SET
            days = COALESCE(excluded.days, availability.days),
            time_slots = COALESCE(excluded.time_slots, availability.time_slots),
            hours_per_week = COALESCE(excluded.hours_per_week, availability.hours_per_week)
        `).run(
          profileId,
          availability.days || 'Weekends',
          availability.timeSlots || 'Evening, Night',
          availability.hoursPerWeek ? parseInt(availability.hoursPerWeek, 10) : 15
        );
      }
    });

    updateTransaction();
    const updated = getFullProfileById(profileId);
    return res.json({ message: 'Profile updated successfully!', profile: updated });
  } catch (err) {
    console.error('Profile update error:', err);
    return res.status(500).json({ error: 'Failed to update profile.' });
  }
}

module.exports = {
  getProfile,
  updateProfile
};

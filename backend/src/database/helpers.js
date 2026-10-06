const db = require('./db');

/**
 * Returns a profile by ID with skills, roles, and availability attached.
 */
function getFullProfileById(profileId) {
  const profile = db.prepare(`
    SELECT p.*, u.email, a.days as availability_days, a.time_slots as availability_slots, a.hours_per_week
    FROM profiles p
    JOIN users u ON u.id = p.user_id
    LEFT JOIN availability a ON a.profile_id = p.id
    WHERE p.id = ?
  `).get(profileId);

  if (!profile) return null;

  const skills = db.prepare(`
    SELECT s.id, s.name, s.category, ss.proficiency
    FROM student_skills ss
    JOIN skills s ON s.id = ss.skill_id
    WHERE ss.profile_id = ?
  `).all(profileId);

  const roles = db.prepare(`
    SELECT r.id, r.name, r.category, sr.is_primary
    FROM student_roles sr
    JOIN roles r ON r.id = sr.role_id
    WHERE sr.profile_id = ?
  `).all(profileId);

  return {
    ...profile,
    skills,
    roles,
    availability: {
      days: profile.availability_days || 'Weekends',
      timeSlots: profile.availability_slots || 'Evening, Night',
      hoursPerWeek: profile.hours_per_week || 15
    }
  };
}

/**
 * Returns all profiles with their skills and roles.
 */
function getAllFullProfiles(excludeProfileId = null) {
  let query = `
    SELECT p.*, u.email, a.days as availability_days, a.time_slots as availability_slots, a.hours_per_week
    FROM profiles p
    JOIN users u ON u.id = p.user_id
    LEFT JOIN availability a ON a.profile_id = p.id
  `;
  const params = [];
  if (excludeProfileId) {
    query += ` WHERE p.id != ?`;
    params.push(excludeProfileId);
  }
  query += ` ORDER BY p.hackathons_count DESC, p.full_name ASC`;

  const profiles = db.prepare(query).all(...params);

  // Batch load skills & roles
  const allSkills = db.prepare(`
    SELECT ss.profile_id, s.id, s.name, s.category, ss.proficiency
    FROM student_skills ss
    JOIN skills s ON s.id = ss.skill_id
  `).all();

  const allRoles = db.prepare(`
    SELECT sr.profile_id, r.id, r.name, r.category, sr.is_primary
    FROM student_roles sr
    JOIN roles r ON r.id = sr.role_id
  `).all();

  const skillsByProfile = {};
  for (const sk of allSkills) {
    if (!skillsByProfile[sk.profile_id]) skillsByProfile[sk.profile_id] = [];
    skillsByProfile[sk.profile_id].push(sk);
  }

  const rolesByProfile = {};
  for (const r of allRoles) {
    if (!rolesByProfile[r.profile_id]) rolesByProfile[r.profile_id] = [];
    rolesByProfile[r.profile_id].push(r);
  }

  return profiles.map(p => ({
    ...p,
    skills: skillsByProfile[p.id] || [],
    roles: rolesByProfile[p.id] || [],
    availability: {
      days: p.availability_days || 'Weekends',
      timeSlots: p.availability_slots || 'Evening, Night',
      hoursPerWeek: p.hours_per_week || 15
    }
  }));
}

/**
 * Returns a team with its members, leader, hackathon, and requirements.
 */
function getFullTeamById(teamId) {
  const team = db.prepare(`
    SELECT t.*, h.name as hackathon_name, h.description as hackathon_description,
           h.category as hackathon_category, h.team_size_min, h.team_size_max,
           tr.department_preference, tr.gender_requirement, tr.experience_requirement,
           tr.preferred_availability, tr.notes as requirement_notes
    FROM teams t
    LEFT JOIN hackathons h ON h.id = t.hackathon_id
    LEFT JOIN team_requirements tr ON tr.team_id = t.id
    WHERE t.id = ?
  `).get(teamId);

  if (!team) return null;

  // Fetch team required skills
  const requiredSkills = db.prepare(`
    SELECT s.id, s.name, s.category
    FROM team_required_skills trs
    JOIN skills s ON s.id = trs.skill_id
    WHERE trs.team_id = ?
  `).all(teamId);

  // Fetch team required roles
  const requiredRoles = db.prepare(`
    SELECT r.id, r.name, r.category
    FROM team_required_roles trr
    JOIN roles r ON r.id = trr.role_id
    WHERE trr.team_id = ?
  `).all(teamId);

  // Fetch members
  const memberRows = db.prepare(`
    SELECT tm.id as membership_id, tm.role_in_team, tm.joined_at, tm.profile_id
    FROM team_members tm
    WHERE tm.team_id = ?
    ORDER BY tm.joined_at ASC
  `).all(teamId);

  const members = memberRows.map(row => {
    const prof = getFullProfileById(row.profile_id);
    return {
      ...prof,
      membershipId: row.membership_id,
      roleInTeam: row.role_in_team,
      joinedAt: row.joined_at
    };
  });

  return {
    ...team,
    hackathon: {
      id: team.hackathon_id,
      name: team.hackathon_name,
      description: team.hackathon_description,
      category: team.hackathon_category,
      team_size_min: team.team_size_min,
      team_size_max: team.team_size_max
    },
    requirements: {
      departmentPreference: team.department_preference || 'Any',
      genderRequirement: team.gender_requirement || 'Any',
      experienceRequirement: team.experience_requirement || 'Any',
      preferredAvailability: team.preferred_availability || 'Flexible',
      notes: team.requirement_notes || '',
      requiredSkills,
      requiredRoles
    },
    members,
    currentMemberCount: members.length
  };
}

module.exports = {
  getFullProfileById,
  getAllFullProfiles,
  getFullTeamById
};

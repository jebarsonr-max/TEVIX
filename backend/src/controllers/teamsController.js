const db = require('../database/db');
const { getFullTeamById, getFullProfileById } = require('../database/helpers');
const { analyzeTeamGaps } = require('../engine/teamGapEngine');
const { calculateTeamDna } = require('../engine/teamDnaEngine');
const { detectTeamRisks } = require('../engine/riskDetectorEngine');
const { calculateHackathonReadiness } = require('../engine/readinessEngine');
const { simulateCandidateAddition } = require('../engine/simulatorEngine');

function createTeam(req, res) {
  const profileId = req.user.profileId;
  const {
    name,
    description = '',
    hackathonId,
    maxSize = 4,
    departmentPreference = 'Any',
    genderRequirement = 'Any',
    experienceRequirement = 'Any',
    preferredAvailability = 'Flexible',
    notes = '',
    requiredSkills = [],
    requiredRoles = []
  } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: 'Team name is required.' });
  }

  try {
    const insertTx = db.transaction(() => {
      // 1. Create team
      const insertTeamStmt = db.prepare(`
        INSERT INTO teams (leader_id, hackathon_id, name, description, max_size, status)
        VALUES (?, ?, ?, ?, ?, 'forming')
      `);
      const teamRes = insertTeamStmt.run(profileId, hackathonId || null, name.trim(), description.trim(), parseInt(maxSize, 10));
      const teamId = teamRes.lastInsertRowid;

      // 2. Add creator as team leader
      const creatorProfile = getFullProfileById(profileId);
      const primaryRole = (creatorProfile.roles && creatorProfile.roles[0]) ? creatorProfile.roles[0].name : 'Team Leader';
      db.prepare(`
        INSERT INTO team_members (team_id, profile_id, role_in_team)
        VALUES (?, ?, ?)
      `).run(teamId, profileId, `Team Leader (${primaryRole})`);

      // 3. Create requirements
      db.prepare(`
        INSERT INTO team_requirements (
          team_id, department_preference, gender_requirement, experience_requirement, preferred_availability, notes
        ) VALUES (?, ?, ?, ?, ?, ?)
      `).run(teamId, departmentPreference, genderRequirement, experienceRequirement, preferredAvailability, notes);

      // 4. Insert required skills
      if (Array.isArray(requiredSkills)) {
        const insSkill = db.prepare('INSERT OR IGNORE INTO team_required_skills (team_id, skill_id) VALUES (?, ?)');
        for (const s of requiredSkills) {
          const sId = typeof s === 'object' ? s.id : s;
          if (sId) insSkill.run(teamId, sId);
        }
      }

      // 5. Insert required roles
      if (Array.isArray(requiredRoles)) {
        const insRole = db.prepare('INSERT OR IGNORE INTO team_required_roles (team_id, role_id) VALUES (?, ?)');
        for (const r of requiredRoles) {
          const rId = typeof r === 'object' ? r.id : r;
          if (rId) insRole.run(teamId, rId);
        }
      }

      return teamId;
    });

    const teamId = insertTx();
    const createdTeam = getFullTeamById(teamId);

    return res.status(201).json({
      message: 'Team created successfully!',
      team: createdTeam
    });
  } catch (err) {
    console.error('Error creating team:', err);
    return res.status(500).json({ error: 'Failed to create team.' });
  }
}

function getTeams(req, res) {
  const profileId = req.user ? req.user.profileId : null;
  const { userOnly } = req.query;

  let query = `
    SELECT t.id FROM teams t
  `;
  const params = [];

  if (userOnly === 'true' && profileId) {
    query = `
      SELECT DISTINCT t.id FROM teams t
      JOIN team_members tm ON tm.team_id = t.id
      WHERE tm.profile_id = ?
    `;
    params.push(profileId);
  }

  const rows = db.prepare(query).all(...params);
  const teams = rows.map(r => getFullTeamById(r.id)).filter(Boolean);

  return res.json({ teams });
}

function getTeamById(req, res) {
  const teamId = parseInt(req.params.id, 10);
  const team = getFullTeamById(teamId);
  if (!team) {
    return res.status(404).json({ error: 'Team not found.' });
  }

  // Calculate comprehensive analytics
  const dna = calculateTeamDna(team.members, team.requirements);
  const gaps = analyzeTeamGaps(team.members, team.requirements);
  const readiness = calculateHackathonReadiness(team.members, team.requirements, team.hackathon);
  const risks = detectTeamRisks(team.members, team.requirements, team.hackathon);

  return res.json({
    team,
    analytics: {
      teamBalanceScore: dna.teamBalanceScore,
      hackathonReadinessScore: readiness.readinessScore,
      readinessStatus: readiness.status,
      biggestGap: gaps.recommendedNextRole,
      summary: dna.explanation,
      dna: dna.dna,
      gaps,
      readiness,
      risks
    }
  });
}

function updateTeam(req, res) {
  const teamId = parseInt(req.params.id, 10);
  const profileId = req.user.profileId;

  const team = getFullTeamById(teamId);
  if (!team) return res.status(404).json({ error: 'Team not found.' });
  if (team.leader_id !== profileId) {
    return res.status(403).json({ error: 'Only the team leader can update team settings.' });
  }

  const {
    name,
    description,
    maxSize,
    status,
    departmentPreference,
    genderRequirement,
    experienceRequirement,
    preferredAvailability,
    notes,
    requiredSkills,
    requiredRoles
  } = req.body;

  try {
    const updateTx = db.transaction(() => {
      db.prepare(`
        UPDATE teams SET
          name = COALESCE(?, name),
          description = COALESCE(?, description),
          max_size = COALESCE(?, max_size),
          status = COALESCE(?, status),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(name, description, maxSize ? parseInt(maxSize, 10) : null, status, teamId);

      db.prepare(`
        UPDATE team_requirements SET
          department_preference = COALESCE(?, department_preference),
          gender_requirement = COALESCE(?, gender_requirement),
          experience_requirement = COALESCE(?, experience_requirement),
          preferred_availability = COALESCE(?, preferred_availability),
          notes = COALESCE(?, notes)
        WHERE team_id = ?
      `).run(departmentPreference, genderRequirement, experienceRequirement, preferredAvailability, notes, teamId);

      if (Array.isArray(requiredSkills)) {
        db.prepare('DELETE FROM team_required_skills WHERE team_id = ?').run(teamId);
        const insSkill = db.prepare('INSERT OR IGNORE INTO team_required_skills (team_id, skill_id) VALUES (?, ?)');
        for (const s of requiredSkills) {
          const sId = typeof s === 'object' ? s.id : s;
          if (sId) insSkill.run(teamId, sId);
        }
      }

      if (Array.isArray(requiredRoles)) {
        db.prepare('DELETE FROM team_required_roles WHERE team_id = ?').run(teamId);
        const insRole = db.prepare('INSERT OR IGNORE INTO team_required_roles (team_id, role_id) VALUES (?, ?)');
        for (const r of requiredRoles) {
          const rId = typeof r === 'object' ? r.id : r;
          if (rId) insRole.run(teamId, rId);
        }
      }
    });

    updateTx();
    const updated = getFullTeamById(teamId);
    return res.json({ message: 'Team updated successfully!', team: updated });
  } catch (err) {
    console.error('Update team error:', err);
    return res.status(500).json({ error: 'Failed to update team.' });
  }
}

function getTeamGaps(req, res) {
  const teamId = parseInt(req.params.id, 10);
  const team = getFullTeamById(teamId);
  if (!team) return res.status(404).json({ error: 'Team not found.' });

  const gaps = analyzeTeamGaps(team.members, team.requirements);
  return res.json(gaps);
}

function getTeamBalance(req, res) {
  const teamId = parseInt(req.params.id, 10);
  const team = getFullTeamById(teamId);
  if (!team) return res.status(404).json({ error: 'Team not found.' });

  const dna = calculateTeamDna(team.members, team.requirements);
  return res.json({
    teamBalanceScore: dna.teamBalanceScore,
    explanation: dna.explanation,
    strongPillars: dna.strongPillars,
    weakPillars: dna.weakPillars
  });
}

function getTeamDna(req, res) {
  const teamId = parseInt(req.params.id, 10);
  const team = getFullTeamById(teamId);
  if (!team) return res.status(404).json({ error: 'Team not found.' });

  const dna = calculateTeamDna(team.members, team.requirements);
  return res.json(dna);
}

function getTeamRisks(req, res) {
  const teamId = parseInt(req.params.id, 10);
  const team = getFullTeamById(teamId);
  if (!team) return res.status(404).json({ error: 'Team not found.' });

  const risks = detectTeamRisks(team.members, team.requirements, team.hackathon);
  return res.json({ risks });
}

function getTeamReadiness(req, res) {
  const teamId = parseInt(req.params.id, 10);
  const team = getFullTeamById(teamId);
  if (!team) return res.status(404).json({ error: 'Team not found.' });

  const readiness = calculateHackathonReadiness(team.members, team.requirements, team.hackathon);
  return res.json(readiness);
}

function simulateCandidate(req, res) {
  const teamId = parseInt(req.params.id, 10);
  const candidateId = parseInt(req.params.candidateId, 10);

  const team = getFullTeamById(teamId);
  if (!team) return res.status(404).json({ error: 'Team not found.' });

  const candidate = getFullProfileById(candidateId);
  if (!candidate) return res.status(404).json({ error: 'Candidate not found.' });

  const simulation = simulateCandidateAddition(candidate, team.members, team.requirements, team.hackathon);
  return res.json(simulation);
}

function removeMember(req, res) {
  const teamId = parseInt(req.params.id, 10);
  const memberProfileId = parseInt(req.params.memberId, 10);
  const currentProfileId = req.user.profileId;

  const team = getFullTeamById(teamId);
  if (!team) return res.status(404).json({ error: 'Team not found.' });

  if (team.leader_id !== currentProfileId && memberProfileId !== currentProfileId) {
    return res.status(403).json({ error: 'You are not authorized to remove this member.' });
  }

  if (memberProfileId === team.leader_id) {
    return res.status(400).json({ error: 'Team leader cannot be removed from the team.' });
  }

  db.prepare('DELETE FROM team_members WHERE team_id = ? AND profile_id = ?').run(teamId, memberProfileId);
  const updatedTeam = getFullTeamById(teamId);

  return res.json({
    message: 'Team member removed. Analytics updated.',
    team: updatedTeam
  });
}

module.exports = {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
  getTeamGaps,
  getTeamBalance,
  getTeamDna,
  getTeamRisks,
  getTeamReadiness,
  simulateCandidate,
  removeMember
};

const db = require('../database/db');
const { getAllFullProfiles, getFullProfileById, getFullTeamById } = require('../database/helpers');
const { calculateCandidateMatch } = require('../engine/matchingEngine');
const { buildIdealTeam } = require('../engine/idealTeamEngine');

function getMatchesForTeam(req, res) {
  const currentProfileId = req.user ? req.user.profileId : null;
  const { teamId } = req.query;

  let activeTeam = null;
  if (teamId) {
    activeTeam = getFullTeamById(parseInt(teamId, 10));
  } else if (currentProfileId) {
    const userTeamMember = db.prepare('SELECT team_id FROM team_members WHERE profile_id = ? LIMIT 1').get(currentProfileId);
    if (userTeamMember) {
      activeTeam = getFullTeamById(userTeamMember.team_id);
    }
  }

  if (!activeTeam) {
    return res.status(400).json({ error: 'Please specify a teamId or create a team to calculate matches.' });
  }

  const existingMemberIds = new Set(activeTeam.members.map(m => m.id));
  const allCandidates = getAllFullProfiles(currentProfileId).filter(c => !existingMemberIds.has(c.id));

  const scoredCandidates = allCandidates.map(candidate => {
    const match = calculateCandidateMatch(
      candidate,
      activeTeam.members,
      activeTeam.requirements,
      activeTeam.hackathon
    );
    return {
      candidate,
      match
    };
  });

  // Sort descending by total score
  scoredCandidates.sort((a, b) => b.match.totalScore - a.match.totalScore);

  return res.json({
    team: {
      id: activeTeam.id,
      name: activeTeam.name,
      membersCount: activeTeam.members.length,
      maxSize: activeTeam.max_size
    },
    totalCandidatesScored: scoredCandidates.length,
    matches: scoredCandidates
  });
}

function getMatchForStudent(req, res) {
  const studentId = parseInt(req.params.studentId, 10);
  const currentProfileId = req.user ? req.user.profileId : null;
  const { teamId } = req.query;

  let activeTeam = null;
  if (teamId) {
    activeTeam = getFullTeamById(parseInt(teamId, 10));
  } else if (currentProfileId) {
    const userTeamMember = db.prepare('SELECT team_id FROM team_members WHERE profile_id = ? LIMIT 1').get(currentProfileId);
    if (userTeamMember) {
      activeTeam = getFullTeamById(userTeamMember.team_id);
    }
  }

  if (!activeTeam) {
    return res.status(400).json({ error: 'Please specify a teamId to calculate match.' });
  }

  const student = getFullProfileById(studentId);
  if (!student) return res.status(404).json({ error: 'Student not found.' });

  const match = calculateCandidateMatch(
    student,
    activeTeam.members,
    activeTeam.requirements,
    activeTeam.hackathon
  );

  return res.json({
    student,
    teamId: activeTeam.id,
    teamName: activeTeam.name,
    match
  });
}

function generateIdealTeam(req, res) {
  const {
    teamSize = 4,
    requiredRoles = [],
    requiredSkills = [],
    departmentPreference = 'Any',
    preferredAvailability = 'Weekends',
    hackathonId
  } = req.body;

  let hackathon = {};
  if (hackathonId) {
    hackathon = db.prepare('SELECT * FROM hackathons WHERE id = ?').get(hackathonId) || {};
  }

  const allCandidates = getAllFullProfiles();

  const result = buildIdealTeam({
    candidates: allCandidates,
    teamSize: parseInt(teamSize, 10),
    requiredRoles,
    requiredSkills,
    departmentPreference,
    preferredAvailability,
    hackathon
  });

  return res.json(result);
}

function getMetadata(req, res) {
  const skills = db.prepare('SELECT * FROM skills ORDER BY category, name').all();
  const roles = db.prepare('SELECT * FROM roles ORDER BY category, name').all();
  const hackathons = db.prepare('SELECT * FROM hackathons ORDER BY start_date ASC').all();

  return res.json({
    skills,
    roles,
    hackathons
  });
}

module.exports = {
  getMatchesForTeam,
  getMatchForStudent,
  generateIdealTeam,
  getMetadata
};

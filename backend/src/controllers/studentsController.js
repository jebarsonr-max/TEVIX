const db = require('../database/db');
const { getAllFullProfiles, getFullProfileById, getFullTeamById } = require('../database/helpers');
const { calculateCandidateMatch } = require('../engine/matchingEngine');
const { simulateCandidateAddition } = require('../engine/simulatorEngine');

function getStudents(req, res) {
  const {
    search,
    department,
    year,
    gender,
    skill,
    role,
    experienceLevel,
    availabilityDays,
    teamId,
    minScore
  } = req.query;

  const currentProfileId = req.user ? req.user.profileId : null;
  let allStudents = getAllFullProfiles(currentProfileId);

  // If a teamId is provided or user has a team, prepare team context for compatibility scores
  let activeTeam = null;
  if (teamId) {
    activeTeam = getFullTeamById(parseInt(teamId, 10));
  } else if (currentProfileId) {
    // Find team where current user is leader or member
    const userTeamMember = db.prepare('SELECT team_id FROM team_members WHERE profile_id = ? LIMIT 1').get(currentProfileId);
    if (userTeamMember) {
      activeTeam = getFullTeamById(userTeamMember.team_id);
    }
  }

  // Filter out students already in the active team
  const activeMemberIds = activeTeam ? new Set(activeTeam.members.map(m => m.id)) : new Set();
  allStudents = allStudents.filter(s => !activeMemberIds.has(s.id));

  // Compute match score and simulation delta for each student if activeTeam exists
  let results = allStudents.map(student => {
    let matchData = null;
    if (activeTeam) {
      matchData = calculateCandidateMatch(
        student,
        activeTeam.members,
        activeTeam.requirements,
        activeTeam.hackathon
      );
    }
    return {
      ...student,
      match: matchData
    };
  });

  // Apply filters
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(s =>
      s.full_name.toLowerCase().includes(q) ||
      (s.bio && s.bio.toLowerCase().includes(q)) ||
      s.department.toLowerCase().includes(q) ||
      s.skills.some(sk => sk.name.toLowerCase().includes(q)) ||
      s.roles.some(r => r.name.toLowerCase().includes(q))
    );
  }

  if (department && department !== 'All') {
    results = results.filter(s => s.department === department);
  }

  if (year && year !== 'All') {
    results = results.filter(s => s.year === parseInt(year, 10));
  }

  if (gender && gender !== 'All') {
    results = results.filter(s => s.gender === gender);
  }

  if (experienceLevel && experienceLevel !== 'All') {
    results = results.filter(s => s.experience_level === experienceLevel);
  }

  if (skill && skill !== 'All') {
    results = results.filter(s => s.skills.some(sk => sk.name.toLowerCase() === skill.toLowerCase()));
  }

  if (role && role !== 'All') {
    results = results.filter(s => s.roles.some(r => r.name.toLowerCase() === role.toLowerCase()));
  }

  if (availabilityDays && availabilityDays !== 'All') {
    results = results.filter(s => s.availability && s.availability.days.includes(availabilityDays));
  }

  if (minScore && activeTeam) {
    const minVal = parseInt(minScore, 10);
    results = results.filter(s => s.match && s.match.totalScore >= minVal);
  }

  // Sort by match score descending if team exists, else by hackathons count
  if (activeTeam) {
    results.sort((a, b) => (b.match ? b.match.totalScore : 0) - (a.match ? a.match.totalScore : 0));
  } else {
    results.sort((a, b) => b.hackathons_count - a.hackathons_count);
  }

  return res.json({
    total: results.length,
    activeTeamId: activeTeam ? activeTeam.id : null,
    activeTeamName: activeTeam ? activeTeam.name : null,
    students: results
  });
}

function getStudentById(req, res) {
  const studentId = parseInt(req.params.id, 10);
  const currentProfileId = req.user ? req.user.profileId : null;
  const { teamId } = req.query;

  const student = getFullProfileById(studentId);
  if (!student) {
    return res.status(404).json({ error: 'Candidate profile not found.' });
  }

  let activeTeam = null;
  if (teamId) {
    activeTeam = getFullTeamById(parseInt(teamId, 10));
  } else if (currentProfileId) {
    const userTeamMember = db.prepare('SELECT team_id FROM team_members WHERE profile_id = ? LIMIT 1').get(currentProfileId);
    if (userTeamMember) {
      activeTeam = getFullTeamById(userTeamMember.team_id);
    }
  }

  let matchData = null;
  let simulationData = null;

  if (activeTeam) {
    matchData = calculateCandidateMatch(
      student,
      activeTeam.members,
      activeTeam.requirements,
      activeTeam.hackathon
    );
    simulationData = simulateCandidateAddition(
      student,
      activeTeam.members,
      activeTeam.requirements,
      activeTeam.hackathon
    );
  }

  return res.json({
    student,
    activeTeam: activeTeam ? {
      id: activeTeam.id,
      name: activeTeam.name,
      hackathon: activeTeam.hackathon,
      currentMembersCount: activeTeam.members.length,
      maxSize: activeTeam.max_size
    } : null,
    match: matchData,
    simulation: simulationData
  });
}

module.exports = {
  getStudents,
  getStudentById
};

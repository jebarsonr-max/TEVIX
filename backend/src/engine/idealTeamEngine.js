const { calculateTeamDna } = require('./teamDnaEngine');
const { calculateHackathonReadiness } = require('./readinessEngine');
const { calculateCandidateMatch } = require('./matchingEngine');

/**
 * Builds an optimal ideal team combination from available candidate pool
 * that maximizes Team Balance and Hackathon Readiness while minimizing skill overlap.
 */
function buildIdealTeam({
  candidates = [],
  teamSize = 4,
  requiredRoles = ['Frontend Developer', 'Backend Developer', 'AI/ML Engineer', 'UI/UX Designer'],
  requiredSkills = ['React', 'Python', 'Machine Learning', 'SQL'],
  departmentPreference = 'Any',
  preferredAvailability = 'Weekends',
  hackathon = {}
}) {
  const targetRoles = requiredRoles.length > 0 ? requiredRoles : ['Frontend Developer', 'Backend Developer', 'UI/UX Designer', 'AI/ML Engineer'];
  const teamRequirements = {
    requiredRoles: targetRoles,
    requiredSkills,
    departmentPreference,
    preferredAvailability
  };

  const selectedCandidates = [];
  const selectedCandidateIds = new Set();
  const roleAssignments = [];

  // Greedy selection per role that maximizes complementarity with already selected members
  for (const role of targetRoles) {
    if (selectedCandidates.length >= teamSize) break;

    // Find candidates who have this role and aren't picked yet
    let bestCandidate = null;
    let bestScore = -1;

    for (const cand of candidates) {
      if (selectedCandidateIds.has(cand.id)) continue;

      const candRoles = (cand.roles || []).map(r => typeof r === 'string' ? r : r.name);
      if (candRoles.includes(role)) {
        // Evaluate candidate match against already selected team members
        const matchResult = calculateCandidateMatch(cand, selectedCandidates, teamRequirements, hackathon);
        if (matchResult.totalScore > bestScore) {
          bestScore = matchResult.totalScore;
          bestCandidate = cand;
        }
      }
    }

    // If no candidate had the exact role, pick the candidate with highest match overall
    if (!bestCandidate) {
      for (const cand of candidates) {
        if (selectedCandidateIds.has(cand.id)) continue;
        const matchResult = calculateCandidateMatch(cand, selectedCandidates, teamRequirements, hackathon);
        if (matchResult.totalScore > bestScore) {
          bestScore = matchResult.totalScore;
          bestCandidate = cand;
        }
      }
    }

    if (bestCandidate) {
      selectedCandidateIds.add(bestCandidate.id);
      selectedCandidates.push(bestCandidate);
      roleAssignments.push({
        targetRole: role,
        candidate: bestCandidate,
        matchScore: bestScore
      });
    }
  }

  // Calculate predicted metrics of the ideal team
  const predictedDna = calculateTeamDna(selectedCandidates, teamRequirements);
  const predictedReadiness = calculateHackathonReadiness(selectedCandidates, teamRequirements, hackathon);

  return {
    idealMembers: selectedCandidates,
    roleAssignments,
    predictedTeamBalance: predictedDna.teamBalanceScore,
    predictedHackathonReadiness: predictedReadiness.readinessScore,
    dna: predictedDna.dna,
    readinessBreakdown: predictedReadiness.breakdown,
    summary: `Curated an optimized ${selectedCandidates.length}-member roster delivering ${predictedDna.teamBalanceScore}% Team Balance and ${predictedReadiness.readinessScore}% Hackathon Readiness.`
  };
}

module.exports = {
  buildIdealTeam
};

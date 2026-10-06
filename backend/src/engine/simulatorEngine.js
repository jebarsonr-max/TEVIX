const { calculateTeamDna } = require('./teamDnaEngine');
const { calculateHackathonReadiness } = require('./readinessEngine');
const { analyzeTeamGaps } = require('./teamGapEngine');

/**
 * Simulates the impact of adding a specific candidate to an existing team.
 * Compares actual before and after metrics with zero hardcoded values.
 */
function simulateCandidateAddition(candidate, teamMembers = [], teamRequirements = {}, hackathon = {}) {
  // 1. Calculate BEFORE metrics
  const beforeDna = calculateTeamDna(teamMembers, teamRequirements);
  const beforeReadiness = calculateHackathonReadiness(teamMembers, teamRequirements, hackathon);
  const beforeGaps = analyzeTeamGaps(teamMembers, teamRequirements);

  // 2. Build simulated team (Members + Candidate)
  const candidateClone = {
    ...candidate,
    skills: (candidate.skills || []).map(s => typeof s === 'string' ? { name: s, proficiency: 'Intermediate' } : s),
    roles: (candidate.roles || []).map(r => typeof r === 'string' ? { name: r } : r)
  };
  const simulatedMembers = [...teamMembers, candidateClone];

  // 3. Calculate AFTER metrics
  const afterDna = calculateTeamDna(simulatedMembers, teamRequirements);
  const afterReadiness = calculateHackathonReadiness(simulatedMembers, teamRequirements, hackathon);
  const afterGaps = analyzeTeamGaps(simulatedMembers, teamRequirements);

  // 4. Calculate deltas
  const balanceDelta = afterDna.teamBalanceScore - beforeDna.teamBalanceScore;
  const readinessDelta = afterReadiness.readinessScore - beforeReadiness.readinessScore;

  // Compare pillar-by-pillar changes
  const pillarShifts = {};
  for (const pillarKey of Object.keys(beforeDna.dna)) {
    const beforeScore = beforeDna.dna[pillarKey].score;
    const afterScore = afterDna.dna[pillarKey].score;
    const shift = afterScore - beforeScore;
    pillarShifts[pillarKey] = {
      before: beforeScore,
      after: afterScore,
      delta: shift
    };
  }

  // Find the most improved pillar
  let topImprovedPillar = null;
  let maxPillarDelta = 0;
  for (const [pKey, pData] of Object.entries(pillarShifts)) {
    if (pData.delta > maxPillarDelta) {
      maxPillarDelta = pData.delta;
      topImprovedPillar = pKey;
    }
  }

  // Meaningful human explanation
  const candidateName = candidate.full_name || candidate.fullName || 'Candidate';
  let explanation = '';
  if (topImprovedPillar && maxPillarDelta > 15) {
    explanation = `Adding ${candidateName} significantly improves your ${topImprovedPillar} coverage (+${maxPillarDelta}%) and elevates overall team balance by +${balanceDelta}%.`;
  } else if (balanceDelta > 0) {
    explanation = `Adding ${candidateName} expands team technical breadth and raises hackathon readiness by +${readinessDelta}%.`;
  } else {
    explanation = `${candidateName} shares overlapping strengths with current team members; consider members with complementary capabilities for greater impact.`;
  }

  return {
    candidateId: candidate.id,
    candidateName,
    before: {
      teamBalanceScore: beforeDna.teamBalanceScore,
      readinessScore: beforeReadiness.readinessScore,
      dna: beforeDna.dna,
      gapsCount: beforeGaps.missingRequiredSkills.length + beforeGaps.missingRequiredRoles.length,
      explanation: beforeDna.explanation
    },
    after: {
      teamBalanceScore: afterDna.teamBalanceScore,
      readinessScore: afterReadiness.readinessScore,
      dna: afterDna.dna,
      gapsCount: afterGaps.missingRequiredSkills.length + afterGaps.missingRequiredRoles.length,
      explanation: afterDna.explanation
    },
    improvement: {
      balanceDelta: balanceDelta >= 0 ? `+${balanceDelta}%` : `${balanceDelta}%`,
      balanceNumericDelta: balanceDelta,
      readinessDelta: readinessDelta >= 0 ? `+${readinessDelta}%` : `${readinessDelta}%`,
      readinessNumericDelta: readinessDelta,
      topImprovedPillar,
      topImprovedPillarDelta: maxPillarDelta
    },
    pillarShifts,
    explanation
  };
}

module.exports = {
  simulateCandidateAddition
};

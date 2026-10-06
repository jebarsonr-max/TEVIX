const { calculateTeamDna } = require('./teamDnaEngine');
const { analyzeTeamGaps } = require('./teamGapEngine');

/**
 * Calculates Hackathon Readiness Score based on:
 * Technical Coverage: 30%
 * Role Coverage: 20%
 * Skill Complementarity: 20%
 * Experience: 10%
 * Availability: 10%
 * Team Balance: 10%
 * Total = 100%
 */
function calculateHackathonReadiness(teamMembers = [], teamRequirements = {}, hackathon = {}) {
  const memberCount = teamMembers.length;
  if (memberCount === 0) {
    return {
      readinessScore: 0,
      status: 'High Risk — Team has no members',
      breakdown: {
        technicalCoverage: 0,
        roleCoverage: 0,
        skillComplementarity: 0,
        experience: 0,
        availability: 0,
        teamBalance: 0
      },
      recommendations: ['Add at least two founding members to initiate team readiness assessment.']
    };
  }

  const dnaResult = calculateTeamDna(teamMembers, teamRequirements);
  const gaps = analyzeTeamGaps(teamMembers, teamRequirements);

  // 1. Technical Coverage (30 pts max)
  // Evaluates coverage across key pillars: Frontend, Backend, Database, and project domain
  const coreScores = [
    dnaResult.dna['Frontend'].score,
    dnaResult.dna['Backend'].score,
    dnaResult.dna['Database'].score
  ];
  const avgCore = coreScores.reduce((a, b) => a + b, 0) / 3;
  const techScore = Math.round((avgCore / 100) * 30);

  // 2. Role Coverage (20 pts max)
  const reqRoles = teamRequirements.requiredRoles || [];
  let roleRatio = 0.5;
  if (reqRoles.length > 0) {
    const coveredReqRoles = reqRoles.filter(r => !gaps.missingRequiredRoles.includes(typeof r === 'string' ? r : r.name));
    roleRatio = coveredReqRoles.length / reqRoles.length;
  } else {
    // Check standard 3 roles (Frontend, Backend, Design/Pitch)
    const coveredCoreRoles = 4 - gaps.generalRoleGaps.length;
    roleRatio = Math.max(coveredCoreRoles / 4, 0.3);
  }
  const roleScore = Math.round(roleRatio * 20);

  // 3. Skill Complementarity (20 pts max)
  // Higher when skills are diverse and not redundant
  const redundancyCount = gaps.skillRedundancies.length;
  const redundancyPenalty = Math.min(redundancyCount * 2, 6);
  const uniqueSkillsCount = Object.keys(dnaResult.dna).reduce((acc, k) => acc + dnaResult.dna[k].skillsCovered.length, 0);
  const compBase = Math.min(uniqueSkillsCount * 2.5, 20);
  const complementarityScore = Math.max(Math.round(compBase - redundancyPenalty), 5);

  // 4. Experience (10 pts max)
  let maxHackathons = 0;
  let advancedCount = 0;
  for (const m of teamMembers) {
    const hCount = Number(m.hackathons_count || m.hackathonsCount || 0);
    if (hCount > maxHackathons) maxHackathons = hCount;
    if (['Advanced', 'Expert'].includes(m.experience_level)) advancedCount++;
  }
  let expScore = 3;
  if (maxHackathons >= 3) expScore += 4;
  else if (maxHackathons >= 1) expScore += 2;
  if (advancedCount >= 2) expScore += 3;
  else if (advancedCount >= 1) expScore += 2;
  expScore = Math.min(expScore, 10);

  // 5. Availability (10 pts max)
  let availScore = 8;
  const daysCovered = new Set();
  for (const m of teamMembers) {
    const days = m.availability_days || m.availability?.days || 'Weekends';
    daysCovered.add(days);
  }
  if (daysCovered.has('All Days') || (daysCovered.has('Weekends') && daysCovered.has('Weekdays'))) {
    availScore = 10;
  } else if (daysCovered.has('Weekends')) {
    availScore = 8;
  }

  // 6. Team Balance (10 pts max)
  const balancePts = Math.round((dnaResult.teamBalanceScore / 100) * 10);

  const totalReadiness = Math.min(
    Math.max(techScore + roleScore + complementarityScore + expScore + availScore + balancePts, 15),
    99
  );

  // Status message
  let status = 'Developing — lacks core implementation capabilities';
  if (totalReadiness >= 85) {
    status = 'Strong — ready for competition with minor optimizations';
  } else if (totalReadiness >= 70) {
    status = 'Moderate — key technical roles or skills missing';
  }

  // Actionable recommendations
  const recommendations = [];
  if (dnaResult.dna['Backend'].score < 40) {
    recommendations.push('Recruit a dedicated Backend Developer (Python / Node.js) to build reliable APIs.');
  }
  if (dnaResult.dna['AI/ML'].score < 30) {
    recommendations.push('Adding an AI/ML member could drastically improve your project novelty and readiness.');
  }
  if (dnaResult.dna['Database'].score < 30) {
    recommendations.push('Add database capability (SQL or PostgreSQL) to avoid hardcoded mock data bottlenecks.');
  }
  if (maxHackathons < 2) {
    recommendations.push('Onboard a teammate who has participated in prior hackathons for pitching and demo strategy.');
  }
  if (recommendations.length === 0) {
    recommendations.push('Your team configuration is well-optimized. Prepare slide decks and architecture benchmarks.');
  }

  return {
    readinessScore: totalReadiness,
    status,
    breakdown: {
      technicalCoverage: { score: techScore, max: 30 },
      roleCoverage: { score: roleScore, max: 20 },
      skillComplementarity: { score: complementarityScore, max: 20 },
      experience: { score: expScore, max: 10 },
      availability: { score: availScore, max: 10 },
      teamBalance: { score: balancePts, max: 10 }
    },
    recommendations
  };
}

module.exports = {
  calculateHackathonReadiness
};

const { calculateTeamDna } = require('./teamDnaEngine');
const { analyzeTeamGaps } = require('./teamGapEngine');

/**
 * Evaluates team composition and identifies concrete risks categorized by HIGH, MEDIUM, LOW.
 * Deterministic and rooted in database facts.
 */
function detectTeamRisks(teamMembers = [], teamRequirements = {}, hackathon = {}) {
  const risks = [];
  const memberCount = teamMembers.length;

  if (memberCount === 0) {
    return [
      {
        level: 'HIGH',
        category: 'Team Formation',
        title: 'Empty Team Roster',
        description: 'The team currently has zero members. A team cannot participate without at least 2 members.',
        recommendation: 'Invite founding members through the Candidate Discovery portal.'
      }
    ];
  }

  const dnaResult = calculateTeamDna(teamMembers, teamRequirements);
  const gaps = analyzeTeamGaps(teamMembers, teamRequirements);

  // 1. Missing Critical Technical Roles / Capabilities (HIGH)
  if (dnaResult.dna['Backend'].score === 0) {
    risks.push({
      level: 'HIGH',
      category: 'Technical Coverage',
      title: 'Backend & API Gap',
      description: 'No current team member has backend or API development experience. The project cannot persist data or execute server logic.',
      recommendation: 'Recruit a candidate with Python, Node.js, or Java experience.'
    });
  }

  if (dnaResult.dna['Frontend'].score === 0) {
    risks.push({
      level: 'HIGH',
      category: 'Technical Coverage',
      title: 'Frontend Interface Gap',
      description: 'No team member specializes in frontend engineering. Building user interfaces will be severely delayed.',
      recommendation: 'Recruit a candidate proficient in React or modern client frameworks.'
    });
  }

  // 2. Missing Explicit Requirements (HIGH)
  if (gaps.missingRequiredSkills.length > 0) {
    risks.push({
      level: 'HIGH',
      category: 'Team Requirements',
      title: 'Unmet Skill Mandates',
      description: `Team is still missing explicitly required skills: ${gaps.missingRequiredSkills.slice(0, 3).join(', ')}.`,
      recommendation: 'Prioritize candidate discovery filters for these required skills.'
    });
  }

  // 3. Single-Person Skill Dependency / Bottleneck (MEDIUM)
  // Check pillars where exactly 1 member is carrying the pillar
  for (const [pKey, pData] of Object.entries(dnaResult.dna)) {
    if (['Backend', 'AI/ML', 'Frontend'].includes(pKey) && pData.memberContributions.length === 1 && pData.score >= 50) {
      const contributor = pData.memberContributions[0].name;
      risks.push({
        level: 'MEDIUM',
        category: 'Bus Factor / Dependency',
        title: `${pKey} Single-Person Bottleneck`,
        description: `Only ${contributor} covers ${pKey} capabilities. If this member faces blockers, progress on ${pKey} stalls.`,
        recommendation: `Consider cross-skilling or adding a supporting contributor.`
      });
    }
  }

  // 4. Hackathon Experience Deficit (MEDIUM or HIGH)
  let maxHackathons = 0;
  for (const m of teamMembers) {
    const h = Number(m.hackathons_count || m.hackathonsCount || 0);
    if (h > maxHackathons) maxHackathons = h;
  }
  if (maxHackathons === 0) {
    risks.push({
      level: 'HIGH',
      category: 'Competition Experience',
      title: 'Zero Hackathon Experience',
      description: 'None of the current team members have participated in a hackathon before. Pacing and presentation may be a challenge.',
      recommendation: 'Seek advice or onboard an experienced mentor/teammate who knows the judging format.'
    });
  } else if (maxHackathons === 1) {
    risks.push({
      level: 'LOW',
      category: 'Competition Experience',
      title: 'Limited Hackathon Exposure',
      description: 'Team has only 1 past hackathon completed among all members.',
      recommendation: 'Allocate ample time for pitch preparation and deck rehearsals.'
    });
  }

  // 5. Role and Skill Duplication (LOW / MEDIUM)
  if (gaps.roleRedundancies.length > 0) {
    const dupRole = gaps.roleRedundancies[0];
    risks.push({
      level: 'LOW',
      category: 'Role Duplication',
      title: `Multiple ${dupRole.role}s (${dupRole.count} members)`,
      description: `Multiple members share the ${dupRole.role} role while other technical areas remain thin.`,
      recommendation: 'Clarify division of responsibilities to avoid overlapping work.'
    });
  }

  // 6. Team Size & Capacity Constraints (MEDIUM / LOW)
  const minRequired = hackathon.team_size_min || 3;
  const maxAllowed = hackathon.team_size_max || 5;

  if (memberCount < minRequired) {
    risks.push({
      level: 'MEDIUM',
      category: 'Team Capacity',
      title: 'Under Minimum Roster Size',
      description: `Team currently has ${memberCount} members, but ${hackathon.name || 'the hackathon'} requires at least ${minRequired}.`,
      recommendation: `Add at least ${minRequired - memberCount} more member(s) before registration closes.`
    });
  } else if (memberCount >= maxAllowed) {
    risks.push({
      level: 'LOW',
      category: 'Team Capacity',
      title: 'Team At Maximum Capacity',
      description: `Team has reached the maximum size of ${maxAllowed} members. Further invitations cannot be sent.`,
      recommendation: 'Finalize member assignments and begin milestone planning.'
    });
  }

  // Sort risks by severity: HIGH first, then MEDIUM, then LOW
  const severityOrder = { 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
  risks.sort((a, b) => severityOrder[a.level] - severityOrder[b.level]);

  return risks;
}

module.exports = {
  detectTeamRisks
};

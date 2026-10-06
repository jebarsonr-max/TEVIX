const { PILLARS, PROFICIENCY_SCORES } = require('./pillarMap');

/**
 * Calculates Team DNA capabilities and overall team balance score.
 * @param {Array} members - List of member profiles with skills and roles
 * @param {Object} requirements - Team requirements (optional)
 */
function calculateTeamDna(members = [], requirements = {}) {
  const dna = {};
  const memberCount = members.length;

  // Initialize all pillars
  for (const [pillarKey, def] of Object.entries(PILLARS)) {
    dna[pillarKey] = {
      name: def.name,
      score: 0,
      skillsCovered: [],
      memberContributions: []
    };
  }

  if (memberCount === 0) {
    return {
      dna,
      teamBalanceScore: 0,
      explanation: 'No members currently in team.',
      strongPillars: [],
      weakPillars: Object.keys(PILLARS)
    };
  }

  // Calculate scores for each pillar
  for (const [pillarKey, def] of Object.entries(PILLARS)) {
    let rawScore = 0;
    const coveredSkills = new Set();
    const contributingMembers = [];

    for (const member of members) {
      let memberScore = 0;
      const memSkills = member.skills || [];
      const memRoles = member.roles || [];

      // Check skill matches for this pillar
      for (const skill of memSkills) {
        const skillName = typeof skill === 'string' ? skill : skill.name;
        const proficiency = skill.proficiency || 'Intermediate';
        if (def.skills.includes(skillName)) {
          coveredSkills.add(skillName);
          const profVal = PROFICIENCY_SCORES[proficiency] || 60;
          memberScore += profVal * 0.5;
        }
      }

      // Check role matches for this pillar
      for (const role of memRoles) {
        const roleName = typeof role === 'string' ? role : role.name;
        if (def.roles.includes(roleName)) {
          memberScore += 40;
        }
      }

      if (memberScore > 0) {
        contributingMembers.push({
          memberId: member.id,
          name: member.full_name || member.fullName,
          scoreContribution: Math.min(memberScore, 100)
        });
        rawScore += memberScore;
      }
    }

    // Normalized pillar score (max 100)
    // Diminishing returns formula to encourage breadth
    let normalized = 0;
    if (contributingMembers.length > 0) {
      const topMemberScore = Math.max(...contributingMembers.map(m => m.scoreContribution));
      const breadthBonus = Math.min((coveredSkills.size / Math.max(def.skills.length * 0.4, 1)) * 30, 30);
      normalized = Math.min(Math.round(topMemberScore * 0.7 + breadthBonus), 100);
    }

    dna[pillarKey].score = normalized;
    dna[pillarKey].skillsCovered = Array.from(coveredSkills);
    dna[pillarKey].memberContributions = contributingMembers;
  }

  // Identify strong vs weak pillars
  const strongPillars = [];
  const moderatePillars = [];
  const weakPillars = [];

  for (const [key, data] of Object.entries(dna)) {
    if (data.score >= 70) {
      strongPillars.push(key);
    } else if (data.score >= 35) {
      moderatePillars.push(key);
    } else {
      weakPillars.push(key);
    }
  }

  // Calculate Team Balance Score (0-100)
  // Essential hackathon pillars: Frontend, Backend, UI/UX, Presentation, Database
  const corePillars = ['Frontend', 'Backend', 'Database', 'UI/UX', 'Presentation'];
  const coreScores = corePillars.map(p => dna[p].score);
  const avgCore = coreScores.reduce((a, b) => a + b, 0) / corePillars.length;

  // Domain pillar bonus (AI/ML, IoT, Cloud, Cybersecurity, Research)
  const domainPillars = ['AI/ML', 'Cloud', 'Cybersecurity', 'IoT', 'Research'];
  const domainScores = domainPillars.map(p => dna[p].score);
  const topDomainScore = Math.max(...domainScores, 0);

  // Severe deficiency penalty (if core technical areas like backend/database are 0%)
  let deficiencyPenalty = 0;
  if (dna['Backend'].score === 0) deficiencyPenalty += 12;
  if (dna['Database'].score === 0) deficiencyPenalty += 6;
  if (dna['Frontend'].score === 0) deficiencyPenalty += 10;
  if (dna['Presentation'].score === 0) deficiencyPenalty += 5;

  let balanceScore = Math.round((avgCore * 0.65) + (topDomainScore * 0.35) - deficiencyPenalty);
  balanceScore = Math.max(Math.min(balanceScore, 98), 20);

  // Natural Language Explanation
  let explanation = '';
  const strongText = strongPillars.length > 0
    ? strongPillars.slice(0, 3).join(', ')
    : 'basic capabilities';
  const weakText = weakPillars.filter(p => ['Backend', 'AI/ML', 'Database', 'Frontend'].includes(p)).slice(0, 2).join(' and ');

  if (weakText) {
    explanation = `Your team is strong in ${strongText.toLowerCase()}, but needs stronger ${weakText.toLowerCase()} coverage.`;
  } else {
    explanation = `Your team shows well-rounded coverage across ${strongText.toLowerCase()} with high operational readiness.`;
  }

  return {
    dna,
    teamBalanceScore: balanceScore,
    explanation,
    strongPillars,
    moderatePillars,
    weakPillars
  };
}

module.exports = {
  calculateTeamDna
};

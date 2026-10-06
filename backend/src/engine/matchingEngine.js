const { calculateTeamDna } = require('./teamDnaEngine');
const { analyzeTeamGaps } = require('./teamGapEngine');
const { PILLARS } = require('./pillarMap');

/**
 * Calculates deterministic, explainable match score between a candidate and a team.
 * Follows the 100-point transparent weighted model:
 * - Skill Match: 35%
 * - Role Match: 25%
 * - Experience: 15%
 * - Availability: 10%
 * - Department: 10%
 * - Hackathon Interest: 5%
 * Plus Skill Complementarity integration and dynamic why bullet explanations.
 */
function calculateCandidateMatch(candidate, teamMembers = [], teamRequirements = {}, hackathon = {}) {
  const currentDna = calculateTeamDna(teamMembers, teamRequirements);
  const gaps = analyzeTeamGaps(teamMembers, teamRequirements);

  const candidateSkills = (candidate.skills || []).map(s => typeof s === 'string' ? s : s.name);
  const candidateRoles = (candidate.roles || []).map(r => typeof r === 'string' ? r : r.name);
  const reqSkills = (teamRequirements.requiredSkills || []).map(s => typeof s === 'string' ? s : s.name);
  const reqRoles = (teamRequirements.requiredRoles || []).map(r => typeof r === 'string' ? r : r.name);

  // Existing team skills and roles
  const existingTeamSkills = new Set();
  const existingTeamRoles = new Set();
  for (const m of teamMembers) {
    for (const s of (m.skills || [])) {
      existingTeamSkills.add(typeof s === 'string' ? s : s.name);
    }
    for (const r of (m.roles || [])) {
      existingTeamRoles.add(typeof r === 'string' ? r : r.name);
    }
  }

  const whyPoints = [];

  // ==========================================
  // 1. SKILL MATCH (Max 35 points)
  // Consists of:
  // - Required Skill Match (up to 20 pts)
  // - Complementarity / Gap Fill Match (up to 15 pts)
  // - Minus slight redundancy penalty if only redundant skills
  // ==========================================
  let skillMatchScore = 0;
  const matchedRequiredSkills = candidateSkills.filter(s => reqSkills.includes(s));
  const newSkillsForTeam = candidateSkills.filter(s => !existingTeamSkills.has(s));
  const redundantSkills = candidateSkills.filter(s => existingTeamSkills.has(s));

  if (reqSkills.length > 0) {
    const reqRatio = matchedRequiredSkills.length / Math.min(reqSkills.length, 3);
    skillMatchScore += Math.min(reqRatio * 20, 20);
    if (matchedRequiredSkills.length > 0) {
      whyPoints.push(`✓ Matches ${matchedRequiredSkills.slice(0, 2).join(' and ')} required team skill`);
    }
  } else {
    // If no explicit required skills, base on breadth of skills
    skillMatchScore += Math.min(candidateSkills.length * 4, 18);
  }

  // Complementarity Bonus (fills missing pillars)
  let filledPillars = 0;
  const missingPillars = gaps.dnaResult.weakPillars;
  for (const p of missingPillars) {
    const pillarSkills = PILLARS[p]?.skills || [];
    const hasPillarSkill = candidateSkills.some(cs => pillarSkills.includes(cs));
    if (hasPillarSkill) {
      filledPillars++;
      if (['Backend', 'AI/ML', 'Database', 'Cloud', 'Cybersecurity'].includes(p)) {
        whyPoints.push(`✓ Fills critical ${p} capability gap`);
      }
    }
  }

  const compBonus = Math.min(filledPillars * 5, 15);
  skillMatchScore += compBonus;

  // Redundancy handling
  if (redundantSkills.length > 0 && newSkillsForTeam.length === 0) {
    skillMatchScore = Math.max(skillMatchScore - 5, 5);
  } else if (newSkillsForTeam.length > 0) {
    whyPoints.push(`✓ Reduces skill redundancy by introducing fresh competencies`);
  }

  skillMatchScore = Math.min(Math.round(skillMatchScore), 35);

  // ==========================================
  // 2. ROLE MATCH (Max 25 points)
  // ==========================================
  let roleMatchScore = 0;
  const matchedReqRoles = candidateRoles.filter(r => reqRoles.includes(r));
  const missingRoles = gaps.missingRequiredRoles.concat(gaps.generalRoleGaps);
  const fillsMissingRole = candidateRoles.some(r => missingRoles.includes(r));

  if (matchedReqRoles.length > 0) {
    roleMatchScore = 25;
    whyPoints.push(`✓ Directly fills required role: ${matchedReqRoles[0]}`);
  } else if (fillsMissingRole) {
    roleMatchScore = 20;
    const filledRole = candidateRoles.find(r => missingRoles.includes(r));
    whyPoints.push(`✓ Fills missing team role: ${filledRole}`);
  } else if (candidateRoles.some(r => !existingTeamRoles.has(r))) {
    roleMatchScore = 14;
    whyPoints.push(`✓ Adds role diversity (${candidateRoles[0]})`);
  } else {
    roleMatchScore = 7;
  }

  // ==========================================
  // 3. EXPERIENCE MATCH (Max 15 points)
  // ==========================================
  let experienceScore = 0;
  const expLevel = candidate.experience_level || candidate.experienceLevel || 'Intermediate';
  const hackathonsCount = Number(candidate.hackathons_count || candidate.hackathonsCount || 0);

  if (expLevel === 'Expert') experienceScore += 11;
  else if (expLevel === 'Advanced') experienceScore += 9;
  else if (expLevel === 'Intermediate') experienceScore += 7;
  else experienceScore += 4;

  const hScore = Math.min(hackathonsCount * 1.5, 4);
  experienceScore += Math.round(hScore);
  experienceScore = Math.min(experienceScore, 15);

  if (hackathonsCount >= 2) {
    whyPoints.push(`✓ Proven track record with ${hackathonsCount} completed hackathons`);
  } else if (expLevel === 'Advanced' || expLevel === 'Expert') {
    whyPoints.push(`✓ ${expLevel} technical proficiency`);
  }

  // ==========================================
  // 4. AVAILABILITY MATCH (Max 10 points)
  // ==========================================
  let availabilityScore = 7; // Default baseline
  const candDays = candidate.availability_days || candidate.availability?.days || 'Weekends';
  const candSlots = candidate.availability_slots || candidate.availability?.timeSlots || 'Evening, Night';
  const teamPrefAvail = (teamRequirements.preferred_availability || teamRequirements.preferredAvailability || '').toLowerCase();

  let hasSlotOverlap = false;
  if (candSlots.toLowerCase().includes('evening') || candSlots.toLowerCase().includes('night')) {
    hasSlotOverlap = true;
  }

  if (teamPrefAvail.includes('weekend') && candDays.includes('Weekend')) {
    availabilityScore += 3;
    whyPoints.push(`✓ Weekend schedule aligns with team hackathon plan`);
  } else if (candDays.includes('All')) {
    availabilityScore += 3;
    whyPoints.push(`✓ Highly flexible availability throughout the week`);
  } else if (hasSlotOverlap) {
    availabilityScore += 2;
    whyPoints.push(`✓ Evening collaboration overlap matches team schedule`);
  }

  availabilityScore = Math.min(availabilityScore, 10);

  // ==========================================
  // 5. DEPARTMENT MATCH (Max 10 points)
  // ==========================================
  let departmentScore = 6;
  const deptPref = (teamRequirements.department_preference || teamRequirements.departmentPreference || 'Any').toLowerCase();
  const candDept = (candidate.department || '').toLowerCase();

  if (deptPref !== 'any' && deptPref.includes(candDept)) {
    departmentScore = 10;
    whyPoints.push(`✓ Aligns with target department (${candidate.department})`);
  } else {
    // Interdisciplinary bonus: CSE + AI/DS or CSE + IT adds cross-domain breadth
    const existingDepts = new Set(teamMembers.map(m => (m.department || '').toLowerCase()));
    if (!existingDepts.has(candDept)) {
      departmentScore = 9;
      whyPoints.push(`✓ Interdisciplinary department diversity (${candidate.department})`);
    } else {
      departmentScore = 7;
    }
  }

  // ==========================================
  // 6. HACKATHON INTEREST MATCH (Max 5 points)
  // ==========================================
  let interestScore = 4;
  if (hackathon && hackathon.category) {
    const hCat = hackathon.category.toLowerCase();
    if (hCat.includes('ai') && candidateRoles.some(r => r.includes('AI') || r.includes('Data'))) {
      interestScore = 5;
      whyPoints.push(`✓ Domain expertise aligned with ${hackathon.name || 'hackathon'}`);
    } else if (hCat.includes('smart') || hCat.includes('innovation')) {
      interestScore = 5;
    }
  }

  // ==========================================
  // TOTAL SCORE & TIER
  // ==========================================
  const totalScore = Math.min(
    Math.max(
      skillMatchScore + roleMatchScore + experienceScore + availabilityScore + departmentScore + interestScore,
      15
    ),
    99
  );

  let matchCategory = 'Low Match';
  if (totalScore >= 90) matchCategory = 'Excellent Match';
  else if (totalScore >= 75) matchCategory = 'Strong Match';
  else if (totalScore >= 60) matchCategory = 'Potential Match';

  // Calculate dynamic team impact score (+X% balance increase)
  const simulatedMembers = [...teamMembers, candidate];
  const simulatedDna = calculateTeamDna(simulatedMembers, teamRequirements);
  const teamImpactDelta = Math.max(simulatedDna.teamBalanceScore - currentDna.teamBalanceScore, 0);

  return {
    candidateId: candidate.id,
    candidateName: candidate.full_name || candidate.fullName,
    totalScore,
    matchCategory,
    breakdown: {
      skillMatch: { score: skillMatchScore, max: 35 },
      roleMatch: { score: roleMatchScore, max: 25 },
      experience: { score: experienceScore, max: 15 },
      availability: { score: availabilityScore, max: 10 },
      department: { score: departmentScore, max: 10 },
      interest: { score: interestScore, max: 5 }
    },
    whyPoints: whyPoints.slice(0, 6),
    teamImpactDelta,
    currentTeamBalance: currentDna.teamBalanceScore,
    projectedTeamBalance: simulatedDna.teamBalanceScore
  };
}

module.exports = {
  calculateCandidateMatch
};

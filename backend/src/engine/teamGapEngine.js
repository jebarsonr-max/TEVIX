const { PILLARS } = require('./pillarMap');
const { calculateTeamDna } = require('./teamDnaEngine');

/**
 * Evaluates a team's composition to identify gaps, redundancies, missing capabilities,
 * and next recommended role/skills.
 */
function analyzeTeamGaps(members = [], requirements = {}) {
  const memberCount = members.length;
  const dnaResult = calculateTeamDna(members, requirements);

  // Aggregate current team skills & roles
  const skillFrequency = {};
  const roleFrequency = {};
  const currentSkills = new Set();
  const currentRoles = new Set();

  let maxHackathons = 0;
  let hasAdvancedOrExpert = false;

  for (const m of members) {
    // Skills
    const mSkills = m.skills || [];
    for (const s of mSkills) {
      const name = typeof s === 'string' ? s : s.name;
      const prof = s.proficiency || 'Intermediate';
      currentSkills.add(name);
      skillFrequency[name] = (skillFrequency[name] || 0) + 1;
      if (prof === 'Advanced' || prof === 'Expert') {
        hasAdvancedOrExpert = true;
      }
    }

    // Roles
    const mRoles = m.roles || [];
    for (const r of mRoles) {
      const name = typeof r === 'string' ? r : r.name;
      currentRoles.add(name);
      roleFrequency[name] = (roleFrequency[name] || 0) + 1;
    }

    // Experience
    const hCount = Number(m.hackathons_count || m.hackathonsCount || 0);
    if (hCount > maxHackathons) maxHackathons = hCount;
    if (m.experience_level === 'Advanced' || m.experience_level === 'Expert') {
      hasAdvancedOrExpert = true;
    }
  }

  // 1. Identify Missing Technical Skills
  const reqSkills = requirements.requiredSkills || requirements.skills || [];
  const missingRequiredSkills = [];
  for (const rs of reqSkills) {
    const sName = typeof rs === 'string' ? rs : rs.name;
    if (!currentSkills.has(sName)) {
      missingRequiredSkills.push(sName);
    }
  }

  // Foundational skills missing across technical pillars
  const generalSkillGaps = [];
  if (!currentSkills.has('Python') && !currentSkills.has('Node.js') && !currentSkills.has('Java') && !currentSkills.has('Go')) {
    generalSkillGaps.push('Backend Language (Python / Node.js / Java)');
  }
  if (!currentSkills.has('SQL') && !currentSkills.has('PostgreSQL') && !currentSkills.has('MongoDB')) {
    generalSkillGaps.push('Database (SQL / PostgreSQL / MongoDB)');
  }
  if (!currentSkills.has('Machine Learning') && !currentSkills.has('Deep Learning') && !currentSkills.has('PyTorch')) {
    generalSkillGaps.push('AI/ML (Machine Learning / Deep Learning)');
  }
  if (!currentSkills.has('React') && !currentSkills.has('Vue.js') && !currentSkills.has('Next.js')) {
    generalSkillGaps.push('Modern Web Framework (React / Next.js)');
  }

  // 2. Identify Missing Roles
  const reqRoles = requirements.requiredRoles || requirements.roles || [];
  const missingRequiredRoles = [];
  for (const rr of reqRoles) {
    const rName = typeof rr === 'string' ? rr : rr.name;
    if (!currentRoles.has(rName)) {
      missingRequiredRoles.push(rName);
    }
  }

  const standardCoreRoles = ['Backend Developer', 'AI/ML Engineer', 'Frontend Developer', 'UI/UX Designer'];
  const generalRoleGaps = standardCoreRoles.filter(r => !currentRoles.has(r));

  // 3. Identify Missing Project Capabilities
  const missingCapabilities = [];
  if (dnaResult.dna['Backend'].score < 30) {
    missingCapabilities.push({
      pillar: 'Backend',
      title: 'Server-side REST API & Architecture',
      description: 'Lack of backend endpoints to process user requests, authentication, and core business logic.'
    });
  }
  if (dnaResult.dna['AI/ML'].score < 30) {
    missingCapabilities.push({
      pillar: 'AI/ML',
      title: 'Machine Learning & Predictive Engine',
      description: 'No team capability to train, fine-tune or serve intelligent data models.'
    });
  }
  if (dnaResult.dna['Database'].score < 30) {
    missingCapabilities.push({
      pillar: 'Database',
      title: 'Relational & Structured Persistence',
      description: 'Absence of database schema design, migrations, indexing, and SQL/NoSQL querying.'
    });
  }
  if (dnaResult.dna['Cloud'].score < 25) {
    missingCapabilities.push({
      pillar: 'Cloud',
      title: 'Containerization & Cloud Deployment',
      description: 'No Docker/AWS infrastructure support for live staging or hosting demo endpoints.'
    });
  }
  if (dnaResult.dna['Frontend'].score < 30) {
    missingCapabilities.push({
      pillar: 'Frontend',
      title: 'Interactive User Interface & Client State',
      description: 'Need dedicated frontend developer to build responsive and interactive views.'
    });
  }

  // 4. Missing Experience & Availability Gaps
  const experienceGaps = [];
  if (maxHackathons === 0) {
    experienceGaps.push('No member has prior hackathon competition experience.');
  }
  if (!hasAdvancedOrExpert) {
    experienceGaps.push('No senior technical lead with Advanced or Expert proficiency.');
  }

  // 5. Skill and Role Redundancies
  const skillRedundancies = [];
  for (const [skill, count] of Object.entries(skillFrequency)) {
    if (count >= 2) {
      skillRedundancies.push({ skill, count });
    }
  }

  const roleRedundancies = [];
  for (const [role, count] of Object.entries(roleFrequency)) {
    if (count >= 2) {
      roleRedundancies.push({ role, count });
    }
  }

  // 6. Recommendation for Next Role and Priority Skills
  let recommendedNextRole = 'Full Stack Developer';
  if (missingRequiredRoles.length > 0) {
    recommendedNextRole = missingRequiredRoles[0];
  } else if (dnaResult.dna['Backend'].score < 30 && dnaResult.dna['AI/ML'].score < 30) {
    recommendedNextRole = 'Backend Developer / AI/ML Engineer';
  } else if (dnaResult.dna['Backend'].score < 30) {
    recommendedNextRole = 'Backend Developer';
  } else if (dnaResult.dna['AI/ML'].score < 30) {
    recommendedNextRole = 'AI/ML Engineer';
  } else if (dnaResult.dna['Database'].score < 30) {
    recommendedNextRole = 'Backend Developer';
  } else if (dnaResult.dna['Cloud'].score < 30) {
    recommendedNextRole = 'Cloud/DevOps Engineer';
  }

  const recommendedNextSkills = [];
  if (missingRequiredSkills.length > 0) {
    recommendedNextSkills.push(...missingRequiredSkills.slice(0, 4));
  } else {
    if (dnaResult.dna['Backend'].score < 30) recommendedNextSkills.push('Python', 'Node.js', 'SQL');
    if (dnaResult.dna['AI/ML'].score < 30) recommendedNextSkills.push('Machine Learning', 'PyTorch');
    if (dnaResult.dna['Database'].score < 30 && !recommendedNextSkills.includes('SQL')) recommendedNextSkills.push('SQL', 'PostgreSQL');
  }

  // Summary message
  const summary = dnaResult.explanation;

  return {
    summary,
    recommendedNextRole,
    recommendedNextSkills: Array.from(new Set(recommendedNextSkills)),
    missingRequiredSkills,
    generalSkillGaps,
    missingRequiredRoles,
    generalRoleGaps,
    missingCapabilities,
    experienceGaps,
    skillRedundancies,
    roleRedundancies,
    dnaResult
  };
}

module.exports = {
  analyzeTeamGaps
};

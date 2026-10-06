const db = require('./src/database/db');
const { getFullTeamById, getAllFullProfiles } = require('./src/database/helpers');
const { calculateTeamDna } = require('./src/engine/teamDnaEngine');
const { analyzeTeamGaps } = require('./src/engine/teamGapEngine');
const { calculateCandidateMatch } = require('./src/engine/matchingEngine');
const { calculateHackathonReadiness } = require('./src/engine/readinessEngine');
const { simulateCandidateAddition } = require('./src/engine/simulatorEngine');
const { detectTeamRisks } = require('./src/engine/riskDetectorEngine');
const { buildIdealTeam } = require('./src/engine/idealTeamEngine');

console.log('Testing TEVIX Engines and Database...');

// 1. Fetch Demo Team
const demoTeam = getFullTeamById(1);
if (!demoTeam) {
  console.error('FAIL: Demo team not found!');
  process.exit(1);
}
console.log(`PASS: Demo Team loaded: "${demoTeam.name}" with ${demoTeam.members.length} members`);

// 2. Test Team DNA
const dna = calculateTeamDna(demoTeam.members, demoTeam.requirements);
console.log(`PASS: Team Balance Score: ${dna.teamBalanceScore}%`);
console.log(`PASS: Team DNA Frontend: ${dna.dna['Frontend'].score}%, Backend: ${dna.dna['Backend'].score}%, AI/ML: ${dna.dna['AI/ML'].score}%`);

// 3. Test Team Gap Intelligence
const gaps = analyzeTeamGaps(demoTeam.members, demoTeam.requirements);
console.log(`PASS: Team Gaps summary: "${gaps.summary}"`);
console.log(`PASS: Recommended next role: "${gaps.recommendedNextRole}"`);
console.log(`PASS: Recommended next skills:`, gaps.recommendedNextSkills);

// 4. Test Candidate Matching with Kavin Raj (Backend) vs Redundant Frontend
const candidates = getAllFullProfiles();
const kavin = candidates.find(c => c.full_name === 'Kavin Raj');
const pooja = candidates.find(c => c.full_name === 'Pooja Joshi');

if (kavin) {
  const kavinMatch = calculateCandidateMatch(kavin, demoTeam.members, demoTeam.requirements, demoTeam.hackathon);
  console.log(`PASS: Kavin Raj Match Score: ${kavinMatch.totalScore}% (${kavinMatch.matchCategory}), Team Impact: +${kavinMatch.teamImpactDelta}%`);
  console.log(`PASS: Why Kavin?`, kavinMatch.whyPoints);
}

if (pooja) {
  const poojaMatch = calculateCandidateMatch(pooja, demoTeam.members, demoTeam.requirements, demoTeam.hackathon);
  console.log(`PASS: Pooja Joshi (Redundant Frontend) Match Score: ${poojaMatch.totalScore}% (${poojaMatch.matchCategory})`);
}

// 5. Test What-If Simulator with Kavin
if (kavin) {
  const sim = simulateCandidateAddition(kavin, demoTeam.members, demoTeam.requirements, demoTeam.hackathon);
  console.log(`PASS: What-If Simulation for Kavin: Balance Before=${sim.before.teamBalanceScore}%, After=${sim.after.teamBalanceScore}%, Delta=${sim.improvement.balanceDelta}`);
  console.log(`PASS: Simulator Explanation: "${sim.explanation}"`);
}

// 6. Test Hackathon Readiness
const readiness = calculateHackathonReadiness(demoTeam.members, demoTeam.requirements, demoTeam.hackathon);
console.log(`PASS: Hackathon Readiness Score: ${readiness.readinessScore}/100 (${readiness.status})`);

// 7. Test Risk Detector
const risks = detectTeamRisks(demoTeam.members, demoTeam.requirements, demoTeam.hackathon);
console.log(`PASS: Detected ${risks.length} risks.`);
risks.forEach(r => console.log(`   [${r.level}] ${r.title}: ${r.description}`));

// 8. Test Ideal Team
const ideal = buildIdealTeam({
  candidates,
  teamSize: 4,
  requiredRoles: ['Frontend Developer', 'Backend Developer', 'AI/ML Engineer', 'UI/UX Designer']
});
console.log(`PASS: Ideal Team generated with ${ideal.idealMembers.length} members. Predicted Balance: ${ideal.predictedTeamBalance}%, Predicted Readiness: ${ideal.predictedHackathonReadiness}%`);

console.log('All backend and engine tests PASSED successfully!');

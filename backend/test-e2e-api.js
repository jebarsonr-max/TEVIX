const http = require('http');
const app = require('./src/index');

let server;
const PORT = 5099;

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request({
      hostname: 'localhost',
      port: PORT,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
      }
    }, res => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(raw);
          resolve({ status: res.statusCode, body: parsed });
        } catch {
          resolve({ status: res.statusCode, body: raw });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function runE2ETests() {
  server = app.listen(PORT, async () => {
    console.log(`Test server running on port ${PORT}...`);
    try {
      // 1. Health check
      console.log('1. Testing /api/health...');
      const health = await request('GET', '/api/health');
      if (health.status !== 200) throw new Error('Health check failed');
      console.log('   PASS /api/health');

      // 2. Metadata
      console.log('2. Testing /api/metadata...');
      const meta = await request('GET', '/api/metadata');
      if (meta.status !== 200 || meta.body.skills.length === 0) throw new Error('Metadata failed');
      console.log(`   PASS /api/metadata (${meta.body.skills.length} skills, ${meta.body.roles.length} roles)`);

      // 3. Login as Arjun
      console.log('3. Testing /api/auth/login...');
      const login = await request('POST', '/api/auth/login', {
        email: 'arjun@tevix.dev',
        password: 'password123'
      });
      if (login.status !== 200 || !login.body.token) throw new Error('Login failed');
      const token = login.body.token;
      console.log('   PASS /api/auth/login token acquired');

      // 4. Get My Profile
      console.log('4. Testing /api/profile...');
      const prof = await request('GET', '/api/profile', null, token);
      if (prof.status !== 200 || prof.body.full_name !== 'Arjun Kumar') throw new Error('Profile retrieval failed');
      console.log('   PASS /api/profile');

      // 5. Get Demo Team details
      console.log('5. Testing /api/teams/1...');
      const team = await request('GET', '/api/teams/1', null, token);
      if (team.status !== 200 || !team.body.analytics) throw new Error('Team detail failed');
      console.log(`   PASS /api/teams/1 (Balance: ${team.body.analytics.teamBalanceScore}%, Readiness: ${team.body.analytics.hackathonReadinessScore}%)`);

      // 6. Test Team Gap Intelligence
      console.log('6. Testing /api/teams/1/gaps...');
      const gaps = await request('GET', '/api/teams/1/gaps', null, token);
      if (gaps.status !== 200 || !gaps.body.recommendedNextRole) throw new Error('Gaps endpoint failed');
      console.log(`   PASS /api/teams/1/gaps (Recommended: ${gaps.body.recommendedNextRole})`);

      // 7. Test What-If Simulator with Candidate #4 (Kavin Raj)
      console.log('7. Testing /api/teams/1/simulate/4...');
      const sim = await request('GET', '/api/teams/1/simulate/4', null, token);
      if (sim.status !== 200 || !sim.body.improvement) throw new Error('Simulation endpoint failed');
      console.log(`   PASS /api/teams/1/simulate/4 (Delta: ${sim.body.improvement.balanceDelta})`);

      // 8. Test Candidate Discovery & Filter
      console.log('8. Testing /api/students with role filter...');
      const students = await request('GET', '/api/students?role=Backend%20Developer', null, token);
      if (students.status !== 200 || students.body.students.length === 0) throw new Error('Students filter failed');
      console.log(`   PASS /api/students (${students.body.students.length} backend candidates found)`);

      // 9. Test Requests Retrieval
      console.log('9. Testing /api/requests...');
      const reqs = await request('GET', '/api/requests', null, token);
      if (reqs.status !== 200) throw new Error('Requests endpoint failed');
      console.log(`   PASS /api/requests (${reqs.body.incoming.length} incoming, ${reqs.body.outgoing.length} outgoing)`);

      // 10. Test Build My Ideal Team
      console.log('10. Testing /api/ideal-team...');
      const ideal = await request('POST', '/api/ideal-team', {
        teamSize: 4,
        requiredRoles: ['Frontend Developer', 'Backend Developer', 'AI/ML Engineer', 'UI/UX Designer']
      });
      if (ideal.status !== 200 || ideal.body.idealMembers.length !== 4) throw new Error('Ideal team synthesis failed');
      console.log(`   PASS /api/ideal-team (Predicted Balance: ${ideal.body.predictedTeamBalance}%)`);

      console.log('=====================================================');
      console.log('  ALL END-TO-END REST API TESTS PASSED SUCCESSFULLY! ');
      console.log('=====================================================');
      if (server) server.close(() => process.exit(0));
      else process.exit(0);
    } catch (err) {
      console.error('E2E Test Failed:', err);
      if (server) server.close(() => process.exit(1));
      else process.exit(1);
    }
  });
}

runE2ETests();

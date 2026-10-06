const express = require('express');
const router = express.Router();
const teamsController = require('../controllers/teamsController');
const { requireAuth, optionalAuth } = require('../middleware/auth');

router.post('/', requireAuth, teamsController.createTeam);
router.get('/', optionalAuth, teamsController.getTeams);
router.get('/:id', optionalAuth, teamsController.getTeamById);
router.put('/:id', requireAuth, teamsController.updateTeam);

// Novel Team Analytics Endpoints
router.get('/:id/gaps', optionalAuth, teamsController.getTeamGaps);
router.get('/:id/balance', optionalAuth, teamsController.getTeamBalance);
router.get('/:id/dna', optionalAuth, teamsController.getTeamDna);
router.get('/:id/risks', optionalAuth, teamsController.getTeamRisks);
router.get('/:id/readiness', optionalAuth, teamsController.getTeamReadiness);
router.get('/:id/simulate/:candidateId', optionalAuth, teamsController.simulateCandidate);

// Member management
router.delete('/:id/members/:memberId', requireAuth, teamsController.removeMember);

module.exports = router;

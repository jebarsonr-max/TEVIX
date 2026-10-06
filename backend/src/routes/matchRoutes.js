const express = require('express');
const router = express.Router();
const matchesController = require('../controllers/matchesController');
const { optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, matchesController.getMatchesForTeam);
router.get('/:studentId', optionalAuth, matchesController.getMatchForStudent);

module.exports = router;

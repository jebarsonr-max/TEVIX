const express = require('express');
const router = express.Router();
const studentsController = require('../controllers/studentsController');
const { optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, studentsController.getStudents);
router.get('/:id', optionalAuth, studentsController.getStudentById);

module.exports = router;

const express = require('express');
const router = express.Router();
const requestsController = require('../controllers/requestsController');
const { requireAuth } = require('../middleware/auth');

router.post('/', requireAuth, requestsController.sendRequest);
router.get('/', requireAuth, requestsController.getRequests);
router.put('/:id', requireAuth, requestsController.updateRequestStatus);

module.exports = router;

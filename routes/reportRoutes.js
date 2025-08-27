const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

// User-wise performance
router.get('/user/:user_id', authenticate, authorize(['admin','user']), reportController.userPerformance);

// Time-based performance (week/month)
router.get('/user/:user_id/time', authenticate, authorize(['admin','user']), reportController.timeBasedPerformance);

module.exports = router;

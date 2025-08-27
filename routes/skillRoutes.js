const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

router.post('/', authenticate, authorize(['admin']), skillController.createSkill);
router.get('/', authenticate, skillController.getSkills);

module.exports = router;

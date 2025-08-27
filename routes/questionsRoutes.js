const express = require('express');
const router = express.Router();
const questionsController = require('../controllers/questionsController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

router.post('/', authenticate, authorize(['admin']), questionsController.createQuestion);
router.get('/', authenticate, questionsController.getQuestions);

module.exports = router;

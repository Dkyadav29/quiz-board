const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const authenticate = require('../middleware/authMiddleware');

router.post('/', authenticate, questionController.createQuestion);
router.get('/', authenticate, questionController.getQuestions);

module.exports = router;

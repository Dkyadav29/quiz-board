const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const authenticate = require('../middleware/authMiddleware');

router.post('/', authenticate, quizController.submitQuiz);
router.get('/', authenticate, quizController.getQuizAttempts);

module.exports = router;

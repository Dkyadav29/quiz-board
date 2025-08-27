const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Admin-only route
router.get('/', authenticate, authorize(['admin']), userController.getUsers);

module.exports = router;

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    updateProfile,
    changePassword,
    updatePreferences,
    getProfile
} = require('../controllers/userController');

// Add logging middleware
router.use((req, res, next) => {
    console.log(`User API Request: ${req.method} ${req.path}`);
    console.log('Request body:', req.body);
    next();
});

// Protected routes
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.put('/preferences', protect, updatePreferences);
router.get('/profile', protect, getProfile);

module.exports = router; 
const express = require('express');
const router = express.Router();
const {
    register,
    login,
    registerAdmin,
    sendEmailOTP,
    verifyOTP,
    verifyToken,
    clearUsers
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');
const User = require('../models/User');

router.post('/register', register);
router.post('/register-admin', registerAdmin);
router.post('/login', login);
router.post('/send-email-otp', sendEmailOTP);
router.post('/verify-otp', verifyOTP);
router.get('/verify-token', protect, verifyToken);
router.get('/me', protect, async (req, res) => {
    res.status(200).json({
        success: true,
        data: req.user
    });
});

// Admin dashboard route
router.get('/admin/dashboard', protect, authorize('admin'), (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to admin dashboard'
    });
});

// Add temporarily and remove after use
router.delete('/clear-users', clearUsers);

module.exports = router; 
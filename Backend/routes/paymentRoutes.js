const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { initiatePayment, handleCallback } = require('../controllers/paymentController');

// Protected route for payment initiation
router.post('/initiate', protect, initiatePayment);

// Callback route for PhonePe (not protected as it's called by PhonePe)
router.post('/callback', handleCallback);

module.exports = router; 
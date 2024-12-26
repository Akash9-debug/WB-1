const express = require('express');
const router = express.Router();
const { sendEmail } = require('../utils/emailService');

router.post('/test-email', async (req, res) => {
    try {
        await sendEmail({
            to: req.body.email,
            subject: 'Test Email',
            html: '<h1>Test Email</h1><p>This is a test email from your bookstore application.</p>'
        });
        
        res.json({
            success: true,
            message: 'Test email sent successfully'
        });
    } catch (error) {
        console.error('Test email error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send test email',
            error: error.message
        });
    }
});

module.exports = router; 
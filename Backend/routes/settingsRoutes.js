const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getSettings, updateSettings } = require('../controllers/settingsController');

router.get('/admin/settings', protect, admin, getSettings);
router.put('/admin/settings', protect, admin, updateSettings);

module.exports = router; 
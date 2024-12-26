const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getSettings,
    updateMaintenanceMode,
    updateInventorySettings,
    getInventoryStatus,
    updateWorkbookSettings
} = require('../controllers/adminSettingsController');

// All routes require admin authentication
router.use(protect, authorize('admin'));

router.get('/settings', getSettings);
router.put('/maintenance', updateMaintenanceMode);
router.put('/inventory-settings', updateInventorySettings);
router.get('/inventory-status', getInventoryStatus);
router.put('/workbook-settings', updateWorkbookSettings);

module.exports = router;
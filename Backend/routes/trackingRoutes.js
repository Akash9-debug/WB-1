const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const TrackingService = require('../services/trackingService');

// Get order tracking (for both user and admin)
router.get('/orders/:orderId', protect, async (req, res) => {
    try {
        const tracking = await TrackingService.getOrderTracking(req.params.orderId);
        res.status(200).json({
            success: true,
            data: tracking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Update order status (admin only)
router.put('/orders/:orderId', protect, authorize('admin'), async (req, res) => {
    try {
        const { status, ...details } = req.body;
        details.updatedBy = req.user._id;
        
        const order = await TrackingService.updateOrderStatus(
            req.params.orderId,
            status,
            details
        );

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router; 
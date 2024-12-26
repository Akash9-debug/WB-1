const AdminSettings = require('../models/AdminSettings');

const maintenanceMode = async (req, res, next) => {
    try {
        // Skip maintenance check for admin users
        if (req.user && req.user.role === 'admin') {
            return next();
        }

        const settings = await AdminSettings.findOne();
        if (settings?.maintenanceMode?.isEnabled) {
            return res.status(503).json({
                success: false,
                message: settings.maintenanceMode.message || 'Site is under maintenance'
            });
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = maintenanceMode; 
const AdminSettings = require('../models/AdminSettings');
const Book = require('../models/Book');
const Workbook = require('../models/Workbook');

// Get admin settings
exports.getSettings = async (req, res) => {
    try {
        let settings = await AdminSettings.findOne();
        if (!settings) {
            settings = await AdminSettings.create({});
        }

        res.status(200).json({
            success: true,
            data: settings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching admin settings'
        });
    }
};

// Update maintenance mode
exports.updateMaintenanceMode = async (req, res) => {
    try {
        const { isEnabled, message } = req.body;

        const settings = await AdminSettings.findOneAndUpdate(
            {},
            {
                'maintenanceMode.isEnabled': isEnabled,
                'maintenanceMode.message': message,
                updatedBy: req.user.id
            },
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            data: settings.maintenanceMode
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating maintenance mode'
        });
    }
};

// Update inventory settings
exports.updateInventorySettings = async (req, res) => {
    try {
        const { lowStockThreshold, notifyOnLowStock } = req.body;

        const settings = await AdminSettings.findOneAndUpdate(
            {},
            {
                'inventory.lowStockThreshold': lowStockThreshold,
                'inventory.notifyOnLowStock': notifyOnLowStock,
                updatedBy: req.user.id
            },
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            data: settings.inventory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating inventory settings'
        });
    }
};

// Get inventory status
exports.getInventoryStatus = async (req, res) => {
    try {
        const settings = await AdminSettings.findOne();
        const threshold = settings?.inventory?.lowStockThreshold || 10;

        const lowStockBooks = await Book.find({ stock: { $lte: threshold } });
        const lowStockWorkbooks = await Workbook.find({ stock: { $lte: threshold } });

        res.status(200).json({
            success: true,
            data: {
                lowStockItems: [...lowStockBooks, ...lowStockWorkbooks],
                threshold
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching inventory status'
        });
    }
};

// Update workbook settings
exports.updateWorkbookSettings = async (req, res) => {
    try {
        const { allowPracticeTests, maxFileSize, allowedFileTypes } = req.body;

        const settings = await AdminSettings.findOneAndUpdate(
            {},
            {
                'workbookSettings.allowPracticeTests': allowPracticeTests,
                'workbookSettings.maxFileSize': maxFileSize,
                'workbookSettings.allowedFileTypes': allowedFileTypes,
                updatedBy: req.user.id
            },
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            data: settings.workbookSettings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating workbook settings'
        });
    }
}; 
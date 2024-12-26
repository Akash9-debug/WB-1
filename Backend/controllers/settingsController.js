const Settings = require('../models/Settings');

// Get settings
exports.getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({});
        }
        res.status(200).json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching settings'
        });
    }
};

// Update settings
exports.updateSettings = async (req, res) => {
    try {
        console.log('Updating settings with:', req.body); // Debug log

        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings();
        }

        const updateData = {
            ...req.body,
            lastUpdated: Date.now()
        };

        settings = await Settings.findOneAndUpdate(
            {},
            updateData,
            { new: true, upsert: true, runValidators: true }
        );

        console.log('Updated settings:', settings); // Debug log

        res.status(200).json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating settings: ' + error.message
        });
    }
}; 
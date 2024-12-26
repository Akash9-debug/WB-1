const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    maintenanceMode: {
        type: Boolean,
        default: false
    },
    maintenanceMessage: {
        type: String,
        default: 'Site is under maintenance. Please check back later.'
    },
    allowNewRegistrations: {
        type: Boolean,
        default: true
    },
    emailNotifications: {
        type: Boolean,
        default: true
    },
    lowStockThreshold: {
        type: Number,
        default: 10
    },
    orderConfirmationRequired: {
        type: Boolean,
        default: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Settings', settingsSchema); 
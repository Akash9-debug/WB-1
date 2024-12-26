const mongoose = require('mongoose');

const adminSettingsSchema = new mongoose.Schema({
    maintenanceMode: {
        isEnabled: {
            type: Boolean,
            default: false
        },
        message: {
            type: String,
            default: 'Site is under maintenance. Please check back later.'
        }
    },
    inventory: {
        lowStockThreshold: {
            type: Number,
            default: 10
        },
        notifyOnLowStock: {
            type: Boolean,
            default: true
        }
    },
    workbookSettings: {
        allowPracticeTests: {
            type: Boolean,
            default: true
        },
        maxFileSize: {
            type: Number,
            default: 10 // MB
        },
        allowedFileTypes: [{
            type: String,
            default: ['pdf', 'doc', 'docx']
        }]
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('AdminSettings', adminSettingsSchema); 
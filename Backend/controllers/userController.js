const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const { getPasswordResetTemplate } = require('../utils/emailTemplates');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// Password Reset Request
exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        user.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Request',
            html: getPasswordResetTemplate(resetUrl, user.name)
        });

        res.status(200).json({
            success: true,
            message: 'Password reset email sent'
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(500).json({
            success: false,
            message: 'Email could not be sent'
        });
    }
};

// Update Profile
exports.updateProfile = async (req, res) => {
    try {
        const updates = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update allowed fields
        if (updates.name) user.name = updates.name;
        if (updates.phone) user.phone = updates.phone;
        if (updates.address) user.address = updates.address;

        await user.save();

        // Return updated user without sensitive information
        const updatedUser = user.toObject();
        delete updatedUser.password;
        delete updatedUser.resetPasswordToken;
        delete updatedUser.resetPasswordExpire;

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedUser
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile'
        });
    }
};

// Change Password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id).select('+password');

        // Verify current password
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        console.error('Password change error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating password'
        });
    }
};

// Update User Preferences
exports.updatePreferences = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.preferences = {
            ...user.preferences,
            ...req.body
        };
        await user.save();

        res.status(200).json({
            success: true,
            data: user.preferences
        });
    } catch (error) {
        console.error('Preferences update error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating preferences'
        });
    }
};

// Get Profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password -resetPasswordToken -resetPasswordExpire');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile'
        });
    }
}; 
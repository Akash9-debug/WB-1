import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    Switch,
    FormControlLabel,
    Divider,
    Paper,
    Grid
} from '@mui/material';
import { userAPI } from '../services/api';

const UserSettings = () => {
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        orderUpdates: true,
        promotionalEmails: false
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loadingPreferences, setLoadingPreferences] = useState(false);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError("New passwords don't match");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        try {
            setLoading(true);
            const response = await userAPI.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });

            if (response.data.success) {
                setSuccess('Password updated successfully');
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    const handlePreferencesChange = async (name) => {
        try {
            setLoadingPreferences(true);
            const newPreferences = {
                ...preferences,
                [name]: !preferences[name]
            };

            const response = await userAPI.updatePreferences(newPreferences);
            if (response.data.success) {
                setPreferences(newPreferences);
            }
        } catch (error) {
            console.error('Error updating preferences:', error);
            setError('Failed to update preferences');
            setPreferences(preferences);
        } finally {
            setLoadingPreferences(false);
        }
    };

    return (
        <Box>
            <Grid container spacing={3}>
                {/* Password Change Section */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Change Password
                        </Typography>
                        <form onSubmit={handlePasswordChange}>
                            <TextField
                                fullWidth
                                type="password"
                                label="Current Password"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({
                                    ...passwordData,
                                    currentPassword: e.target.value
                                })}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                type="password"
                                label="New Password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({
                                    ...passwordData,
                                    newPassword: e.target.value
                                })}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                type="password"
                                label="Confirm New Password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({
                                    ...passwordData,
                                    confirmPassword: e.target.value
                                })}
                                margin="normal"
                                required
                            />
                            {error && (
                                <Alert severity="error" sx={{ mt: 2 }}>
                                    {error}
                                </Alert>
                            )}
                            {success && (
                                <Alert severity="success" sx={{ mt: 2 }}>
                                    {success}
                                </Alert>
                            )}
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                sx={{ mt: 2 }}
                            >
                                {loading ? 'Updating...' : 'Update Password'}
                            </Button>
                        </form>
                    </Paper>
                </Grid>

                {/* Notification Preferences Section */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Notification Preferences
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={preferences.emailNotifications}
                                        onChange={() => handlePreferencesChange('emailNotifications')}
                                    />
                                }
                                label="Email Notifications"
                            />
                            <Divider sx={{ my: 2 }} />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={preferences.orderUpdates}
                                        onChange={() => handlePreferencesChange('orderUpdates')}
                                    />
                                }
                                label="Order Updates"
                            />
                            <Divider sx={{ my: 2 }} />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={preferences.promotionalEmails}
                                        onChange={() => handlePreferencesChange('promotionalEmails')}
                                    />
                                }
                                label="Promotional Emails"
                            />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default UserSettings; 
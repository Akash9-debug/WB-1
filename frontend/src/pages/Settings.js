import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Paper, 
    Typography, 
    Switch, 
    FormControlLabel, 
    Button, 
    Divider,
    Snackbar,
    Alert
} from '@mui/material';
import { userAPI } from '../services/api';

const Settings = () => {
    const [settings, setSettings] = useState({
        emailNotifications: true,
        promotionalEmails: true
    });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        let intervalId;
        const fetchSettings = async () => {
            try {
                const response = await userAPI.getSettings();
                if (response.data.success) {
                    setSettings(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
            }
        };

        fetchSettings();
        intervalId = setInterval(fetchSettings, 5000);

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, []);

    const handleSettingChange = async (setting, value) => {
        try {
            const response = await userAPI.updateSettings({ [setting]: value });
            if (response.data.success) {
                setSettings(prev => ({ ...prev, [setting]: value }));
                setSnackbar({
                    open: true,
                    message: 'Settings updated successfully',
                    severity: 'success'
                });
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Failed to update settings',
                severity: 'error'
            });
        }
    };

    return (
        <Box>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Notifications</Typography>
                <Box sx={{ mt: 2 }}>
                    <FormControlLabel
                        control={<Switch 
                            checked={settings.emailNotifications}
                            onChange={() => handleSettingChange('emailNotifications')}
                        />}
                        label="Email Notifications"
                    />
                    <FormControlLabel
                        control={<Switch 
                            checked={settings.promotionalEmails}
                            onChange={() => handleSettingChange('promotionalEmails')}
                        />}
                        label="Promotional Emails"
                    />
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>Account</Typography>
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" color="primary" sx={{ mr: 2 }}>
                        Change Password
                    </Button>
                    <Button variant="outlined" color="error">
                        Delete Account
                    </Button>
                </Box>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                >
                    <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
                </Snackbar>
            </Paper>
        </Box>
    );
};

export default Settings; 
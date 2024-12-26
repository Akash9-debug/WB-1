import React, { useState } from 'react';
import { Button, Box, TextField, Typography, Paper } from '@mui/material';
import { adminAPI } from '../../services/api';
import { toast } from 'react-hot-toast';

const AdminSettings = () => {
    const [testEmail, setTestEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleTestEmail = async () => {
        if (!testEmail) {
            toast.error('Please enter an email address');
            return;
        }

        try {
            setLoading(true);
            const response = await adminAPI.testEmail({ 
                email: testEmail
            });
            if (response.data.success) {
                toast.success('Test email sent successfully');
                setTestEmail('');
            }
        } catch (error) {
            toast.error('Failed to send test email');
            console.error('Email test error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h6" gutterBottom>
                Email Service Test
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <TextField
                    fullWidth
                    label="Test Email Address"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="Enter email address"
                    type="email"
                    sx={{ mb: 2 }}
                />
                <Button 
                    variant="contained" 
                    onClick={handleTestEmail}
                    disabled={loading}
                    sx={{ mt: 1 }}
                >
                    {loading ? 'Sending...' : 'Send Test Email'}
                </Button>
            </Box>
        </Paper>
    );
};

export default AdminSettings; 
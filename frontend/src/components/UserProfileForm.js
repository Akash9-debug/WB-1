import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Grid,
    Paper,
    Typography,
    Alert,
    CircularProgress
} from '@mui/material';
import { userAPI } from '../services/api';

const UserProfileForm = () => {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        address: {
            street: '',
            city: '',
            state: '',
            pinCode: '',
            country: 'India'
        }
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [initialLoad, setInitialLoad] = useState(true);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await userAPI.getProfile();
            if (response.data.success) {
                const userData = response.data.data;
                setProfile({
                    name: userData.name || '',
                    email: userData.email || '',
                    phone: userData.phone || '',
                    address: userData.addresses?.[0] || {
                        street: '',
                        city: '',
                        state: '',
                        pinCode: '',
                        country: 'India'
                    }
                });
            }
        } catch (error) {
            setError('Failed to load profile data');
            console.error('Profile fetch error:', error);
        } finally {
            setInitialLoad(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setProfile(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setProfile(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        // Validate phone number
        if (profile.phone && !/^[0-9]{10}$/.test(profile.phone)) {
            setError('Please enter a valid 10-digit phone number');
            setLoading(false);
            return;
        }

        // Validate PIN code
        if (profile.address.pinCode && !/^[0-9]{6}$/.test(profile.address.pinCode)) {
            setError('Please enter a valid 6-digit PIN code');
            setLoading(false);
            return;
        }

        try {
            const response = await userAPI.updateProfile({
                name: profile.name,
                phone: profile.phone,
                address: profile.address
            });

            if (response.data.success) {
                setSuccess('Profile updated successfully');
                // Refresh profile data
                await fetchUserProfile();
            }
        } catch (error) {
            console.error('Profile update error:', error);
            setError(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoad) {
        return (
            <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Personal Information
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={profile.name}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            value={profile.email}
                            disabled
                            helperText="Email cannot be changed"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Phone"
                            name="phone"
                            value={profile.phone}
                            onChange={handleChange}
                            inputProps={{ pattern: "[0-9]{10}" }}
                            helperText="10-digit mobile number"
                        />
                    </Grid>

                    {/* Address Fields */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                            Address
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Street Address"
                            name="address.street"
                            value={profile.address.street}
                            onChange={handleChange}
                            multiline
                            rows={2}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="City"
                            name="address.city"
                            value={profile.address.city}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="State"
                            name="address.state"
                            value={profile.address.state}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="PIN Code"
                            name="address.pinCode"
                            value={profile.address.pinCode}
                            onChange={handleChange}
                            inputProps={{ pattern: "[0-9]{6}" }}
                            helperText="6-digit PIN code"
                        />
                    </Grid>
                </Grid>

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

                <Box sx={{ mt: 3 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update Profile'}
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};

export default UserProfileForm; 
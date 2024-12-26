import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Paper, 
    Typography, 
    Grid, 
    Avatar, 
    Button, 
    CircularProgress 
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { userAPI } from '../services/api';
import { updateUser } from '../redux/slices/authSlice';
import EditProfileModal from '../components/EditProfileModal';
import EditIcon from '@mui/icons-material/Edit';

const Profile = () => {
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();
    const [openEditModal, setOpenEditModal] = useState(false);

    // Add real-time updates
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await userAPI.getProfile();
                if (response.data.success) {
                    dispatch(updateUser(response.data.data));
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        // Initial fetch
        fetchUserProfile();

        // Set up polling every 5 seconds
        const intervalId = setInterval(fetchUserProfile, 5000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, [dispatch]);

    if (!user) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Paper sx={{ p: 3 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                        <Avatar
                            sx={{
                                width: 120,
                                height: 120,
                                margin: '0 auto',
                                bgcolor: 'primary.main',
                                fontSize: '3rem'
                            }}
                        >
                            {user.name.charAt(0)}
                        </Avatar>
                        <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            sx={{ mt: 2 }}
                            onClick={() => setOpenEditModal(true)}
                        >
                            Edit Profile
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Typography variant="h5" gutterBottom>
                            {user.name}
                        </Typography>
                        <Typography color="textSecondary" gutterBottom>
                            {user.email}
                        </Typography>
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Phone
                                </Typography>
                                <Typography>{user.phone || 'Not provided'}</Typography>
                            </Grid>
                            {user.address && (
                                <>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1" color="textSecondary">
                                            Address
                                        </Typography>
                                        <Typography>{user.address.street}</Typography>
                                        <Typography>
                                            {user.address.city}, {user.address.state}
                                        </Typography>
                                        <Typography>{user.address.pinCode}</Typography>
                                    </Grid>
                                </>
                            )}
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Member Since
                                </Typography>
                                <Typography>
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>

            <EditProfileModal
                open={openEditModal}
                onClose={() => setOpenEditModal(false)}
                currentUser={user}
            />
        </Box>
    );
};

export default Profile; 
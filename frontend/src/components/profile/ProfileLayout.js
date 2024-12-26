import React from 'react';
import { Box, Paper, Tabs, Tab, Container, Button } from '@mui/material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ProfileLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleTabChange = (event, newValue) => {
        navigate(newValue);
    };

    const getCurrentTab = () => {
        const path = location.pathname;
        if (path.includes('/orders')) return '/profile/orders';
        if (path.includes('/settings')) return '/profile/settings';
        return '/profile';
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box sx={{ mb: 3 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/')}
                    sx={{ mb: 2 }}
                >
                    Back to Books
                </Button>
            </Box>
            
            <Paper sx={{ mb: 3 }}>
                <Tabs
                    value={getCurrentTab()}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                >
                    <Tab label="Profile" value="/profile" />
                    <Tab label="Orders" value="/profile/orders" />
                    <Tab label="Settings" value="/profile/settings" />
                </Tabs>
            </Paper>
            <Box>
                <Outlet />
            </Box>
        </Container>
    );
};

export default ProfileLayout; 
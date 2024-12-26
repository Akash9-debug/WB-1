import React, { useState, useCallback } from 'react';
import {
    Container,
    Typography,
    Box,
    Tabs,
    Tab
} from '@mui/material';
import AddBookForm from '../components/admin/AddBookForm';
import BooksList from '../components/admin/BooksList';
import OrdersList from '../components/admin/OrdersList';
import { useRealtime } from '../hooks/useRealtime';
import { adminAPI } from '../services/api';

const AdminDashboard = () => {
    const [currentTab, setCurrentTab] = useState(0);
    const [stats, setStats] = useState(null);

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    const fetchStats = useCallback(async () => {
        try {
            const response = await adminAPI.getDashboardStats();
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    }, []);

    // Use real-time updates
    useRealtime(fetchStats);

    return (
        <Container>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', mb: 4 }}>
                Admin Dashboard
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={currentTab} onChange={handleTabChange}>
                    <Tab label="Add Book" />
                    <Tab label="Manage Books" />
                    <Tab label="Orders" />
                </Tabs>
            </Box>

            {currentTab === 0 && <AddBookForm />}
            {currentTab === 1 && <BooksList />}
            {currentTab === 2 && <OrdersList />}
        </Container>
    );
};

export default AdminDashboard; 
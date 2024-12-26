import React, { useState, useEffect } from 'react';
import {
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import {
    TrendingUp,
    People,
    LibraryBooks,
    ShoppingCart,
    Warning
} from '@mui/icons-material';

const DashboardCard = ({ title, value, icon, color }) => (
    <Card>
        <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography color="textSecondary" gutterBottom>
                        {title}
                    </Typography>
                    <Typography variant="h4">
                        {value}
                    </Typography>
                </Box>
                <Box sx={{ 
                    backgroundColor: color,
                    borderRadius: '50%',
                    padding: 1,
                    display: 'flex',
                    color: 'white'
                }}>
                    {icon}
                </Box>
            </Box>
        </CardContent>
    </Card>
);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/dashboard-stats', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setStats(data.data);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
            setError('Failed to load dashboard statistics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!stats) return <Alert severity="info">No data available</Alert>;

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Dashboard Overview
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <DashboardCard
                        title="Total Revenue"
                        value={`₹${stats.revenue?.totalRevenue || 0}`}
                        icon={<TrendingUp />}
                        color="#4caf50"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <DashboardCard
                        title="Total Users"
                        value={stats.totalUsers || 0}
                        icon={<People />}
                        color="#2196f3"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <DashboardCard
                        title="Total Books"
                        value={stats.totalBooks || 0}
                        icon={<LibraryBooks />}
                        color="#ff9800"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <DashboardCard
                        title="New Orders"
                        value={stats.newOrders || 0}
                        icon={<ShoppingCart />}
                        color="#f44336"
                    />
                </Grid>
            </Grid>

            {/* Low Stock Alert Section */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Warning sx={{ color: 'warning.main', mr: 1 }} />
                    Low Stock Alerts
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Book Title</TableCell>
                                <TableCell>Current Stock</TableCell>
                                <TableCell>Alert Level</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stats.lowStockBooks?.map((book) => (
                                <TableRow key={book._id}>
                                    <TableCell>{book.title}</TableCell>
                                    <TableCell>{book.stock}</TableCell>
                                    <TableCell>
                                        <Typography color="error">Low Stock</Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {(!stats.lowStockBooks || stats.lowStockBooks.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">
                                        No low stock alerts
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Recent Orders Section */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Recent Orders
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Order ID</TableCell>
                                <TableCell>Customer</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stats.recentOrders?.map((order) => (
                                <TableRow key={order._id}>
                                    <TableCell>{order._id}</TableCell>
                                    <TableCell>{order.user?.name || 'Unknown'}</TableCell>
                                    <TableCell>₹{order.totalAmount}</TableCell>
                                    <TableCell>{order.status}</TableCell>
                                </TableRow>
                            ))}
                            {(!stats.recentOrders || stats.recentOrders.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        No recent orders
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export default Dashboard; 
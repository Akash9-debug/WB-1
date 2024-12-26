import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    CircularProgress
} from '@mui/material';
import { orderAPI } from '../services/api';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updateTrigger, setUpdateTrigger] = useState(0);

    useEffect(() => {
        let intervalId;
        let isSubscribed = true;

        const fetchOrders = async () => {
            if (!isSubscribed) return;
            
            try {
                const response = await orderAPI.getUserOrders();
                if (response.data.success && isSubscribed) {
                    const newOrders = response.data.data;
                    setOrders(prevOrders => {
                        const hasChanges = JSON.stringify(prevOrders) !== JSON.stringify(newOrders);
                        if (hasChanges) {
                            setUpdateTrigger(prev => prev + 1);
                            return newOrders;
                        }
                        return prevOrders;
                    });
                    setError(null);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
                if (isSubscribed) {
                    setError('Failed to fetch orders');
                }
            } finally {
                if (isSubscribed) {
                    setLoading(false);
                }
            }
        };

        fetchOrders();
        intervalId = setInterval(fetchOrders, 1000);

        return () => {
            isSubscribed = false;
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered':
                return 'success';
            case 'Processing':
                return 'primary';
            case 'Shipped':
                return 'info';
            case 'Cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box key={updateTrigger}>
            <Typography variant="h5" gutterBottom>
                My Orders
            </Typography>

            {orders.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body1" gutterBottom>
                        You haven't placed any orders yet.
                    </Typography>
                    <Button
                        component={Link}
                        to="/"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                    >
                        Start Shopping
                    </Button>
                </Paper>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Order ID</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Items</TableCell>
                                <TableCell align="right">Total</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order._id}>
                                    <TableCell>{order._id}</TableCell>
                                    <TableCell>
                                        {new Date(order.createdAt).toLocaleString('en-IN')}
                                    </TableCell>
                                    <TableCell>
                                        {order.books.map((item, index) => (
                                            <div key={index}>
                                                {item.quantity}x {item.book.title}
                                            </div>
                                        ))}
                                    </TableCell>
                                    <TableCell align="right">₹{order.totalAmount}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={order.status}
                                            color={getStatusColor(order.status)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            component={Link}
                                            to={`/orders/${order._id}`}
                                            size="small"
                                            variant="outlined"
                                        >
                                            View Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default MyOrders; 
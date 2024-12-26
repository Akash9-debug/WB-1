import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Grid,
    Box,
    Chip,
    CircularProgress,
    Alert
} from '@mui/material';
import { orderAPI } from '../services/api';
import { useRealtime } from '../hooks/useRealtime';

const OrderDetails = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrderDetails = useCallback(async () => {
        try {
            const response = await orderAPI.getOrder(orderId);
            if (response.data.success) {
                setOrder(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching order:', error);
            setError(error.response?.data?.message || 'Error fetching order details');
        } finally {
            setLoading(false);
        }
    }, [orderId]);

    // Use real-time updates
    useRealtime(fetchOrderDetails);

    if (loading) {
        return (
            <Container sx={{ mt: 4, textAlign: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (!order) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="info">Order not found</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Order Details
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1">Order ID: {order._id}</Typography>
                            <Typography variant="subtitle1">
                                Status: <Chip 
                                    label={order.status} 
                                    color={
                                        order.status === 'Delivered' ? 'success' :
                                        order.status === 'Processing' ? 'primary' :
                                        'default'
                                    } 
                                />
                            </Typography>
                            <Typography variant="subtitle1">
                                Date: {new Date(order.createdAt).toLocaleString()}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>Items</Typography>
                        {order.books?.map((item, index) => (
                            <Box key={index} sx={{ mb: 2 }}>
                                <Typography>
                                    {item.book?.title} x {item.quantity}
                                </Typography>
                                <Typography color="text.secondary">
                                    ₹{item.price} each
                                </Typography>
                            </Box>
                        ))}
                    </Grid>

                    {order.shippingAddress && (
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>Shipping Address</Typography>
                            <Typography>{order.shippingAddress.street}</Typography>
                            <Typography>
                                {order.shippingAddress.city}, {order.shippingAddress.state}
                            </Typography>
                            <Typography>{order.shippingAddress.pinCode}</Typography>
                            <Typography>Phone: {order.shippingAddress.phone}</Typography>
                        </Grid>
                    )}

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                            <Typography variant="h6">Total Amount:</Typography>
                            <Typography variant="h6">₹{order.totalAmount}</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default OrderDetails; 
import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    TextField,
    Select,
    FormControl,
    InputLabel,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    Visibility as VisibilityIcon
} from '@mui/icons-material';
import { orderAPI } from '../../services/api';

const OrdersTable = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await orderAPI.getAllOrders();
            if (response.data.success) {
                setOrders(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await orderAPI.updateOrderStatus(orderId, newStatus);
            fetchOrders(); // Refresh orders
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const handleMenuClick = (event, order) => {
        setAnchorEl(event.currentTarget);
        setSelectedOrder(order);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleViewDetails = () => {
        setOpenDialog(true);
        handleMenuClose();
    };

    const filteredOrders = orders.filter(order => {
        if (statusFilter !== 'all' && order.status !== statusFilter) return false;
        if (dateFilter === 'today') {
            const today = new Date().toDateString();
            return new Date(order.createdAt).toDateString() === today;
        }
        if (dateFilter === 'week') {
            const lastWeek = new Date();
            lastWeek.setDate(lastWeek.getDate() - 7);
            return new Date(order.createdAt) > lastWeek;
        }
        return true;
    });

    const OrderDetailsDialog = () => (
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
            <DialogTitle>
                Order Details
                <Typography variant="subtitle2" color="text.secondary">
                    Order ID: {selectedOrder?._id}
                </Typography>
            </DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={3}>
                    {/* Customer Information */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>Customer Details</Typography>
                        <Typography>Name: {selectedOrder?.user?.name}</Typography>
                        <Typography>Email: {selectedOrder?.user?.email}</Typography>
                        <Typography>Phone: {selectedOrder?.user?.phone}</Typography>
                    </Grid>

                    {/* Shipping Information */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>Shipping Address</Typography>
                        <Typography>{selectedOrder?.shippingAddress?.street}</Typography>
                        <Typography>
                            {selectedOrder?.shippingAddress?.city}, {selectedOrder?.shippingAddress?.state}
                        </Typography>
                        <Typography>PIN: {selectedOrder?.shippingAddress?.pinCode}</Typography>
                    </Grid>

                    {/* Order Items */}
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>Order Items</Typography>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Item</TableCell>
                                        <TableCell align="right">Quantity</TableCell>
                                        <TableCell align="right">Price</TableCell>
                                        <TableCell align="right">Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectedOrder?.books.map((item) => (
                                        <TableRow key={item.book._id}>
                                            <TableCell>{item.book.title}</TableCell>
                                            <TableCell align="right">{item.quantity}</TableCell>
                                            <TableCell align="right">₹{item.price}</TableCell>
                                            <TableCell align="right">
                                                ₹{item.quantity * item.price}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell colSpan={3} align="right">
                                            <strong>Total Amount:</strong>
                                        </TableCell>
                                        <TableCell align="right">
                                            <strong>₹{selectedOrder?.totalAmount}</strong>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>

                    {/* Payment Information */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>Payment Details</Typography>
                        <Typography>Method: {selectedOrder?.paymentMethod}</Typography>
                        <Typography>Status: {selectedOrder?.paymentStatus}</Typography>
                        <Typography>Transaction ID: {selectedOrder?.transactionId || 'N/A'}</Typography>
                    </Grid>

                    {/* Order Status */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>Order Status</Typography>
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={selectedOrder?.status}
                                onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                            >
                                <MenuItem value="Pending">Pending</MenuItem>
                                <MenuItem value="Processing">Processing</MenuItem>
                                <MenuItem value="Shipped">Shipped</MenuItem>
                                <MenuItem value="Delivered">Delivered</MenuItem>
                                <MenuItem value="Cancelled">Cancelled</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpenDialog(false)}>Close</Button>
            </DialogActions>
        </Dialog>
    );

    return (
        <Box>
            {/* Filters */}
            <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        label="Status"
                    >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Processing">Processing</MenuItem>
                        <MenuItem value="Shipped">Shipped</MenuItem>
                        <MenuItem value="Delivered">Delivered</MenuItem>
                        <MenuItem value="Cancelled">Cancelled</MenuItem>
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Date</InputLabel>
                    <Select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        label="Date"
                    >
                        <MenuItem value="all">All Time</MenuItem>
                        <MenuItem value="today">Today</MenuItem>
                        <MenuItem value="week">This Week</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Items</TableCell>
                            <TableCell align="right">Total</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredOrders.map((order) => (
                            <TableRow key={order._id}>
                                <TableCell>{order._id}</TableCell>
                                <TableCell>
                                    {new Date(order.createdAt).toLocaleString('en-IN', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </TableCell>
                                <TableCell>{order.user.name}</TableCell>
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
                                        color={
                                            order.status === 'Delivered' ? 'success' :
                                            order.status === 'Processing' ? 'primary' :
                                            order.status === 'Cancelled' ? 'error' :
                                            'default'
                                        }
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={(e) => handleMenuClick(e, order)}>
                                        <MoreVertIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleViewDetails}>
                    <VisibilityIcon sx={{ mr: 1 }} /> View Details
                </MenuItem>
            </Menu>

            {selectedOrder && <OrderDetailsDialog />}
        </Box>
    );
};

export default OrdersTable; 
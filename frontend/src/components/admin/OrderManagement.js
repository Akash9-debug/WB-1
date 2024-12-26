import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    FormControl,
    Select,
    InputLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    TextField,
    Snackbar,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    Visibility as VisibilityIcon,
    Edit as EditIcon
} from '@mui/icons-material';
import { adminAPI } from '../../services/api';
import { useRealtime } from '../../hooks/useRealtime';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateRange, setDateRange] = useState({
        start: '',
        end: ''
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [orderStats, setOrderStats] = useState({
        total: 0,
        pending: 0,
        processing: 0,
        delivered: 0,
        cancelled: 0
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const fetchOrders = useCallback(async () => {
        try {
            const response = await adminAPI.getAllOrders();
            if (response.data.success) {
                setOrders(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    }, []);

    // Use real-time updates
    useRealtime(fetchOrders);

    useEffect(() => {
        fetchOrderStats();
    }, [statusFilter]);

    const fetchOrderStats = async () => {
        try {
            const response = await adminAPI.getOrderStats();
            if (response.data.success) {
                setOrderStats(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching order statistics:', error);
            setSnackbar({
                open: true,
                message: `Failed to fetch order statistics: ${error.response?.data?.message || error.message}`,
                severity: 'error'
            });
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

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            setLoading(true);
            const response = await adminAPI.updateOrderStatus(orderId, newStatus);
            
            if (response.data.success) {
                setOrders(prevOrders => 
                    prevOrders.map(order => 
                        order._id === orderId 
                            ? { ...order, status: newStatus }
                            : order
                    )
                );

                setSnackbar({
                    open: true,
                    message: `Order status updated to ${newStatus}`,
                    severity: 'success'
                });

                fetchOrderStats();
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Failed to update order status',
                severity: 'error'
            });
        } finally {
            setLoading(false);
            handleMenuClose();
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedOrder(null);
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered':
                return 'success';
            case 'Processing':
                return 'primary';
            case 'Cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Orders Management
            </Typography>

            {/* Order Statistics Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={2.4}>
                    <Paper sx={{ p: 2, bgcolor: 'primary.light' }}>
                        <Typography variant="h6">Total Orders</Typography>
                        <Typography variant="h4">{orderStats.total}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <Paper sx={{ p: 2, bgcolor: 'warning.light' }}>
                        <Typography variant="h6">Pending</Typography>
                        <Typography variant="h4">{orderStats.pending}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <Paper sx={{ p: 2, bgcolor: 'info.light' }}>
                        <Typography variant="h6">Processing</Typography>
                        <Typography variant="h4">{orderStats.processing}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <Paper sx={{ p: 2, bgcolor: 'success.light' }}>
                        <Typography variant="h6">Delivered</Typography>
                        <Typography variant="h4">{orderStats.delivered}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <Paper sx={{ p: 2, bgcolor: 'error.light' }}>
                        <Typography variant="h6">Cancelled</Typography>
                        <Typography variant="h4">{orderStats.cancelled}</Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Advanced Filters */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={3}>
                    <TextField
                        fullWidth
                        label="Search Order ID/Customer"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={statusFilter}
                            label="Status"
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <MenuItem value="all">All Status</MenuItem>
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="Processing">Processing</MenuItem>
                            <MenuItem value="Shipped">Shipped</MenuItem>
                            <MenuItem value="Delivered">Delivered</MenuItem>
                            <MenuItem value="Cancelled">Cancelled</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                    <TextField
                        type="date"
                        label="From Date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <TextField
                        type="date"
                        label="To Date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                    />
                </Grid>
            </Grid>

            {/* Orders Table */}
            <TableContainer component={Paper}>
                {loading ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <CircularProgress />
                    </Box>
                ) : orders.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography>No orders found</Typography>
                    </Box>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Order ID</TableCell>
                                <TableCell>Customer</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Items</TableCell>
                                <TableCell align="right">Total</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders
                                .filter(order => statusFilter === 'all' || order.status === statusFilter)
                                .map((order) => (
                                    <TableRow key={order._id}>
                                        <TableCell>{order._id}</TableCell>
                                        <TableCell>{order.user.name}</TableCell>
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
                                            <IconButton onClick={(e) => handleMenuClick(e, order)}>
                                                <MoreVertIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            {/* Action Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleViewDetails}>
                    <VisibilityIcon sx={{ mr: 1 }} /> View Details
                </MenuItem>
                {selectedOrder && selectedOrder.status !== 'Processing' && (
                    <MenuItem onClick={() => handleStatusChange(selectedOrder._id, 'Processing')}>
                        Mark as Processing
                    </MenuItem>
                )}
                {selectedOrder && selectedOrder.status !== 'Shipped' && (
                    <MenuItem onClick={() => handleStatusChange(selectedOrder._id, 'Shipped')}>
                        Mark as Shipped
                    </MenuItem>
                )}
                {selectedOrder && selectedOrder.status !== 'Delivered' && (
                    <MenuItem onClick={() => handleStatusChange(selectedOrder._id, 'Delivered')}>
                        Mark as Delivered
                    </MenuItem>
                )}
                {selectedOrder && selectedOrder.status !== 'Cancelled' && (
                    <MenuItem onClick={() => handleStatusChange(selectedOrder._id, 'Cancelled')}
                             sx={{ color: 'error.main' }}>
                        Cancel Order
                    </MenuItem>
                )}
            </Menu>

            {/* Status update notification */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* Order Details Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>Order Details</DialogTitle>
                <DialogContent>
                    {selectedOrder && (
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6">Customer Information</Typography>
                                <Typography>Name: {selectedOrder.user.name}</Typography>
                                <Typography>Email: {selectedOrder.user.email}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6">Order Information</Typography>
                                <Typography>Order ID: {selectedOrder._id}</Typography>
                                <Typography>Status: {selectedOrder.status}</Typography>
                                <Typography>Total: ₹{selectedOrder.totalAmount}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6">Items</Typography>
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Book</TableCell>
                                                <TableCell>Quantity</TableCell>
                                                <TableCell>Price</TableCell>
                                                <TableCell>Total</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {selectedOrder.books.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{item.book.title}</TableCell>
                                                    <TableCell>{item.quantity}</TableCell>
                                                    <TableCell>₹{item.price}</TableCell>
                                                    <TableCell>₹{item.quantity * item.price}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default OrderManagement; 
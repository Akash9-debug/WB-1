import React, { useCallback } from 'react';
import {
    Container,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Box,
    IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, initializeCart } from '../redux/slices/cartSlice';
import { cartAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRealtime } from '../hooks/useRealtime';

const Cart = () => {
    const { items, total } = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fetchCart = useCallback(async () => {
        try {
            const response = await cartAPI.getCart();
            if (response.data.success) {
                dispatch(initializeCart(response.data.data));
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    }, [dispatch]);

    // Use real-time updates
    useRealtime(fetchCart);

    const handleRemoveItem = async (itemId) => {
        try {
            console.log('Removing item with ID:', itemId);
            const response = await cartAPI.removeFromCart(itemId);
            
            if (response.data.success) {
                dispatch(initializeCart(response.data.data));
                toast.success('Item removed from cart');
            } else {
                toast.error(response.data.message || 'Failed to remove item');
            }
        } catch (error) {
            console.error('Error removing item:', error);
            toast.error(error.response?.data?.message || 'Failed to remove item');
        }
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    if (items.length === 0) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h5" gutterBottom>
                        Your cart is empty
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/')}
                        sx={{ mt: 2 }}
                    >
                        Continue Shopping
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/')}
                    sx={{ mr: 2 }}
                >
                    Back to Books
                </Button>
                <Typography variant="h5">Shopping Cart</Typography>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Book</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Total</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell>{item.title}</TableCell>
                                <TableCell align="right">₹{item.price}</TableCell>
                                <TableCell align="right">{item.quantity}</TableCell>
                                <TableCell align="right">
                                    ₹{(item.price * item.quantity).toFixed(2)}
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        onClick={() => handleRemoveItem(item._id)}
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell colSpan={3}>
                                <Typography variant="h6">Total</Typography>
                            </TableCell>
                            <TableCell align="right" colSpan={2}>
                                <Typography variant="h6">₹{total.toFixed(2)}</Typography>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                    variant="outlined"
                    onClick={() => navigate('/')}
                >
                    Continue Shopping
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCheckout}
                    disabled={items.length === 0}
                >
                    Proceed to Checkout
                </Button>
            </Box>
        </Container>
    );
};

export default Cart; 
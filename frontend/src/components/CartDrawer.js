import React, { useEffect } from 'react';
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Button,
    Divider,
    TextField
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateQuantity, initializeCart } from '../redux/slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { cartAPI } from '../services/api';

const CartDrawer = ({ open, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, total } = useSelector(state => state.cart);
    const { isAuthenticated } = useSelector(state => state.auth);

    useEffect(() => {
        const refreshCart = async () => {
            if (isAuthenticated && open) {
                try {
                    const response = await cartAPI.getCart();
                    console.log('Refreshing cart data:', response.data);
                    if (response.data.success) {
                        dispatch(initializeCart(response.data.data));
                    }
                } catch (error) {
                    console.error('Error refreshing cart:', error);
                }
            }
        };

        refreshCart();
    }, [isAuthenticated, open, dispatch]);

    const handleRemoveItem = async (itemId) => {
        try {
            if (!isAuthenticated) {
                navigate('/login');
                return;
            }

            await cartAPI.removeFromCart(itemId);
            dispatch(removeFromCart(itemId));
        } catch (error) {
            console.error('Error removing item:', error);
            alert('Failed to remove item from cart');
        }
    };

    const handleQuantityChange = async (itemId, newQuantity, maxStock) => {
        try {
            if (newQuantity < 1) return;
            if (newQuantity > maxStock) {
                alert(`Sorry, only ${maxStock} items available in stock`);
                return;
            }
            
            await cartAPI.updateCartItem({
                itemId,
                quantity: newQuantity
            });
            
            dispatch(updateQuantity({ _id: itemId, quantity: newQuantity }));
        } catch (error) {
            console.error('Error updating quantity:', error);
            alert('Failed to update quantity');
        }
    };

    const handleCheckout = () => {
        onClose();
        navigate('/checkout');
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{ sx: { width: { xs: '100%', sm: 400 } } }}
        >
            <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom>
                    Shopping Cart
                </Typography>
                
                {items.length > 0 ? (
                    <>
                        <List sx={{ flexGrow: 1, overflow: 'auto' }}>
                            {items.map((item) => (
                                <ListItem key={item._id} divider>
                                    <Box sx={{ width: '100%' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="subtitle1">
                                                {item.title}
                                            </Typography>
                                            <IconButton 
                                                size="small" 
                                                onClick={() => handleRemoveItem(item._id)}
                                            >
                                                <DeleteOutlineIcon />
                                            </IconButton>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <TextField
                                                type="number"
                                                size="small"
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value), item.stock)}
                                                InputProps={{ 
                                                    inputProps: { 
                                                        min: 1,
                                                        max: item.stock 
                                                    } 
                                                }}
                                                sx={{ width: 80 }}
                                            />
                                            <Typography>
                                                ₹{item.price * item.quantity}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </ListItem>
                            ))}
                        </List>
                        <Box sx={{ pt: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Total: ₹{total}
                            </Typography>
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={handleCheckout}
                            >
                                Proceed to Checkout
                            </Button>
                        </Box>
                    </>
                ) : (
                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                        <Typography color="text.secondary">
                            Your cart is empty
                        </Typography>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                onClose();
                                navigate('/');
                            }}
                            sx={{ mt: 2 }}
                        >
                            Continue Shopping
                        </Button>
                    </Box>
                )}
            </Box>
        </Drawer>
    );
};

export default CartDrawer; 
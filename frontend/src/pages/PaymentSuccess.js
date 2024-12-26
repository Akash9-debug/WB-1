import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../redux/slices/cartSlice';
import {
    Container,
    Paper,
    Typography,
    Button,
    Box,
    CircularProgress,
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import api from '../services/api';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(true);
    const [openSnackbar, setOpenSnackbar] = useState(true);

    useEffect(() => {
        const completePayment = async () => {
            try {
                const searchParams = new URLSearchParams(location.search);
                const transactionId = searchParams.get('transactionId');

                if (transactionId) {
                    await api.post('/payments/complete', { transactionId });
                }
                
                dispatch(clearCart());
                setLoading(false);
                setOpenSnackbar(true);
                setOpenDialog(true);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        completePayment();
    }, [dispatch, location]);

    const handleClose = () => {
        setOpenDialog(false);
        navigate('/orders');
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    if (loading) {
        return (
            <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="sm">
                <Paper sx={{ p: 4, mt: 4, textAlign: 'center' }}>
                    <Typography color="error" gutterBottom>
                        {error}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/checkout')}
                    >
                        Try Again
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <>
            <Container maxWidth="sm">
                <Paper sx={{ p: 4, mt: 4, textAlign: 'center' }}>
                    <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
                    <Typography variant="h5" gutterBottom>
                        Payment Successful!
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        Your order has been placed successfully.
                    </Typography>
                    <Box sx={{ mt: 3 }}>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/orders')}
                            sx={{ mr: 2 }}
                        >
                            View Orders
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/')}
                        >
                            Continue Shopping
                        </Button>
                    </Box>
                </Paper>
            </Container>

            <Dialog
                open={openDialog}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ textAlign: 'center', bgcolor: 'success.light', color: 'white' }}>
                    Order Successful!
                </DialogTitle>
                <DialogContent sx={{ textAlign: 'center', py: 4 }}>
                    <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                        Thank you for your purchase!
                    </Typography>
                    <Typography color="text.secondary">
                        Your order has been successfully placed and will be processed soon.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
                    <Button 
                        variant="contained" 
                        onClick={handleClose}
                        color="success"
                    >
                        View My Orders
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleSnackbarClose} 
                    severity="success" 
                    variant="filled"
                    sx={{ width: '100%', fontSize: '1.1rem' }}
                >
                    Order placed successfully! Thank you for your purchase.
                </Alert>
            </Snackbar>
        </>
    );
};

export default PaymentSuccess; 
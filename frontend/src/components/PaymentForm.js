import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Grid
} from '@mui/material';

const PaymentForm = ({ amount, shippingAddress, onSuccess, onError }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });

    const handleChange = (e) => {
        setCardDetails({
            ...cardDetails,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            onSuccess({
                paymentId: 'SIMULATED_' + Date.now(),
                shippingAddress
            });
        } catch (err) {
            setError(err.message);
            onError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>
                Payment Details
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Card Number"
                        name="cardNumber"
                        value={cardDetails.cardNumber}
                        onChange={handleChange}
                        required
                        inputProps={{ maxLength: 16 }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Expiry Date"
                        name="expiryDate"
                        value={cardDetails.expiryDate}
                        onChange={handleChange}
                        required
                        placeholder="MM/YY"
                        inputProps={{ maxLength: 5 }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="CVV"
                        name="cvv"
                        value={cardDetails.cvv}
                        onChange={handleChange}
                        required
                        type="password"
                        inputProps={{ maxLength: 3 }}
                    />
                </Grid>
            </Grid>

            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}

            <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{ mt: 3 }}
            >
                {loading ? (
                    <CircularProgress size={24} />
                ) : (
                    `Pay ₹${amount}`
                )}
            </Button>
        </Box>
    );
};

export default PaymentForm; 
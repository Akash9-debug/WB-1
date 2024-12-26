import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box
} from '@mui/material';

const PaymentConfirmationModal = ({ open, onClose, onConfirm, amount, paymentMethod }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirm Payment</DialogTitle>
            <DialogContent>
                <Typography variant="body1" gutterBottom>
                    Total Amount: ₹{amount}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Payment Method: {paymentMethod === 'phonepe' ? 'PhonePe' : 'Cash on Delivery'}
                </Typography>
                {paymentMethod === 'phonepe' && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            You will be redirected to PhonePe to complete the payment.
                        </Typography>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onConfirm} variant="contained" color="primary">
                    {paymentMethod === 'phonepe' ? 'Proceed to Pay' : 'Place Order'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PaymentConfirmationModal; 
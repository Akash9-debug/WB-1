import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Button,
    Box
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { motion } from 'framer-motion';

const PaymentFailure = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { error } = location.state || {};

    return (
        <Container maxWidth="sm">
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Paper sx={{ p: 4, mt: 8, textAlign: 'center' }}>
                    <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
                    <Typography variant="h4" gutterBottom>
                        Payment Failed
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        {error || 'There was an error processing your payment.'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        Please try again or contact support if the problem persists.
                    </Typography>
                    <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/checkout')}
                        >
                            Try Again
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/')}
                        >
                            Return to Home
                        </Button>
                    </Box>
                </Paper>
            </motion.div>
        </Container>
    );
};

export default PaymentFailure; 
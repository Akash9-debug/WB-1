import React from 'react';
import { Box, Typography, Button } from '@mui/material';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Payment error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h5" color="error" gutterBottom>
                        Something went wrong with the payment
                    </Typography>
                    <Typography color="text.secondary" paragraph>
                        {this.state.error.message}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </Button>
                </Box>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary; 
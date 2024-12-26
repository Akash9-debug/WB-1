import React from 'react';
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Typography,
    Paper,
    Chip,
    Grid,
    Link
} from '@mui/material';
import {
    LocalShipping,
    Payment,
    Inventory,
    CheckCircle,
    Cancel
} from '@mui/icons-material';

const statusSteps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
const statusIcons = {
    pending: <Payment />,
    confirmed: <CheckCircle />,
    processing: <Inventory />,
    shipped: <LocalShipping />,
    delivered: <CheckCircle />,
    cancelled: <Cancel />
};

const statusColors = {
    pending: 'warning',
    confirmed: 'info',
    processing: 'info',
    shipped: 'primary',
    delivered: 'success',
    cancelled: 'error'
};

const OrderTracking = ({ tracking }) => {
    const activeStep = statusSteps.indexOf(tracking.currentStatus);

    return (
        <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
                Order Status
            </Typography>
            
            <Chip
                label={tracking.currentStatus.toUpperCase()}
                color={statusColors[tracking.currentStatus]}
                icon={statusIcons[tracking.currentStatus]}
                sx={{ mb: 3 }}
            />

            <Stepper activeStep={activeStep} alternativeLabel>
                {statusSteps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label.toUpperCase()}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {tracking.trackingNumber && (
                <Box sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Tracking Number
                            </Typography>
                            <Typography variant="body1">
                                {tracking.trackingNumber}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Courier
                            </Typography>
                            <Typography variant="body1">
                                {tracking.courier.name}
                            </Typography>
                            {tracking.courier.trackingUrl && (
                                <Link 
                                    href={tracking.courier.trackingUrl} 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Track Package
                                </Link>
                            )}
                        </Grid>
                    </Grid>
                </Box>
            )}

            <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Order Timeline
                </Typography>
                <Box sx={{ ml: 2 }}>
                    {tracking.history.map((event, index) => (
                        <Box
                            key={index}
                            sx={{
                                position: 'relative',
                                pb: 2,
                                '&:before': {
                                    content: '""',
                                    position: 'absolute',
                                    left: '-16px',
                                    top: 0,
                                    bottom: 0,
                                    width: 2,
                                    bgcolor: 'primary.light',
                                    display: index === tracking.history.length - 1 ? 'none' : 'block'
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Box
                                    sx={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: '50%',
                                        bgcolor: 'primary.main',
                                        position: 'absolute',
                                        left: '-20px'
                                    }}
                                />
                                <Typography variant="subtitle2" color="text.secondary">
                                    {new Date(event.timestamp).toLocaleString()}
                                </Typography>
                            </Box>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {event.status.toUpperCase()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {event.description}
                            </Typography>
                            {event.location && (
                                <Typography variant="body2" color="text.secondary">
                                    Location: {event.location}
                                </Typography>
                            )}
                        </Box>
                    ))}
                </Box>
            </Box>
        </Paper>
    );
};

export default OrderTracking; 
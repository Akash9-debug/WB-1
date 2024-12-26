import React from 'react';
import {
    Box,
    Typography
} from '@mui/material';
import OrdersTable from './OrdersTable';

const OrdersList = () => {
    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Orders Management
            </Typography>
            <OrdersTable />
        </Box>
    );
};

export default OrdersList; 
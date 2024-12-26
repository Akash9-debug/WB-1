import React, { useState, useEffect } from 'react';
import {
    Grid,
    Paper,
    Typography,
    Box,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';

const Reports = () => {
    const [timeRange, setTimeRange] = useState('week');
    const [reports, setReports] = useState(null);

    useEffect(() => {
        fetchReports();
    }, [timeRange]);

    const fetchReports = async () => {
        try {
            const response = await fetch(`/api/admin/reports?range=${timeRange}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setReports(data.data);
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };

    return (
        <div>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5">
                    Reports & Analytics
                </Typography>
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Time Range</InputLabel>
                    <Select
                        value={timeRange}
                        label="Time Range"
                        onChange={(e) => setTimeRange(e.target.value)}
                    >
                        <MenuItem value="week">Last Week</MenuItem>
                        <MenuItem value="month">Last Month</MenuItem>
                        <MenuItem value="year">Last Year</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Grid container spacing={3}>
                {/* Add your report components here */}
            </Grid>
        </div>
    );
};

export default Reports; 
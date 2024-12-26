import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    MenuItem
} from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { adminAPI } from '../../services/api';

const ReportsManagement = () => {
    const [salesData, setSalesData] = useState([]);
    const [inventoryData, setInventoryData] = useState([]);
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });
    const [reportType, setReportType] = useState('sales');

    useEffect(() => {
        fetchReports();
    }, [dateRange, reportType]);

    const fetchReports = async () => {
        try {
            if (reportType === 'sales') {
                const response = await adminAPI.getSalesReport({
                    startDate: dateRange.startDate,
                    endDate: dateRange.endDate
                });
                if (response.data.success) {
                    setSalesData(response.data.data);
                }
            } else {
                const response = await adminAPI.getInventoryReport();
                if (response.data.success) {
                    setInventoryData(response.data.data);
                }
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };

    const handleDateChange = (field, value) => {
        setDateRange(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const downloadReport = () => {
        const data = reportType === 'sales' ? salesData : inventoryData;
        const csvContent = "data:text/csv;charset=utf-8," 
            + data.map(row => Object.values(row).join(",")).join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${reportType}_report.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Reports Management
            </Typography>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <TextField
                            select
                            fullWidth
                            label="Report Type"
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                        >
                            <MenuItem value="sales">Sales Report</MenuItem>
                            <MenuItem value="inventory">Inventory Report</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            type="date"
                            label="Start Date"
                            value={dateRange.startDate}
                            onChange={(e) => handleDateChange('startDate', e.target.value)}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            type="date"
                            label="End Date"
                            value={dateRange.endDate}
                            onChange={(e) => handleDateChange('endDate', e.target.value)}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Button
                            variant="contained"
                            onClick={downloadReport}
                            fullWidth
                        >
                            Download Report
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Charts Section */}
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            {reportType === 'sales' ? 'Sales Overview' : 'Inventory Overview'}
                        </Typography>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart
                                data={reportType === 'sales' ? salesData : inventoryData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>

            {/* Data Table */}
            <Paper sx={{ mt: 3, p: 3 }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {reportType === 'sales' ? (
                                    <>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Orders</TableCell>
                                        <TableCell align="right">Revenue</TableCell>
                                    </>
                                ) : (
                                    <>
                                        <TableCell>Book</TableCell>
                                        <TableCell align="right">Stock</TableCell>
                                        <TableCell align="right">Value</TableCell>
                                    </>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(reportType === 'sales' ? salesData : inventoryData).map((row, index) => (
                                <TableRow key={index}>
                                    {reportType === 'sales' ? (
                                        <>
                                            <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                                            <TableCell>{row.orders}</TableCell>
                                            <TableCell align="right">₹{row.revenue}</TableCell>
                                        </>
                                    ) : (
                                        <>
                                            <TableCell>{row.title}</TableCell>
                                            <TableCell align="right">{row.stock}</TableCell>
                                            <TableCell align="right">₹{row.value}</TableCell>
                                        </>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default ReportsManagement; 
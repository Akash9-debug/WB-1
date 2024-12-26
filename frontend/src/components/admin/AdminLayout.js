import React from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Paper, Divider } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Dashboard as DashboardIcon,
    ShoppingCart as OrdersIcon,
    People as UsersIcon,
    Inventory as InventoryIcon,
    Assessment as ReportsIcon,
    Settings as SettingsIcon,
    Store as StoreIcon
} from '@mui/icons-material';

const DRAWER_WIDTH = 280;

const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
    { text: 'Orders', icon: <OrdersIcon />, path: '/admin/orders' },
    { text: 'Users', icon: <UsersIcon />, path: '/admin/users' },
    { text: 'Inventory', icon: <InventoryIcon />, path: '/admin/inventory' },
    { text: 'Reports', icon: <ReportsIcon />, path: '/admin/reports' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' }
];

const AdminLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8f9fa' }}>
            <Drawer
                variant="permanent"
                sx={{
                    width: DRAWER_WIDTH,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        boxSizing: 'border-box',
                        bgcolor: '#1a237e', // Dark blue background
                        color: 'white',
                        borderRight: 'none'
                    },
                }}
            >
                {/* Store Logo/Name Section */}
                <Box sx={{ 
                    p: 3, 
                    display: 'flex', 
                    alignItems: 'center',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    mt: 8
                }}>
                    <StoreIcon sx={{ fontSize: 30, mr: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        University Bookstore
                    </Typography>
                </Box>

                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />

                {/* Menu Items */}
                <Box sx={{ 
                    overflow: 'auto',
                    px: 2,
                    py: 3
                }}>
                    <List>
                        {menuItems.map((item) => (
                            <ListItem
                                button
                                key={item.text}
                                onClick={() => navigate(item.path)}
                                sx={{
                                    mb: 1,
                                    borderRadius: 2,
                                    bgcolor: location.pathname === item.path 
                                        ? 'rgba(255, 255, 255, 0.1)' 
                                        : 'transparent',
                                    color: location.pathname === item.path 
                                        ? '#fff' 
                                        : 'rgba(255, 255, 255, 0.7)',
                                    '&:hover': {
                                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                                        color: '#fff',
                                        '& .MuiListItemIcon-root': {
                                            color: '#fff'
                                        }
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <ListItemIcon 
                                    sx={{ 
                                        color: location.pathname === item.path 
                                            ? '#fff' 
                                            : 'rgba(255, 255, 255, 0.7)',
                                        minWidth: 40
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText 
                                    primary={
                                        <Typography
                                            sx={{
                                                fontWeight: location.pathname === item.path ? 600 : 400,
                                                fontSize: '0.95rem'
                                            }}
                                        >
                                            {item.text}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>

                {/* Admin Info Section */}
                <Box sx={{ 
                    mt: 'auto', 
                    p: 2, 
                    bgcolor: 'rgba(0, 0, 0, 0.2)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.12)'
                }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Admin Panel
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                        Version 1.0
                    </Typography>
                </Box>
            </Drawer>

            {/* Main Content */}
            <Box 
                component="main" 
                sx={{ 
                    flexGrow: 1, 
                    p: 3, 
                    mt: 8,
                    mx: 3,
                    borderRadius: 2,
                    bgcolor: '#ffffff',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.05)',
                    minHeight: 'calc(100vh - 100px)'
                }}
            >
                <Paper 
                    elevation={0}
                    sx={{ 
                        p: 3,
                        borderRadius: 2,
                        bgcolor: 'transparent'
                    }}
                >
                    {children}
                </Paper>
            </Box>
        </Box>
    );
};

export default AdminLayout; 
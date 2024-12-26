import React, { useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Badge } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import { initializeCart } from '../redux/slices/cartSlice';
import { cartAPI } from '../services/api';

const Navbar = () => {
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const cart = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    useEffect(() => {
        const fetchCart = async () => {
            if (isAuthenticated) {
                try {
                    const response = await cartAPI.getCart();
                    if (response.data.success) {
                        dispatch(initializeCart(response.data.data));
                    }
                } catch (error) {
                    console.error('Error fetching cart:', error);
                }
            }
        };

        fetchCart();
    }, [isAuthenticated, dispatch]);

    return (
        <AppBar position="sticky">
            <Toolbar>
                <Typography
                    variant="h6"
                    component={Link}
                    to="/"
                    sx={{
                        textDecoration: 'none',
                        color: 'inherit',
                        flexGrow: 1
                    }}
                >
                    University Bookstore
                </Typography>

                <Box>
                    {isAuthenticated ? (
                        <>
                            {user && user.role === 'admin' ? (
                                <Button
                                    color="inherit"
                                    startIcon={<DashboardIcon />}
                                    component={Link}
                                    to="/admin"
                                    sx={{ mr: 1 }}
                                >
                                    Dashboard
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        color="inherit"
                                        startIcon={<HomeIcon />}
                                        component={Link}
                                        to="/"
                                        sx={{ mr: 1 }}
                                    >
                                        Home
                                    </Button>
                                    <IconButton
                                        color="inherit"
                                        onClick={() => navigate('/cart')}
                                        sx={{ mr: 1 }}
                                    >
                                        <Badge badgeContent={cart.items.length} color="secondary">
                                            <ShoppingCartIcon />
                                        </Badge>
                                    </IconButton>
                                </>
                            )}
                            <Button
                                color="inherit"
                                startIcon={<PersonIcon />}
                                component={Link}
                                to="/profile"
                                sx={{ mr: 1 }}
                            >
                                Profile
                            </Button>
                            <Button
                                color="inherit"
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Box>
                            <Button
                                color="inherit"
                                component={Link}
                                to="/login"
                                sx={{ mr: 1 }}
                            >
                                Login
                            </Button>
                            <Button
                                color="inherit"
                                component={Link}
                                to="/register"
                            >
                                Register
                            </Button>
                        </Box>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar; 
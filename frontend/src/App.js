import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { store } from './redux/store';
import { theme } from './theme';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import { CssBaseline, Container, Box } from '@mui/material';
import AdminLayout from './components/admin/AdminLayout';
import AdminHome from './pages/AdminHome';
import OrderManagement from './components/admin/OrderManagement';
import UserManagement from './components/admin/UserManagement';
import InventoryManagement from './components/admin/InventoryManagement';
import ReportsManagement from './components/admin/ReportsManagement';
import AdminSettings from './components/admin/AdminSettings';
import Checkout from './pages/Checkout';
import OrderDetails from './pages/OrderDetails';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
import ProfileLayout from './components/profile/ProfileLayout';
import Profile from './pages/Profile';
import MyOrders from './pages/MyOrders';
import Settings from './pages/Settings';
import { Toaster } from 'react-hot-toast';
import Cart from './pages/Cart';
import { initializeCart } from './redux/slices/cartSlice';
import { cartAPI } from './services/api';
import { authAPI } from './services/api';
import { loginSuccess, logout } from './redux/slices/authSlice';
import AdminRegister from './pages/AdminRegister';

// Create a separate component for the app content
const AppContent = () => {
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        const initCart = async () => {
            if (isAuthenticated) {
                try {
                    const response = await cartAPI.getCart();
                    if (response.data.success) {
                        dispatch(initializeCart(response.data.data));
                    }
                } catch (error) {
                    console.error('Error initializing cart:', error);
                }
            }
        };

        initCart();
    }, [isAuthenticated, dispatch]);

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await authAPI.verifyToken();
                    if (response.data.success) {
                        dispatch(loginSuccess({
                            user: response.data.user,
                            token
                        }));
                    } else {
                        dispatch(logout());
                    }
                }
            } catch (error) {
                dispatch(logout());
            }
        };

        verifyAuth();
    }, [dispatch]);

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(45deg, #f3f4f8 0%, #ffffff 100%)'
        }}>
            <Navbar />
            <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
                <Routes>
                    <Route path="/login" element={
                        isAuthenticated ? 
                            <Navigate to={user?.role === 'admin' ? '/admin' : '/'} replace /> 
                            : <Login />
                    } />
                    <Route path="/register" element={
                        isAuthenticated ? 
                            <Navigate to={user?.role === 'admin' ? '/admin' : '/'} replace /> 
                            : <Register />
                    } />
                    <Route path="/" element={
                        <ProtectedRoute>
                            {user?.role === 'admin' ? 
                                <Navigate to="/admin" replace /> 
                                : <Home />
                            }
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/*" element={
                        <ProtectedRoute requireAdmin={true}>
                            <AdminLayout>
                                <Routes>
                                    <Route index element={<AdminHome />} />
                                    <Route path="orders" element={<OrderManagement />} />
                                    <Route path="users" element={<UserManagement />} />
                                    <Route path="inventory" element={<InventoryManagement />} />
                                    <Route path="reports" element={<ReportsManagement />} />
                                    <Route path="settings" element={<AdminSettings />} />
                                </Routes>
                            </AdminLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/profile/*" element={
                        <ProtectedRoute>
                            <ProfileLayout />
                        </ProtectedRoute>
                    }>
                        <Route index element={<Profile />} />
                        <Route path="orders" element={<MyOrders />} />
                        <Route path="settings" element={<Settings />} />
                    </Route>
                    <Route path="/checkout" element={
                        <ProtectedRoute>
                            <Checkout />
                        </ProtectedRoute>
                    } />
                    <Route path="/orders/:orderId" element={
                        <ProtectedRoute>
                            <OrderDetails />
                        </ProtectedRoute>
                    } />
                    <Route path="/payment/success" element={<PaymentSuccess />} />
                    <Route path="/payment/failure" element={<PaymentFailure />} />
                    <Route path="/cart" element={
                        <ProtectedRoute>
                            <Cart />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin-register" element={<AdminRegister />} />
                </Routes>
            </Container>
        </Box>
    );
};

// Main App component
function App() {
    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <Router>
                    <CssBaseline />
                    <Toaster position="top-right" />
                    <AppContent />
                </Router>
            </ThemeProvider>
        </Provider>
    );
}

export default App;

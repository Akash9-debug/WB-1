import React, { useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/slices/authSlice';
import { authAPI } from '../services/api';
import { toast } from 'react-hot-toast';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');
            
            const response = await authAPI.login(formData);
            
            if (response.data.success) {
                dispatch(loginSuccess(response.data));
                toast.success('Login successful!');
                navigate(response.data.user.role === 'admin' ? '/admin' : '/');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
            toast.error('Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Login
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{ mt: 2 }}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="body2">
                        Don't have an account?{' '}
                        <Button
                            color="primary"
                            onClick={() => navigate('/register')}
                        >
                            Register
                        </Button>
                    </Typography>
                </Box>
                <Typography variant="body2" sx={{ mt: 1 }}>
                    Are you an admin?{' '}
                    <Button
                        color="primary"
                        onClick={() => navigate('/admin-register')}
                    >
                        Register as Admin
                    </Button>
                </Typography>
            </Paper>
        </Container>
    );
};

export default Login; 
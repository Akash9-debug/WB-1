import React, { useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Stepper,
    Step,
    StepLabel,
    Box,
    Alert
} from '@mui/material';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/slices/authSlice';
import { toast } from 'react-hot-toast';

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        emailOTP: ''
    });

    const steps = ['Basic Info', 'Email Verification', 'Set Password'];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const sendEmailOTP = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await authAPI.sendEmailOTP(formData.email);
            if (response.data.success) {
                setActiveStep(1);
                toast.success('OTP sent to your email');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to send OTP');
            toast.error('Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const verifyEmailOTP = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await authAPI.verifyOTP({ 
                identifier: formData.email, 
                otp: formData.emailOTP 
            });
            
            if (response.data.success) {
                setActiveStep(2); // Move to password step
                toast.success('Email verified successfully');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Invalid email OTP');
            toast.error('OTP verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');
            
            const response = await authAPI.register({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });

            if (response.data.success) {
                dispatch(loginSuccess(response.data));
                toast.success('Registration successful!');
                navigate('/');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed');
            toast.error('Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (activeStep) {
            case 0:
                return (
                    <>
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
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
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={sendEmailOTP}
                            disabled={loading || !formData.email || !formData.name}
                            sx={{ mt: 2 }}
                        >
                            {loading ? 'Processing...' : 'Continue'}
                        </Button>
                    </>
                );
            case 1:
                return (
                    <>
                        <Typography gutterBottom>
                            Enter the OTP sent to your email: {formData.email}
                        </Typography>
                        <TextField
                            fullWidth
                            label="Email OTP"
                            name="emailOTP"
                            value={formData.emailOTP}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={verifyEmailOTP}
                            disabled={loading || !formData.emailOTP}
                            sx={{ mt: 2 }}
                        >
                            {loading ? 'Verifying...' : 'Verify Email OTP'}
                        </Button>
                    </>
                );
            case 2:
                return (
                    <form onSubmit={handleSubmit}>
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
                            disabled={loading || !formData.password}
                            sx={{ mt: 2 }}
                        >
                            {loading ? 'Registering...' : 'Complete Registration'}
                        </Button>
                    </form>
                );
            default:
                return null;
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Register
                </Typography>
                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                {renderStep()}
            </Paper>
        </Container>
    );
};

export default Register; 
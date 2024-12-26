import api from './api';

export const initiatePayment = async (paymentData) => {
    try {
        const response = await api.post('/payments/initiate', paymentData);
        
        if (response.data.success) {
            // Redirect to PhonePe payment page
            window.location.href = response.data.paymentUrl;
            return true;
        }
        return false;
    } catch (error) {
        console.error('Payment initiation failed:', error);
        throw error;
    }
};

export const verifyPayment = async (paymentId) => {
    try {
        const response = await api.get(`/payments/verify/${paymentId}`);
        return response.data;
    } catch (error) {
        console.error('Payment verification failed:', error);
        throw error;
    }
}; 
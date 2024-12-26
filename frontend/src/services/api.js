import axios from 'axios';
import { store } from '../redux/store';
import { logout } from '../redux/slices/authSlice';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            store.dispatch(logout());
        }
        return Promise.reject(error);
    }
);

// Auth API endpoints
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    registerAdmin: (adminData) => api.post('/auth/register-admin', adminData),
    sendEmailOTP: (email) => api.post('/auth/send-email-otp', { email }),
    sendPhoneOTP: (phone) => api.post('/auth/send-phone-otp', { phone }),
    verifyOTP: (data) => api.post('/auth/verify-otp', data),
    verifyToken: () => api.get('/auth/verify-token')
};

// Book API endpoints
export const bookAPI = {
    getAllBooks: () => api.get('/books'),
    getBook: (id) => api.get(`/books/${id}`),
    createBook: (bookData) => {
        return api.post('/books', bookData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    updateBook: (id, bookData) => api.put(`/books/${id}`, bookData),
    deleteBook: (id) => api.delete(`/books/${id}`)
};

// Cart API endpoints
export const cartAPI = {
    getCart: () => api.get('/cart'),
    addToCart: (data) => api.post('/cart/add', data),
    removeFromCart: (itemId) => api.delete(`/cart/item/${itemId}`),
    clearCart: () => api.delete('/cart/clear')
};

// Payment API endpoints
export const paymentAPI = {
    initiatePayment: (paymentData) => api.post('/payments/initiate', paymentData),
    completePayment: (transactionId) => api.post('/payments/complete', { transactionId }),
    verifyPayment: (paymentId) => api.get(`/payments/verify/${paymentId}`)
};

// Order API endpoints
export const orderAPI = {
    createOrder: (orderData) => api.post('/orders', orderData),
    getOrder: (orderId) => api.get(`/orders/${orderId}`),
    getUserOrders: () => api.get('/orders/my-orders')
};

// User API endpoints
export const userAPI = {
    changePassword: (data) => api.put('/users/change-password', data),
    updatePreferences: (data) => api.put('/users/preferences', data),
    updateProfile: (data) => api.put('/users/profile', data),
    getProfile: () => api.get('/users/profile'),
    getSettings: () => api.get('/users/settings'),
    updateSettings: (data) => api.put('/users/settings', data),
    deleteAccount: () => api.delete('/users/account')
};

export const adminAPI = {
    // Dashboard
    getDashboardStats: () => api.get('/admin/dashboard-stats'),
    
    // Users
    getUsers: () => api.get('/admin/users'),
    toggleUserStatus: (userId) => api.put(`/admin/users/${userId}/toggle-status`),
    
    // Orders
    getAllOrders: () => api.get('/admin/orders'),
    updateOrderStatus: (orderId, status) => api.put(`/admin/orders/${orderId}/status`, { status }),
    getOrderStats: () => api.get('/admin/order-stats'),
    
    // Inventory
    getInventoryStats: () => api.get('/admin/inventory-stats'),
    addBook: (bookData) => api.post('/admin/books', bookData),
    updateBook: (bookId, bookData) => api.put(`/admin/books/${bookId}`, bookData),
    deleteBook: (bookId) => api.delete(`/admin/books/${bookId}`),
    
    // Reports
    getRevenueStats: () => api.get('/admin/revenue-stats'),
    getSalesReport: (dateRange) => api.get('/admin/reports/sales', { params: dateRange }),
    getInventoryReport: () => api.get('/admin/reports/inventory'),
    
    // Settings
    getSettings: () => api.get('/admin/settings'),
    updateSettings: (settings) => api.put('/admin/settings', settings),
    
    testEmail: (data) => api.post('/test/test-email', data)
};

export default api; 
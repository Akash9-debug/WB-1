const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart,
    clearCart
} = require('../controllers/cartController');

// Debug middleware
router.use((req, res, next) => {
    console.log('Cart route accessed:', req.method, req.path);
    console.log('Request params:', req.params);
    next();
});

// Apply protect middleware to all cart routes
router.use(protect);

// Cart routes
router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update-item', updateCartItem);
router.delete('/item/:itemId', removeFromCart);
router.delete('/clear', clearCart);

module.exports = router; 
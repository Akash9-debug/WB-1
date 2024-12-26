const Cart = require('../models/Cart');
const Book = require('../models/Book');
const Order = require('../models/Order');

// Add to cart
exports.addToCart = async (req, res) => {
    try {
        const { bookId, quantity = 1 } = req.body;
        const userId = req.user._id;

        // Get the book details
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        // Find or create cart
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({
                user: userId,
                items: [],
                total: 0
            });
        }

        // Check if book already exists in cart
        const existingItem = cart.items.find(item => 
            item.book.toString() === bookId.toString()
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                book: bookId,
                quantity,
                price: book.price
            });
        }

        cart.total = cart.items.reduce((sum, item) => 
            sum + (item.price * item.quantity), 0
        );

        await cart.save();
        await cart.populate('items.book');

        // Format the response data
        const cartData = {
            items: cart.items.map(item => ({
                _id: item.book._id,
                title: item.book.title,
                price: item.price,
                quantity: item.quantity,
                stock: item.book.stock
            })),
            total: cart.total
        };

        console.log('Sending cart data:', cartData); // Debug log

        res.status(200).json({
            success: true,
            message: 'Item added to cart successfully',
            data: cartData
        });

    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding item to cart'
        });
    }
};

// Get cart
exports.getCart = async (req, res) => {
    try {
        console.log('Getting cart for user:', req.user._id);
        
        let cart = await Cart.findOne({ user: req.user._id }).populate('items.book');
        
        if (!cart) {
            cart = new Cart({
                user: req.user._id,
                items: [],
                total: 0
            });
            await cart.save();
        }

        // Format cart data
        const cartData = {
            items: cart.items.map(item => ({
                _id: item.book._id,
                title: item.book.title,
                price: item.price,
                quantity: item.quantity,
                stock: item.book.stock
            })),
            total: cart.total
        };

        console.log('Sending cart data:', cartData);

        res.status(200).json({
            success: true,
            data: cartData
        });
    } catch (error) {
        console.error('Error getting cart:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching cart'
        });
    }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
    try {
        const { itemId, quantity } = req.body;
        const cart = await Cart.findOne({ user: req.user._id });

        const item = cart.items.id(itemId);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            });
        }

        // Check stock
        const book = await Book.findById(item.book);
        if (book.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Not enough stock available'
            });
        }

        item.quantity = quantity;
        cart.total = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        await cart.save();

        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
    try {
        const { itemId } = req.params;
        const userId = req.user._id;

        console.log('Removing item:', itemId, 'for user:', userId); // Debug log

        // Find user's cart
        let cart = await Cart.findOne({ user: userId });
        
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        // Find the item in the cart
        const itemIndex = cart.items.findIndex(item => 
            item._id.toString() === itemId || 
            item.book._id.toString() === itemId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            });
        }

        // Remove the item
        cart.items.splice(itemIndex, 1);

        // Recalculate total
        cart.total = cart.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        // Save the cart
        await cart.save();

        // Format cart data for response
        const cartData = {
            items: cart.items.map(item => ({
                _id: item._id,
                title: item.book.title,
                price: item.price,
                quantity: item.quantity,
                stock: item.book.stock
            })),
            total: cart.total
        };

        res.status(200).json({
            success: true,
            message: 'Item removed from cart',
            data: cartData
        });

    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing item from cart'
        });
    }
};

// Clear cart
const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (cart) {
            cart.items = [];
            cart.total = 0;
            await cart.save();
        }

        res.status(200).json({
            success: true,
            message: 'Cart cleared successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error clearing cart'
        });
    }
};

// Update exports to use the correct format
module.exports = {
    addToCart: exports.addToCart,  // Since we used exports.addToCart earlier
    getCart: exports.getCart,
    updateCartItem,
    removeFromCart: exports.removeFromCart,
    clearCart
}; 
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Book = require('../models/Book');
const { sendEmail } = require('../utils/sendEmail');
const { getOrderConfirmationTemplate } = require('../utils/emailTemplates');

// Create order
exports.createOrder = async (req, res) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;
        const userId = req.user._id;

        // Get user's cart
        const cart = await Cart.findOne({ user: userId }).populate('items.book');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty'
            });
        }

        // Create order
        const order = await Order.create({
            user: userId,
            books: cart.items.map(item => ({
                book: item.book._id,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount: cart.total,
            shippingAddress,
            paymentMethod,
            status: paymentMethod === 'cod' ? 'Pending' : 'Processing'
        });

        // Update book stock
        for (const item of cart.items) {
            await Book.findByIdAndUpdate(item.book._id, {
                $inc: { stock: -item.quantity }
            });
        }

        // Clear cart
        cart.items = [];
        cart.total = 0;
        await cart.save();

        // Send order confirmation email
        try {
            await sendEmail({
                email: req.user.email,
                subject: 'Order Confirmation - University Bookstore',
                html: getOrderConfirmationTemplate(order, req.user.name)
            });
        } catch (emailError) {
            console.error('Error sending order confirmation email:', emailError);
        }

        res.status(201).json({
            success: true,
            data: order
        });

    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating order'
        });
    }
};

// Get order by ID
exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId)
            .populate('books.book')
            .populate('user', 'name email');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if user is authorized to view this order
        if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this order'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching order details'
        });
    }
};

// Get user orders with real-time updates
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('books.book')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching orders'
        });
    }
};

// Get all orders (admin)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('books.book', 'title price')
            .populate('statusHistory.updatedBy', 'name')
            .sort({ createdAt: -1 });

        // Format orders to ensure latest status is reflected
        const formattedOrders = orders.map(order => {
            const orderObj = order.toObject();
            // Always use the latest status from statusHistory
            if (orderObj.statusHistory && orderObj.statusHistory.length > 0) {
                const latestStatus = orderObj.statusHistory[orderObj.statusHistory.length - 1];
                orderObj.status = latestStatus.status;
                orderObj.lastUpdated = latestStatus.timestamp;
            }
            return orderObj;
        });

        res.status(200).json({
            success: true,
            data: formattedOrders
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching orders'
        });
    }
};

// Get order statistics (admin)
exports.getOrderStats = async (req, res) => {
    try {
        const total = await Order.countDocuments();
        const pending = await Order.countDocuments({ status: 'Pending' });
        const processing = await Order.countDocuments({ status: 'Processing' });
        const delivered = await Order.countDocuments({ status: 'Delivered' });
        const cancelled = await Order.countDocuments({ status: 'Cancelled' });

        res.status(200).json({
            success: true,
            data: {
                total,
                pending,
                processing,
                delivered,
                cancelled
            }
        });
    } catch (error) {
        console.error('Error fetching order stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching order statistics'
        });
    }
};

// Update order status (admin)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        // Find and update the order with new status and history
        const updatedOrder = await Order.findOneAndUpdate(
            { _id: orderId },
            {
                $set: { status: status },
                $push: {
                    statusHistory: {
                        status: status,
                        timestamp: Date.now(),
                        updatedBy: req.user._id
                    }
                }
            },
            {
                new: true,
                runValidators: true
            }
        )
        .populate('user', 'name email')
        .populate('books.book', 'title price')
        .populate('statusHistory.updatedBy', 'name');

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Format order to ensure latest status is reflected
        const formattedOrder = updatedOrder.toObject();
        if (formattedOrder.statusHistory && formattedOrder.statusHistory.length > 0) {
            const latestStatus = formattedOrder.statusHistory[formattedOrder.statusHistory.length - 1];
            formattedOrder.status = latestStatus.status;
            formattedOrder.lastUpdated = latestStatus.timestamp;
        }

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            data: formattedOrder
        });

    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating order status: ' + error.message
        });
    }
}; 
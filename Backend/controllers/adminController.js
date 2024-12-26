const User = require('../models/User');
const Book = require('../models/Book');
const Order = require('../models/Order');

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
    try {
        // Get all orders for revenue calculation
        const allOrders = await Order.find()
            .populate('books.book')
            .populate('user', 'name email');

        // Calculate total revenue
        let revenue = 0;
        allOrders.forEach(order => {
            if (order.totalAmount) {
                revenue += order.totalAmount;
            }
        });

        // Get counts and statistics
        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments({ role: 'user' });
        const activeUsers = await User.countDocuments({ role: 'user', isBlocked: false });
        const totalBooks = await Book.countDocuments();
        const lowStockBooks = await Book.countDocuments({ stock: { $lt: 10 } });

        // Get recent orders
        const recentOrders = await Order.find()
            .populate('user', 'name email')
            .populate('books.book', 'title price')
            .sort('-createdAt')
            .limit(5);

        // Get monthly revenue data
        const monthlyRevenue = await Order.aggregate([
            {
                $match: {
                    status: 'Delivered',
                    createdAt: {
                        $gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
                    }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: '$createdAt' },
                        year: { $year: '$createdAt' }
                    },
                    total: { $sum: '$totalAmount' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Get order statistics by status
        const orderStats = await Order.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalOrders,
                totalUsers,
                totalBooks,
                revenue,
                activeUsers,
                lowStockBooks,
                orderStats,
                recentOrders,
                monthlyRevenue
            }
        });

    } catch (error) {
        console.error('Error getting dashboard stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard statistics'
        });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users'
        });
    }
};

// Toggle user status
exports.toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.isBlocked = !user.isBlocked;
        await user.save();

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error toggling user status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user status'
        });
    }
};

// Get order statistics
exports.getOrderStats = async (req, res) => {
    try {
        const orderStats = await Order.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$totalAmount' }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: orderStats
        });
    } catch (error) {
        console.error('Error getting order stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching order statistics'
        });
    }
};

// Get user statistics
exports.getUserStats = async (req, res) => {
    try {
        const userStats = await User.aggregate([
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: userStats
        });
    } catch (error) {
        console.error('Error getting user stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user statistics'
        });
    }
};

// Get inventory statistics
exports.getInventoryStats = async (req, res) => {
    try {
        const inventoryStats = await Book.aggregate([
            {
                $group: {
                    _id: null,
                    totalBooks: { $sum: 1 },
                    totalStock: { $sum: '$stock' },
                    lowStock: {
                        $sum: {
                            $cond: [{ $lt: ['$stock', 10] }, 1, 0]
                        }
                    },
                    outOfStock: {
                        $sum: {
                            $cond: [{ $eq: ['$stock', 0] }, 1, 0]
                        }
                    }
                }
            }
        ]);

        const categoryDistribution = await Book.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                inventoryStats: inventoryStats[0],
                categoryDistribution
            }
        });
    } catch (error) {
        console.error('Error getting inventory stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching inventory statistics'
        });
    }
};

// Get revenue statistics
exports.getRevenueStats = async (req, res) => {
    try {
        const dailyRevenue = await Order.aggregate([
            {
                $match: {
                    status: 'Delivered',
                    createdAt: {
                        $gte: new Date(new Date().setDate(new Date().getDate() - 30))
                    }
                }
            },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
                    },
                    revenue: { $sum: '$totalAmount' },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { '_id.date': 1 } }
        ]);

        const paymentMethodStats = await Order.aggregate([
            {
                $match: { status: 'Delivered' }
            },
            {
                $group: {
                    _id: '$paymentMethod',
                    count: { $sum: 1 },
                    total: { $sum: '$totalAmount' }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                dailyRevenue,
                paymentMethodStats
            }
        });
    } catch (error) {
        console.error('Error getting revenue stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching revenue statistics'
        });
    }
}; 
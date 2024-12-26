const Order = require('../models/Order');
const PaymentTransaction = require('../models/PaymentTransaction');
const { sendEmail } = require('../utils/sendEmail');
const { getOrderStatusUpdateTemplate } = require('../utils/emailTemplates');

class TrackingService {
    static async updateOrderStatus(orderId, status, details = {}) {
        const order = await Order.findById(orderId).populate('user');
        if (!order) {
            throw new Error('Order not found');
        }

        // Update order status
        order.tracking.currentStatus = status;
        order.tracking.updatedBy = details.updatedBy;
        
        if (details.location) {
            order.tracking.history[order.tracking.history.length - 1].location = details.location;
        }
        
        if (details.trackingNumber) {
            order.tracking.trackingNumber = details.trackingNumber;
            order.tracking.courier = details.courier;
        }

        if (details.estimatedDelivery) {
            order.tracking.estimatedDelivery = details.estimatedDelivery;
        }

        await order.save();

        // Send email notification
        try {
            await sendEmail({
                to: order.user.email,
                subject: `Order Status Update - ${status}`,
                html: getOrderStatusUpdateTemplate(order)
            });
        } catch (error) {
            console.error('Error sending status update email:', error);
        }

        return order;
    }

    static async getOrderTracking(orderId) {
        const order = await Order.findById(orderId)
            .populate('user', 'name email')
            .populate('tracking.history.updatedBy', 'name')
            .populate('paymentTransaction');

        if (!order) {
            throw new Error('Order not found');
        }

        return {
            orderId: order._id,
            currentStatus: order.tracking.currentStatus,
            history: order.tracking.history,
            estimatedDelivery: order.tracking.estimatedDelivery,
            trackingNumber: order.tracking.trackingNumber,
            courier: order.tracking.courier,
            payment: {
                status: order.paymentTransaction?.status,
                method: order.paymentTransaction?.paymentMethod,
                amount: order.paymentTransaction?.amount
            }
        };
    }
}

module.exports = TrackingService; 
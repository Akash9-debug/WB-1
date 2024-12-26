const { createOrder, capturePayment } = require('../services/paypalService');
const Order = require('../models/Order');
const PaymentTransaction = require('../models/PaymentTransaction');
const crypto = require('crypto');
const axios = require('axios');

exports.createPaymentOrder = async (req, res) => {
    try {
        const { amount } = req.body;
        const order = await createOrder(amount);

        res.status(200).json({
            success: true,
            data: order.result
        });
    } catch (error) {
        console.error('Error creating PayPal order:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.capturePayment = async (req, res) => {
    try {
        const { orderID } = req.body;
        const captureData = await capturePayment(orderID);

        // Create order record in database
        const order = await Order.create({
            user: req.user._id,
            books: req.body.items,
            totalAmount: captureData.result.purchase_units[0].amount.value,
            shippingAddress: req.body.shippingAddress,
            paymentInfo: {
                id: captureData.result.id,
                status: captureData.result.status,
                paymentMethod: 'paypal'
            }
        });

        // Create payment transaction record
        await PaymentTransaction.create({
            orderId: order._id,
            userId: req.user._id,
            amount: captureData.result.purchase_units[0].amount.value,
            paymentMethod: 'paypal',
            status: 'completed',
            transactionId: captureData.result.id,
            paymentDetails: captureData.result
        });

        res.status(200).json({
            success: true,
            data: {
                captureData: captureData.result,
                order
            }
        });
    } catch (error) {
        console.error('Payment capture error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.initiatePayment = async (req, res) => {
    try {
        const { items, total, shippingAddress, paymentMethod } = req.body;
        console.log('Payment initiation request:', { items, total, paymentMethod });

        if (paymentMethod === 'phonepe') {
            // For testing, create a mock transaction
            const merchantTransactionId = `MT${Date.now()}`;
            
            // Create transaction record
            const transaction = await PaymentTransaction.create({
                userId: req.user._id,
                merchantTransactionId,
                amount: total,
                paymentMethod: 'phonepe',
                status: 'initiated',
                items,
                shippingAddress
            });

            // For testing, redirect to success page directly
            res.json({
                success: true,
                paymentUrl: `${process.env.FRONTEND_URL}/payment/success?transactionId=${merchantTransactionId}`
            });
        } else if (paymentMethod === 'cod') {
            // Handle COD order creation
            const order = await Order.create({
                user: req.user._id,
                items,
                totalAmount: total,
                shippingAddress,
                paymentInfo: {
                    method: 'cod',
                    status: 'pending'
                }
            });

            res.json({
                success: true,
                orderId: order._id,
                redirectUrl: `/order-confirmation/${order._id}`
            });
        }
    } catch (error) {
        console.error('Payment initiation error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Handle PhonePe callback
exports.handleCallback = async (req, res) => {
    try {
        const { merchantTransactionId, transactionId, amount, status } = req.body;

        // Verify callback authenticity
        const receivedChecksum = req.headers['x-verify'];
        const calculatedChecksum = crypto
            .createHash('sha256')
            .update(JSON.stringify(req.body) + process.env.PHONEPE_SALT_KEY)
            .digest('hex') + '###' + process.env.PHONEPE_SALT_INDEX;

        if (receivedChecksum !== calculatedChecksum) {
            throw new Error('Invalid checksum');
        }

        // Find transaction
        const transaction = await PaymentTransaction.findOne({ merchantTransactionId });
        if (!transaction) {
            throw new Error('Transaction not found');
        }

        // Update transaction status
        transaction.status = status;
        transaction.transactionId = transactionId;
        await transaction.save();

        // If payment successful, create order
        if (status === 'SUCCESS') {
            const order = await Order.create({
                user: transaction.userId,
                items: transaction.items,
                totalAmount: amount / 100, // Convert from paise
                shippingAddress: transaction.shippingAddress,
                paymentInfo: {
                    id: transactionId,
                    status: status,
                    method: 'phonepe'
                }
            });

            // Update transaction with order ID
            transaction.orderId = order._id;
            await transaction.save();
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Callback handling error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}; 
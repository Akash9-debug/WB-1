const mongoose = require('mongoose');

const paymentTransactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    merchantTransactionId: {
        type: String,
        required: true,
        unique: true
    },
    transactionId: String,
    amount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['phonepe', 'cod']
    },
    status: {
        type: String,
        required: true,
        enum: ['initiated', 'SUCCESS', 'FAILURE', 'PENDING']
    },
    items: [{
        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book'
        },
        quantity: Number,
        price: Number
    }],
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        pinCode: String,
        phone: String
    }
}, { timestamps: true });

module.exports = mongoose.model('PaymentTransaction', paymentTransactionSchema); 
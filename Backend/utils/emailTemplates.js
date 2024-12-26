const getPasswordResetTemplate = (resetUrl, userName) => {
    return `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="background-color: #1a237e; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Password Reset</h1>
        </div>
        <div style="padding: 20px; background-color: #f5f5f5; border-radius: 5px; margin-top: 20px;">
            <h2>Hello ${userName},</h2>
            <p>You requested to reset your password. Click the button below to reset it:</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="background-color: #1a237e; color: white; padding: 12px 24px; 
                          text-decoration: none; border-radius: 5px; display: inline-block;">
                    Reset Password
                </a>
            </div>
            <p>If you didn't request this, please ignore this email.</p>
            <p>This link will expire in 30 minutes.</p>
        </div>
    </div>
    `;
};

const getOrderConfirmationTemplate = (order, userName) => {
    return `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="background-color: #1a237e; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Order Confirmation</h1>
        </div>
        <div style="padding: 20px; background-color: #f5f5f5; border-radius: 5px; margin-top: 20px;">
            <h2>Thank you for your order, ${userName}!</h2>
            <p>Your order has been confirmed and is being processed.</p>
            
            <div style="margin: 20px 0; padding: 15px; background-color: white; border-radius: 5px;">
                <h3 style="margin-top: 0;">Order Details</h3>
                <p><strong>Order ID:</strong> ${order._id}</p>
                <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
            </div>

            <div style="margin: 20px 0;">
                <h3>Items Ordered</h3>
                ${order.books.map(item => `
                    <div style="padding: 10px; background-color: white; margin: 10px 0; border-radius: 5px;">
                        <p style="margin: 5px 0;"><strong>${item.book.title}</strong></p>
                        <p style="margin: 5px 0;">Quantity: ${item.quantity}</p>
                        <p style="margin: 5px 0;">Price: ₹${item.price}</p>
                    </div>
                `).join('')}
            </div>

            <div style="margin: 20px 0;">
                <h3>Shipping Address</h3>
                <p>${order.shippingAddress.street}</p>
                <p>${order.shippingAddress.city}, ${order.shippingAddress.state}</p>
                <p>${order.shippingAddress.pinCode}</p>
                <p>${order.shippingAddress.country}</p>
            </div>
        </div>
    </div>
    `;
};

const getWelcomeEmailTemplate = (userName) => {
    return `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="background-color: #1a237e; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Welcome to University Bookstore</h1>
        </div>
        <div style="padding: 20px; background-color: #f5f5f5; border-radius: 5px; margin-top: 20px;">
            <h2>Hello ${userName}!</h2>
            <p>Thank you for joining University Bookstore. We're excited to have you as a member!</p>
            <p>With your account, you can:</p>
            <ul>
                <li>Browse our extensive collection of books</li>
                <li>Track your orders</li>
                <li>Save your favorite books</li>
                <li>Get updates on new arrivals and special offers</li>
            </ul>
            <p>If you have any questions, feel free to contact us.</p>
        </div>
    </div>
    `;
};

module.exports = {
    getPasswordResetTemplate,
    getOrderConfirmationTemplate,
    getWelcomeEmailTemplate
}; 
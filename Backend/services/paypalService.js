const paypal = require('@paypal/checkout-server-sdk');

// Creating an environment
let clientId = process.env.PAYPAL_CLIENT_ID;
let clientSecret = process.env.PAYPAL_CLIENT_SECRET;
let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);

const createOrder = async (amount) => {
    try {
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: amount.toString()
                }
            }]
        });

        const order = await client.execute(request);
        return order;
    } catch (error) {
        throw new Error(`PayPal order creation failed: ${error.message}`);
    }
};

const capturePayment = async (orderId) => {
    try {
        const request = new paypal.orders.OrdersCaptureRequest(orderId);
        request.requestBody({});
        const capture = await client.execute(request);
        return capture;
    } catch (error) {
        throw new Error(`PayPal payment capture failed: ${error.message}`);
    }
};

module.exports = {
    createOrder,
    capturePayment
}; 
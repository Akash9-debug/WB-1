const initializePhonePePayment = async (amount, orderId) => {
    try {
        // Generate merchantTransactionId
        const merchantTransactionId = `MT${Date.now()}`;
        
        // Create payload for PhonePe API
        const payload = {
            merchantId: process.env.REACT_APP_PHONEPE_MERCHANT_ID,
            merchantTransactionId: merchantTransactionId,
            amount: amount * 100, // Amount in paise
            redirectUrl: `${window.location.origin}/payment/status`,
            redirectMode: 'POST',
            callbackUrl: `${process.env.REACT_APP_API_URL}/api/payments/phonepe/callback`,
            paymentInstrument: {
                type: 'PAY_PAGE'
            }
        };

        // Call your backend to initiate payment
        const response = await fetch('/api/payments/phonepe/initiate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        
        // Redirect to PhonePe payment page
        if (data.success) {
            window.location.href = data.paymentUrl;
        }

    } catch (error) {
        console.error('PhonePe payment initialization failed:', error);
        throw error;
    }
}; 
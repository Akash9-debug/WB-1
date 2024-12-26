require('dotenv').config({ path: './.env' });
const { sendEmail } = require('./utils/emailService');

async function testEmail() {
    console.log('Starting email test...');
    console.log('Environment check:', {
        NODE_ENV: process.env.NODE_ENV,
        EMAIL_USERNAME: process.env.EMAIL_USERNAME ? 'set' : 'not set',
        EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? 'set' : 'not set',
        EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME
    });

    try {
        await sendEmail({
            to: 'easybooks7e8@gmail.com',
            subject: 'Test Email from Bookstore',
            html: '<h1>Test Email</h1><p>This is a test email from your bookstore application.</p>'
        });
        console.log('Test email sent successfully');
    } catch (error) {
        console.error('Test failed with error:', {
            message: error.message,
            stack: error.stack
        });
    }
}

testEmail(); 
const nodemailer = require('nodemailer');

// Debug: Log environment variables
console.log('Email Config:', {
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD ? '****' : 'missing',
    fromName: process.env.EMAIL_FROM_NAME
});

// Create transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USERNAME || '',
        pass: process.env.EMAIL_PASSWORD || ''
    }
});

// Send email function
const sendEmail = async ({ to, subject, html }) => {
    if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
        throw new Error('Email configuration is missing. Please check your environment variables.');
    }

    try {
        const mailOptions = {
            from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_USERNAME}>`,
            to,
            subject,
            html
        };

        console.log('Sending email with config:', {
            from: mailOptions.from,
            to: mailOptions.to,
            subject: mailOptions.subject
        });

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return true;
    } catch (error) {
        console.error('Detailed email error:', {
            code: error.code,
            response: error.response,
            command: error.command
        });
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

// Test the connection when the service starts
transporter.verify((error, success) => {
    if (error) {
        console.error('SMTP connection error:', error);
    } else {
        console.log('SMTP server is ready to take our messages');
    }
});

module.exports = { sendEmail }; 
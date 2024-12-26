const nodemailer = require('nodemailer');

const createTransporter = async () => {
    if (process.env.EMAIL_TEST_ACCOUNT === 'true') {
        // Create test account for development
        const testAccount = await nodemailer.createTestAccount();
        return nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });
    }

    // Real email configuration
    return nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

const sendEmail = async (options) => {
    try {
        const transporter = await createTransporter();

        const mailOptions = {
            from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_USER}>`,
            to: options.email,
            subject: options.subject,
            html: options.html || options.text // Prefer HTML if available
        };

        const info = await transporter.sendMail(mailOptions);

        if (process.env.EMAIL_TEST_ACCOUNT === 'true') {
            // Log test email URL in development
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }

        return info;
    } catch (error) {
        console.error('Email sending failed:', error);
        throw new Error('Email could not be sent');
    }
};

module.exports = sendEmail; 
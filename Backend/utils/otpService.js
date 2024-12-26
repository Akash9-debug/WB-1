const crypto = require('crypto');
const { sendEmail } = require('./emailService');

class OTPService {
    constructor() {
        this.otps = new Map();
    }

    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async sendEmailOTP(email) {
        try {
            const otp = this.generateOTP();
            const expiryTime = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

            // Store OTP with expiry
            this.otps.set(email, {
                otp,
                expiry: expiryTime,
                verified: false
            });

            // Send OTP via email
            await sendEmail({
                to: email,
                subject: 'Email Verification OTP',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2c3e50; text-align: center;">Email Verification</h2>
                        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
                            <p style="font-size: 16px;">Your OTP for email verification is:</p>
                            <h1 style="color: #3498db; text-align: center; font-size: 36px; letter-spacing: 5px;">
                                ${otp}
                            </h1>
                            <p style="color: #7f8c8d; font-size: 14px;">This OTP will expire in 10 minutes.</p>
                        </div>
                        <p style="color: #95a5a6; font-size: 12px; text-align: center; margin-top: 20px;">
                            If you didn't request this OTP, please ignore this email.
                        </p>
                    </div>
                `
            });

            console.log('OTP sent successfully to:', email);
            return true;
        } catch (error) {
            console.error('Error sending email OTP:', error);
            throw new Error('Failed to send OTP');
        }
    }

    verifyOTP(identifier, userOTP) {
        const otpData = this.otps.get(identifier);
        
        if (!otpData) {
            return false;
        }

        if (Date.now() > otpData.expiry) {
            this.otps.delete(identifier);
            return false;
        }

        if (otpData.otp === userOTP) {
            otpData.verified = true;
            this.otps.set(identifier, otpData);
            return true;
        }

        return false;
    }

    isVerified(identifier) {
        const otpData = this.otps.get(identifier);
        return otpData?.verified || false;
    }

    clearOTP(identifier) {
        this.otps.delete(identifier);
    }
}

module.exports = new OTPService(); 
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Rate limiting for payment endpoints
const paymentLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 payment requests per windowMs
    message: 'Too many payment attempts, please try again later'
});

// Additional security headers
const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "https://api.phonepe.com"],
            frameSrc: ["'self'", "https://api.phonepe.com"],
            connectSrc: ["'self'", "https://api.phonepe.com"]
        }
    }
});

module.exports = {
    paymentLimiter,
    securityHeaders
}; 
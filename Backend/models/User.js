const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    // Skip hashing for admin users
    if (this.role === 'admin') {
        return next();
    }

    // Only hash password for regular users if it's modified
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
    try {
        if (!this.password) {
            console.log('No password stored for user:', this.email);
            return false;
        }

        // For admin users, do direct comparison
        if (this.role === 'admin') {
            const isMatch = enteredPassword === this.password;
            console.log('Admin password comparison for', this.email, ':', isMatch);
            return isMatch;
        }

        // For regular users, use bcrypt comparison
        const isMatch = await bcrypt.compare(enteredPassword, this.password);
        console.log('User password comparison for', this.email, ':', isMatch);
        return isMatch;
    } catch (error) {
        console.error('Password comparison error:', error);
        return false;
    }
};

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function() {
    return jwt.sign(
        { 
            id: this._id,
            role: this.role // Include role in token
        },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};

module.exports = mongoose.model('User', userSchema); 
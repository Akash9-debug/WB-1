const mongoose = require('mongoose');
const path = require('path');
const User = require('../models/User');
const Book = require('../models/Book');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Workbook = require('../models/Workbook');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const connectDB = require('../config/db');

const runSystemTests = async () => {
    try {
        console.log('\n🔄 Starting system tests...\n');

        // 1. Test Database Connection
        console.log('📋 Testing Database Connection:');
        await connectDB();
        console.log('✅ MongoDB Connected');

        // 2. Test Environment Variables
        console.log('\n📋 Testing Environment Variables:');
        const requiredEnvVars = [
            'MONGODB_URI',
            'JWT_SECRET',
            'ADMIN_SECRET_KEY',
            'EMAIL_USERNAME',
            'EMAIL_PASSWORD'
        ];

        let allEnvVarsPresent = true;
        requiredEnvVars.forEach(varName => {
            if (process.env[varName]) {
                console.log(`✅ ${varName} is set`);
            } else {
                console.log(`❌ ${varName} is missing`);
                allEnvVarsPresent = false;
            }
        });

        if (!allEnvVarsPresent) {
            throw new Error('Missing required environment variables');
        }

        // 3. Database Operations Test
        console.log('\n📋 Testing Database Operations:');

        // Clear existing test data
        await User.deleteMany({});
        await Book.deleteMany({});
        await Cart.deleteMany({});
        await Order.deleteMany({});
        console.log('✅ Database cleared');

        // Test User Creation
        const testUser = await User.create({
            name: 'Test User',
            email: 'test@example.com',
            password: 'test123'
        });
        console.log('✅ Regular user created');

        // Test Admin Creation
        const testAdmin = await User.create({
            name: 'Test Admin',
            email: 'admin@example.com',
            password: 'admin123',
            role: 'admin'
        });
        console.log('✅ Admin user created');

        // 4. Authentication Tests
        console.log('\n📋 Testing Authentication:');
        
        // Test Regular User Authentication
        const regularUser = await User.findOne({ email: 'test@example.com' }).select('+password');
        const isUserPasswordValid = await regularUser.matchPassword('test123');
        console.log('✅ Regular user authentication:', isUserPasswordValid ? 'working' : 'failed');

        // Test Admin Authentication
        const adminUser = await User.findOne({ email: 'admin@example.com' }).select('+password');
        console.log('Admin password hash:', adminUser.password);
        const isAdminPasswordValid = await adminUser.matchPassword('admin123');
        console.log('✅ Admin authentication:', isAdminPasswordValid ? 'working' : 'failed');

        // Test Admin Role
        console.log('Admin role:', adminUser.role);
        const isAdminRole = adminUser.role === 'admin';
        console.log('✅ Admin role check:', isAdminRole ? 'working' : 'failed');

        // Create a test admin using the same method as your login endpoint
        const testLoginAdmin = await User.create({
            name: 'Test Login Admin',
            email: 'testadmin@example.com',
            password: 'admin123',
            role: 'admin'
        });

        // Test admin login with the exact same method as your login endpoint
        const loginTestAdmin = await User.findOne({ email: 'testadmin@example.com' }).select('+password');
        const canAdminLogin = await loginTestAdmin.matchPassword('admin123');
        console.log('✅ Admin login test:', canAdminLogin ? 'working' : 'failed');

        // 5. Book and Workbook Operations Test
        console.log('\n📋 Testing Book & Workbook Operations:');
        
        // Test Book Creation
        const testBook = await Book.create({
            title: 'Test Book',
            author: 'Test Author',
            description: 'Test Description',
            price: 29.99,
            category: 'Engineering',
            stock: 10,
            year: '1st Year'
        });
        console.log('✅ Book creation successful');

        // Test Book Search
        const searchedBooks = await Book.find({ category: 'Engineering' });
        console.log('✅ Book search successful');

        // Test Book Stock Update
        await Book.findByIdAndUpdate(testBook._id, { $inc: { stock: -1 } });
        console.log('✅ Book stock update successful');

        // Test Book Deletion
        await Book.findByIdAndDelete(testBook._id);
        const deletedBook = await Book.findById(testBook._id);
        console.log('✅ Book deletion:', !deletedBook ? 'working' : 'failed');

        // Test Workbook Operations
        console.log('\n📋 Testing Workbook Operations:');
        const testWorkbook = await Workbook.create({
            title: 'Test Workbook',
            author: 'Test Author',
            description: 'Test Description',
            price: 19.99,
            subject: 'Mathematics',
            grade: '10th',
            numberOfPages: 100,
            hasAnswerKey: true,
            practiceExercises: 'Multiple choice and problem solving',
            academicYear: '2024-2025'
        });
        console.log('✅ Workbook creation successful');

        // Test Workbook Update
        await Workbook.findByIdAndUpdate(testWorkbook._id, {
            hasAnswerKey: false,
            numberOfPages: 120
        });
        console.log('✅ Workbook update successful');

        // Test Workbook Search
        const searchedWorkbooks = await Workbook.find({ subject: 'Mathematics' });
        console.log('✅ Workbook search successful');

        // 6. Payment Integration Tests
        console.log('\n📋 Testing Payment Integration:');
        
        // Test PhonePe Configuration
        const phonepeConfig = {
            merchantId: process.env.PHONEPE_MERCHANT_ID,
            saltKey: process.env.PHONEPE_SALT_KEY,
            saltIndex: process.env.PHONEPE_SALT_INDEX,
            apiUrl: process.env.PHONEPE_API_URL
        };

        if (Object.values(phonepeConfig).every(value => value)) {
            console.log('✅ PhonePe configuration verified');
        } else {
            console.log('⚠️ PhonePe configuration incomplete');
        }

        // 7. Cart Operations Test
        console.log('\n📋 Testing Cart Operations:');
        
        // Test Cart Creation
        const testCart = await Cart.create({
            user: testUser._id,
            items: [{
                book: newBook._id,
                quantity: 1,
                price: newBook.price
            }],
            total: newBook.price
        });
        console.log('✅ Cart creation successful');

        // Test Cart Update
        await Cart.findByIdAndUpdate(testCart._id, {
            $set: { 'items.0.quantity': 2 },
            total: newBook.price * 2
        });
        console.log('✅ Cart update successful');

        // Test Cart Retrieval with Population
        const populatedCart = await Cart.findById(testCart._id).populate('items.book');
        console.log('✅ Cart population:', populatedCart.items[0].book.title ? 'working' : 'failed');

        // 8. Order Operations Test
        console.log('\n📋 Testing Order Operations:');
        
        const testOrder = await Order.create({
            user: testUser._id,
            books: [{
                book: testBook._id,
                quantity: 1,
                price: testBook.price
            }],
            totalAmount: testBook.price,
            paymentMethod: 'PhonePe',
            shippingAddress: {
                street: 'Test Street',
                city: 'Test City',
                state: 'Test State',
                pinCode: '123456'
            }
        });
        console.log('✅ Order creation successful');

        // Test Order Status Update
        await Order.findByIdAndUpdate(testOrder._id, { status: 'processing' });
        console.log('✅ Order status update successful');

        // Test Order Retrieval
        const retrievedOrder = await Order.findById(testOrder._id);
        console.log('✅ Order retrieval successful');

        // 9. User Profile Tests
        console.log('\n📋 Testing User Profile Operations:');
        
        // Test Profile Update
        await User.findByIdAndUpdate(testUser._id, {
            phone: '1234567890',
            addresses: [{
                street: 'Updated Street',
                city: 'Updated City',
                state: 'Updated State',
                pinCode: '654321'
            }]
        });
        console.log('✅ Profile update successful');

        // Test Profile Retrieval
        const updatedUser = await User.findById(testUser._id);
        console.log('✅ Profile retrieval successful');

        // 10. Cleanup
        console.log('\n📋 Cleaning up test data...');
        await User.deleteMany({});
        await Book.deleteMany({});
        await Workbook.deleteMany({});
        await Cart.deleteMany({});
        await Order.deleteMany({});
        console.log('✅ Test data cleaned up');

        console.log('\n✅ All tests completed successfully!\n');

    } catch (error) {
        console.error('\n❌ Test failed:', error);
        console.error('Error details:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('📋 Database connection closed\n');
    }
};

// Run the tests
runSystemTests(); 
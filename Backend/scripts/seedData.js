const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
    },
    {
        name: 'Test User 1',
        email: 'user1@example.com',
        password: 'user123',
        role: 'user'
    },
    {
        name: 'Test User 2',
        email: 'user2@example.com',
        password: 'user123',
        role: 'user'
    }
];

// Add this to your seed script
for (const userData of users) {
    const existingUser = await User.findOne({ email: userData.email });
    if (!existingUser) {
        await User.create(userData);
    }
} 
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('✓ Connected to MongoDB');

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: 'admin123@gmail.com' });
    if (existingAdmin) {
      console.log('✓ Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('abdullah12345', 10);
    const adminUser = new User({
      id: 'admin-1',
      name: 'Abdullahadmin',
      email: 'admin123@gmail.com',
      password: hashedPassword,
      isVerified: true,  // Admin is auto-verified
      role: 'admin'
    });

    await adminUser.save();
    console.log('✓ Admin user created successfully');
    console.log('Email: admin123@gmail.com');
    console.log('Password: abdullah12345');
    console.log('Status: Verified ✓');

    process.exit(0);
  } catch (err) {
    console.error('✗ Error:', err.message);
    process.exit(1);
  }
};

seedAdmin();

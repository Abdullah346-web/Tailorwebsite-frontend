/**
 * Fix existing admin account - Mark as verified
 * This script updates the admin123@gmail.com account to isVerified: true
 */
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

const fixAdminVerification = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Find existing admin
    const admin = await User.findOne({ email: 'admin123@gmail.com' });
    
    if (!admin) {
      console.log('✗ Admin account not found. Running seedAdmin.js first...');
      process.exit(1);
    }

    // Mark as verified
    admin.isVerified = true;
    await admin.save();

    console.log('✓ Admin account updated successfully');
    console.log(`✓ isVerified: ${admin.isVerified}`);
    console.log(`✓ Email: ${admin.email}`);
    console.log(`✓ Ready to login!`);

    process.exit(0);
  } catch (err) {
    console.error('✗ Error:', err.message);
    process.exit(1);
  }
};

fixAdminVerification();

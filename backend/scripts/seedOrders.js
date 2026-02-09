const mongoose = require('mongoose');
const Order = require('../models/Order');
const User = require('../models/User');

require('dotenv').config();

const seedOrders = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ MongoDB Connected');

    // Find admin user
    const adminUser = await User.findOne({ email: 'admin123@gmail.com' });
    if (!adminUser) {
      console.log('❌ Admin user not found. Run seedAdmin.js first.');
      process.exit(1);
    }

    // Clear existing orders
    await Order.deleteMany({});

    // Create demo order with measurements
    const demoOrder = new Order({
      id: 'DEMO001',
      userId: adminUser.id,
      trackingNo: 'TRK-DEMO123',
      price: 5000,
      dressType: 'Sherwani',
      status: 'pending',
      userName: adminUser.name,
      userEmail: adminUser.email,
      measurements: {
        shirt: {
          length: '32',
          armLength: '24',
          armHole: '15',
          armCuff: '8',
          teera: '12',
          chest: '40',
          waist: '36',
          hip: '38',
          daman: '28',
          sideNeck: '6',
          neckDesign: 'Round',
          extraDetails: 'Buttons on sleeves'
        },
        trouser: {
          length: '40',
          thigh: '22',
          ankle: '16',
          extraDetails: 'Side pockets'
        }
      }
    });

    await demoOrder.save();
    console.log('✅ Demo order created with measurements:');
    console.log(JSON.stringify(demoOrder.measurements, null, 2));

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

seedOrders();

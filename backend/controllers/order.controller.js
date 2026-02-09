const Order = require('../models/Order');
const User = require('../models/User');
const generateTracking = require('../utils/generateTracking');

exports.createOrder = async (req, res) => {
  try {
    const { userId, price, dressType, status = 'pending', measurements } = req.body;

    if (!userId || !price || !dressType) {
      return res.status(400).json({ message: 'userId, price, and dressType are required' });
    }

    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found for this order' });
    }

    const order = new Order({
      id: Date.now().toString(),
      userId,
      trackingNo: generateTracking(),
      price,
      dressType,
      status: status || 'pending',
      userName: user.name,
      userEmail: user.email,
      measurements: measurements || { 
        shirt: {
          length: '', armLength: '', armHole: '', armCuff: '', teera: '', 
          chest: '', waist: '', hip: '', daman: '', sideNeck: '', neckDesign: '', extraDetails: ''
        }, 
        trouser: { length: '', thigh: '', ankle: '', extraDetails: '' }
      },
    });

    await order.save();
    return res.status(201).json({ message: 'Order created', order });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create order', error: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    return res.json({ orders });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const myOrders = await Order.find({ userId: req.user.id });
    return res.json({ orders: myOrders });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, price, dressType, measurements } = req.body;

    const order = await Order.findOne({ id });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (status) order.status = status;
    if (price) order.price = price;
    if (dressType) order.dressType = dressType;
    if (measurements) {
      order.measurements = measurements;
      console.log('📏 Measurements updated:', JSON.stringify(measurements, null, 2));
    }

    await order.save();
    return res.json({ message: 'Order updated', order });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update order', error: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOneAndDelete({ id });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    return res.json({ message: 'Order deleted', order });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete order', error: err.message });
  }
};

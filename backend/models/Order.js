const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  userId: { type: String, required: true },
  trackingNo: { type: String, unique: true },
  price: { type: Number, required: true },
  dressType: { type: String, required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'cutting', 'stitching', 'ready', 'picked-up'] },
  userName: { type: String },
  userEmail: { type: String },
  measurements: {
    shirt: {
      length: String,
      armLength: String,
      armHole: String,
      armCuff: String,
      teera: String,
      chest: String,
      waist: String,
      hip: String,
      daman: String,
      sideNeck: String,
      neckDesign: String,
      extraDetails: String
    },
    trouser: {
      length: String,
      thigh: String,
      ankle: String,
      extraDetails: String
    }
  },
  createdAt: { type: Date, default: Date.now },
  pickedUpAt: { type: Date, default: null }
});

module.exports = mongoose.model('Order', orderSchema);

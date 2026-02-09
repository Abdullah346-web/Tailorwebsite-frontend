const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: { type: String, required: true },
  email: { type: String, unique: true, lowercase: true, required: true },
  password: { type: String, required: true },
  
  // Email verification fields
  isVerified: { type: Boolean, default: false },
  verificationOTP: { type: String },
  verificationOTPExpires: { type: Date },
  
  // Password reset fields
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  
  // User role
  role: { type: String, default: 'user', enum: ['user', 'admin'] },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

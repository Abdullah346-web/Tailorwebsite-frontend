const mongoose = require('mongoose');

const signupRequestSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: { type: String, required: true },
  email: { type: String, unique: true, lowercase: true, required: true },
  
  // OTP for email verification (temporary, before approval)
  verificationOTP: { type: String },
  verificationOTPExpires: { type: Date },
  isEmailVerified: { type: Boolean, default: false },
  
  // Password will be stored temporarily during signup pending verification
  password: { type: String, required: true },
  
  // Status of signup request
  status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected'] },
  
  // Timestamps and relations
  createdAt: { type: Date, default: Date.now },
  approvedAt: { type: Date },
  userId: { type: String },
  rejectedAt: { type: Date },
  rejectionReason: { type: String }
});

module.exports = mongoose.model('SignupRequest', signupRequestSchema);

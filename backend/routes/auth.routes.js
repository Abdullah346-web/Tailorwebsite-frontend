const express = require('express');
const {
  signup,
  verifyEmailOTP,
  resendOTP,
  login,
  adminLogin,
  forgotPassword,
  resetPassword,
  getPendingSignups,
  approveSignup,
  rejectSignup,
  deleteSignupRequest,
} = require('../controllers/auth.controller');
const { authLimiter, adminLoginLimiter } = require('../middleware/rateLimit.middleware');
const { verifyToken, adminOnly } = require('../middleware/auth.middleware');

const router = express.Router();

// ==================== USER AUTHENTICATION ====================

// Signup flow with email verification
router.post('/signup', authLimiter, signup);
router.post('/verify-email-otp', authLimiter, verifyEmailOTP);
router.post('/resend-otp', authLimiter, resendOTP);

// User login
router.post('/login', authLimiter, login);

// Password reset flow
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);

// ==================== ADMIN AUTHENTICATION ====================

router.post('/admin', adminLoginLimiter, adminLogin);

// ==================== ADMIN ENDPOINTS ====================
// Manage signup requests (only admin)

router.get('/pending-signups', verifyToken, adminOnly, getPendingSignups);
router.post('/approve-signup/:requestId', verifyToken, adminOnly, approveSignup);
router.post('/reject-signup/:requestId', verifyToken, adminOnly, rejectSignup);
router.delete('/delete-signup/:requestId', verifyToken, adminOnly, deleteSignupRequest);

module.exports = router;


const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SignupRequest = require('../models/SignupRequest');
const emailService = require('../utils/emailService');
const { JWT_SECRET } = require('../middleware/auth.middleware');

const TOKEN_EXPIRES_IN = '7d';
const OTP_EXPIRATION_MINUTES = 10;
const RESET_TOKEN_EXPIRATION_MINUTES = 30;

/**
 * Sign JWT token for authenticated users
 */
const signToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRES_IN,
  });
};

/**
 * SIGNUP FLOW (SIMPLIFIED):
 * 1. User submits name, email, password
 * 2. Create signup request (awaiting admin approval)
 * 3. Admin approves → User can login
 */

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Password validation (basic)
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if email already exists in verified users
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'This email is already registered' });
    }

    // Check existing signup requests
    const existingRequest = await SignupRequest.findOne({ email: email.toLowerCase() });
    if (existingRequest) {
      // If pending, awaiting admin
      if (existingRequest.status === 'pending') {
        return res.status(400).json({
          message: 'Your signup request is pending admin approval. Please wait.',
        });
      }

      // If approved but user doesn't exist, allow re-signup (user was deleted by admin)
      if (existingRequest.status === 'approved') {
        // Delete the old approved request so they can re-signup
        await SignupRequest.deleteOne({ email: email.toLowerCase() });
      }

      // If rejected, check cooldown period (10 minutes)
      if (existingRequest.status === 'rejected') {
        const rejectedAt = new Date(existingRequest.rejectedAt);
        const currentTime = new Date();
        const timeDiffMinutes = (currentTime - rejectedAt) / (1000 * 60);

        if (timeDiffMinutes < 10) {
          const remainingMinutes = Math.ceil(10 - timeDiffMinutes);
          return res.status(400).json({
            message: `Your previous signup was rejected. Try again in ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}.`,
            retryAfter: remainingMinutes,
          });
        }

        // Cooldown expired, allow new signup
        await SignupRequest.deleteOne({ email: email.toLowerCase() });
      }
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create signup request directly (no OTP needed)
    const signupRequest = new SignupRequest({
      id: Date.now().toString(),
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      isEmailVerified: true, // Mark as verified since we're not doing OTP
      status: 'pending',
      createdAt: new Date(),
    });

    await signupRequest.save();

    return res.status(201).json({
      message: 'Signup successful! Your request is now awaiting admin approval. You will be able to login once approved.',
      requestId: signupRequest.id,
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};

/**
 * Email verification - Not needed in simplified flow
 * Deprecated endpoint
 */
exports.verifyEmailOTP = async (req, res) => {
  return res.status(410).json({ 
    message: 'Email verification step has been removed. Your signup is now directly pending admin approval.' 
  });
};

/**
 * Resend OTP - Not needed in simplified flow
 * Deprecated endpoint
 */
exports.resendOTP = async (req, res) => {
  return res.status(410).json({ 
    message: 'OTP step has been removed. Your signup is directly pending admin approval.' 
  });
};

/**
 * User Login - Only approved users can login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if there's a pending/rejected signup request
    const signupRequest = await SignupRequest.findOne({ email: email.toLowerCase() });
    
    if (signupRequest) {
      if (signupRequest.status === 'pending') {
        return res.status(403).json({
          message: 'Your signup request is pending admin approval. Please wait.',
        });
      }
      
      if (signupRequest.status === 'rejected') {
        return res.status(403).json({
          message: 'Your signup request was rejected. Please contact support.',
        });
      }
    }

    // Try to find user in verified users
    const user = await User.findOne({ email: email.toLowerCase() });

    // User not found
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = signToken(user);

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

/**
 * Admin Login
 */
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    // Check if user exists and has admin role
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access denied' });
    }

    // Check if admin email is verified
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Admin account not verified' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = signToken(user);

    return res.json({
      message: 'Admin login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Admin login error:', err);
    return res.status(500).json({ message: 'Admin login failed', error: err.message });
  }
};

/**
 * FORGOT PASSWORD FLOW:
 * 1. User requests password reset with email
 * 2. Generate reset token (OTP)
 * 3. Send reset link/OTP to email
 * 4. User clicks link or enters OTP
 * 5. User sets new password
 * 6. Token expires after use or after 30 minutes
 */

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if email exists (security best practice)
      return res.status(200).json({
        message: 'If this email exists, a password reset link has been sent.',
      });
    }

    // Generate secure reset token (OTP based)
    const resetToken = emailService.generateOTP();
    const resetExpires = new Date(Date.now() + RESET_TOKEN_EXPIRATION_MINUTES * 60000);

    // Save reset token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();

    // Send reset email
    const emailSent = await emailService.sendPasswordResetEmail(user.email, user.name, resetToken);

    if (!emailSent) {
      return res.status(500).json({
        message: 'Failed to send password reset email. Please try again.',
      });
    }

    return res.json({
      message: 'Password reset instructions have been sent to your email',
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ message: 'Password reset failed', error: err.message });
  }
};

/**
 * Reset Password - Complete password reset with token
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    // Password validation
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid or expired reset token. Request a new password reset.',
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.json({
      message: 'Password reset successful. You can now login with your new password.',
    });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ message: 'Password reset failed', error: err.message });
  }
};

/**
 * Get all pending signup requests
 * Only show requests where email is verified
 */
exports.getPendingSignups = async (req, res) => {
  try {
    // Get only email-verified pending requests
    const allRequests = await SignupRequest.find({
      status: 'pending',
      isEmailVerified: true,
    }).sort({ createdAt: -1 });

    return res.json({
      requests: allRequests,
      total: allRequests.length,
    });
  } catch (err) {
    console.error('Get pending signups error:', err);
    return res.status(500).json({ message: 'Failed to fetch requests', error: err.message });
  }
};

/**
 * Approve a signup request
 * This creates the actual user account
 */
exports.approveSignup = async (req, res) => {
  try {
    const { requestId } = req.params;

    if (!requestId) {
      return res.status(400).json({ message: 'Request ID is required' });
    }

    // Find signup request
    const signupReq = await SignupRequest.findOne({ id: requestId });
    if (!signupReq) {
      return res.status(404).json({ message: 'Signup request not found' });
    }

    // Verify the request is pending
    if (signupReq.status !== 'pending') {
      return res.status(400).json({ message: 'Request is not pending' });
    }

    // Create user account (password is already hashed in signup request)
    const newUser = new User({
      id: Date.now().toString(),
      name: signupReq.name,
      email: signupReq.email,
      password: signupReq.password, // Use already-hashed password
      isVerified: true, // Mark as verified
      role: 'user',
    });

    await newUser.save();

    // Update signup request status
    signupReq.status = 'approved';
    signupReq.approvedAt = new Date();
    signupReq.userId = newUser.id;
    await signupReq.save();

    return res.json({
      message: 'Signup approved. User account created and activated.',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error('Approve signup error:', err);
    return res.status(500).json({ message: 'Approval failed', error: err.message });
  }
};

/**
 * Reject a signup request
 */
exports.rejectSignup = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { reason } = req.body;

    if (!requestId) {
      return res.status(400).json({ message: 'Request ID is required' });
    }

    // Find signup request
    const signupReq = await SignupRequest.findOne({ id: requestId });
    if (!signupReq) {
      return res.status(404).json({ message: 'Signup request not found' });
    }

    // Can only reject pending requests
    if (signupReq.status !== 'pending') {
      return res.status(400).json({ message: 'Request is not pending' });
    }

    // Update status
    signupReq.status = 'rejected';
    signupReq.rejectedAt = new Date();
    signupReq.rejectionReason = reason || 'No reason provided';
    await signupReq.save();

    return res.json({
      message: 'Signup request rejected',
      request: {
        id: signupReq.id,
        email: signupReq.email,
        status: signupReq.status,
      },
    });
  } catch (err) {
    console.error('Reject signup error:', err);
    return res.status(500).json({ message: 'Rejection failed', error: err.message });
  }
};

/**
 * Delete a signup request
 */
exports.deleteSignupRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    if (!requestId) {
      return res.status(400).json({ message: 'Request ID is required' });
    }

    const signupReq = await SignupRequest.findOne({ id: requestId });
    if (!signupReq) {
      return res.status(404).json({ message: 'Signup request not found' });
    }

    await SignupRequest.deleteOne({ id: requestId });

    return res.json({
      message: 'Signup request deleted successfully',
    });
  } catch (err) {
    console.error('Delete signup request error:', err);
    return res.status(500).json({ message: 'Deletion failed', error: err.message });
  }
};
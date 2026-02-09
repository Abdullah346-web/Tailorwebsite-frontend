const rateLimit = require('express-rate-limit');

// General auth limiter: 10 attempts per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: 'Too many login attempts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Admin login limiter: 5 attempts per 15 minutes (stricter)
const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many admin login attempts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter, adminLoginLimiter };

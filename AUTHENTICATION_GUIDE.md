# Authentication System - Implementation Guide

## Overview
The authentication system has been completely redesigned with industry best practices for security and user experience:

1. **Signup Flow**: Email verification required before admin review
2. **Forgot Password**: Secure password reset with time-limited tokens
3. **Admin Portal**: Modern, secure admin login interface
4. **No Plain Text Passwords**: All passwords are bcrypt-hashed

---

## Setup Instructions

### 1. Backend Email Configuration

#### Option A: Using Gmail (Recommended for Development)

1. Go to https://myaccount.google.com/
2. Enable 2-Factor Authentication
3. Go to https://myaccount.google.com/apppasswords
4. Select "Mail" and "Windows Computer"
5. Generate an app password (16 characters)
6. Copy the password

Create/update `backend/.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
SENDER_EMAIL=your-email@gmail.com
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/tailor-website
JWT_SECRET=your-super-secret-key-here
NODE_ENV=development
```

#### Option B: Using Your Own SMTP Server

Configure the SMTP settings to your email provider's SMTP credentials.

### 2. Frontend Setup

No additional setup required. The frontend will automatically use the new authentication flows.

---

## API Endpoints

### User Authentication

#### 1. Signup (Phase 1 - Generate OTP)
```
POST /api/auth/signup
Body: { name, email, password }
Response: { message, requestId, requiresVerification: true }
```

**Flow**:
1. User submits name, email, and password
2. Server generates a 6-digit OTP
3. OTP is sent to user's email
4. Response includes `requestId` for next step

**Error Cases**:
- Email already registered
- Pending signup request exists
- Password too short (< 6 characters)

#### 2. Verify Email OTP (Phase 2)
```
POST /api/auth/verify-email-otp
Body: { requestId, otp }
Response: { message, requestId }
```

**Flow**:
1. User enters the OTP from their email
2. Server verifies the OTP (expires in 10 minutes)
3. Creates a signup request awaiting admin approval
4. User should now see success message

**Error Cases**:
- Invalid OTP
- Expired OTP (>10 minutes)
- Request not found

#### 3. Resend OTP
```
POST /api/auth/resend-otp
Body: { requestId }
Response: { message }
```

If user didn't receive OTP, they can request a new one with the same `requestId`.

#### 4. User Login
```
POST /api/auth/login
Body: { email, password }
Response: { message, token, user: { id, name, email, role } }
```

**Prerequisites**:
- Email must be verified ✓
- Signup must be approved by admin ✓

**Error Cases**:
- Email unverified
- Invalid credentials
- Signup not yet approved

#### 5. Forgot Password (Phase 1 - Request Reset)
```
POST /api/auth/forgot-password
Body: { email }
Response: { message }
```

**Flow**:
1. User enters their registered email
2. Server generates a reset token (6-digit OTP)
3. Reset link with token is sent to email
4. Token expires in 30 minutes

**Important**: Response is generic (doesn't reveal if email exists) for security.

#### 6. Reset Password (Phase 2 - Set New Password)
```
POST /api/auth/reset-password
Body: { token, newPassword }
Response: { message }
```

**Flow**:
1. User clicks reset link from email or enters token
2. User enters new password
3. Password is hashed and saved
4. Token is invalidated

**Error Cases**:
- Invalid token
- Expired token (>30 minutes)
- Password too short

---

### Admin Authentication

#### Admin Login
```
POST /api/auth/admin
Body: { email, password }
Response: { message, token, user: { id, name, email, role } }
```

**Requirements**:
- User must have `role: 'admin'`
- Email must be verified
- Correct password

---

### Admin Management Endpoints

#### Get Pending Signups (Only Email-Verified)
```
GET /api/auth/pending-signups
Headers: { Authorization: Bearer <token> }
Response: { requests: [...], total: number }
```

**Important**: Only shows signups where `isEmailVerified: true`

#### Approve Signup
```
POST /api/auth/approve-signup/:requestId
Headers: { Authorization: Bearer <token> }
Response: { message, user: { id, name, email, role } }
```

**What happens**:
1. Signup request must be pending and email-verified
2. User is created with hashed password
3. User is marked as verified
4. User can now login

#### Reject Signup
```
POST /api/auth/reject-signup/:requestId
Body: { reason }
Headers: { Authorization: Bearer <token> }
Response: { message, request: {...} }
```

**What happens**:
1. Signup request is marked as rejected
2. User can retry after 10 minutes cooldown

#### Delete Signup Request
```
DELETE /api/auth/delete-signup/:requestId
Headers: { Authorization: Bearer <token> }
Response: { message }
```

---

## User Model Changes

### Updated Fields

```javascript
User {
  id: String,
  name: String,
  email: String,
  password: String,              // ✓ Hashed (bcrypt)
  
  // ✓ NEW: Email verification
  isVerified: Boolean,          // Set to true only after admin approval
  verificationOTP: String,      // Cleared after verification
  verificationOTPExpires: Date, // 10 minutes
  
  // ✓ NEW: Password reset
  resetPasswordToken: String,   // 6-digit OTP
  resetPasswordExpires: Date,   // 30 minutes
  
  role: String,                 // 'user' or 'admin'
  createdAt: Date,
  updatedAt: Date
}
```

### Removed Fields
- ❌ `plainPassword` - NEVER store plain text passwords

---

## Security Features

### 1. Password Security
- ✓ Bcrypt hashing (10 salt rounds)
- ✓ No plain text storage
- ✓ Only hashed passwords sent to frontend

### 2. Email Verification
- ✓ 6-digit OTP sent to registered email
- ✓ OTP expires in 10 minutes
- ✓ Resendable for up to 3 attempts (configurable)
- ✓ Prevents fake email signups

### 3. Admin Approval
- ✓ Unverified emails don't show in admin panel
- ✓ Only admin can create user accounts
- ✓ Prevents unauthorized user creation

### 4. Password Reset
- ✓ Token-based reset (6-digit OTP)
- ✓ 30-minute expiration
- ✓ One-time use
- ✓ Secure reset link via email

### 5. Rate Limiting
- ✓ `/auth/login` & `/auth/signup`: 5 attempts/15 minutes
- ✓ `/auth/admin`: 5 attempts/15 minutes (stricter)
- ✓ Prevents brute force attacks

---

## Frontend Integration

### Signup Flow (New)

```javascript
// Step 1: Submit signup form
const result = await signup(name, email, password);
// Returns: { requestId, requiresVerification: true }

// Step 2: Show OTP verification screen
// User enters OTP received in email

// Step 3: Verify OTP
await verifyEmailOTP(requestId, otp);
// Shows: "Awaiting admin approval"

// Step 4: Admin approves → User can login
```

### Password Reset Flow (New)

```javascript
// Step 1: Request reset
await forgotPassword(email);
// Shows: "Check your email for reset instructions"

// Step 2: User clicks link or enters token
// User enters new password

// Step 3: Reset password
await resetPassword(token, newPassword);
// Shows: "Password reset successful. Login now"

// Step 4: User logs in with new password
await login(email, newPassword);
```

---

## Testing the System

### Manual Testing Checklist

1. **Signup with Email Verification**
   - [ ] Submit signup form
   - [ ] Receive OTP in email
   - [ ] Enter OTP and verify
   - [ ] See "Awaiting admin approval" message
   - [ ] Admin sees request in dashboard
   - [ ] Admin approves signup
   - [ ] User can login

2. **Password Reset**
   - [ ] Click "Forgot Password"
   - [ ] Enter registered email
   - [ ] Receive reset email with link
   - [ ] Click link or enter token
   - [ ] Enter new password
   - [ ] Verify password was changed

3. **Admin Login**
   - [ ] Click lock icon (Admin Portal)
   - [ ] Enter admin email and password
   - [ ] Login successful
   - [ ] See admin dashboard

4. **Security Tests**
   - [ ] Can't login with unverified email
   - [ ] Can't login without admin approval
   - [ ] Expired OTP is rejected
   - [ ] Incorrect OTP is rejected
   - [ ] Rate limiting works (5 attempts)

---

## Troubleshooting

### Emails Not Sending

**Check**:
1. `.env` file has correct SMTP credentials
2. Gmail: App password (not account password) being used
3. Gmail: 2-Factor Authentication enabled
4. Backend logs for email service errors
5. Network/firewall not blocking SMTP port 587

### OTP Expired

**Solution**: Click "Resend OTP" to get a new code

### Still Pending Admin Approval

**Check**:
1. Admin dashboard shows the signup request
2. Admin clicks "Approve" button
3. Wait for response confirmation

### Can't Find Admin Login

**Solution**: On login screen, click "Admin Login" button → Look for lock icon ⚔️

---

## API Rate Limits

- General auth endpoints: **5 attempts per 15 minutes**
- Admin login: **5 attempts per 15 minutes** (same limit, stricter monitoring)
- Reset limiter: Based on global auth limiter

---

## Environment Variables Reference

```env
# Email Service (REQUIRED for emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email
SMTP_PASSWORD=app-password
SENDER_EMAIL=your-email

# Frontend URL (for password reset links)
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/tailor-website

# JWT Secret
JWT_SECRET=very-secret-key-change-in-production

# Environment
NODE_ENV=development
```

---

## Future Enhancements

- [ ] Two-factor authentication (2FA)
- [ ] Social login (Google, Facebook)
- [ ] Email confirmation resend counter
- [ ] Password strength meter
- [ ] Login history/activity log
- [ ] Session management
- [ ] OAuth2 support

---

## Support

For issues or questions about the authentication system:
1. Check the Troubleshooting section above
2. Review backend error logs
3. Verify `.env` configuration
4. Check email service connectivity

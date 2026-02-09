# Complete Implementation: User Signup Approval System

## 📋 Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Files Changed](#files-changed)
4. [API Documentation](#api-documentation)
5. [Database Schema](#database-schema)
6. [Frontend Components](#frontend-components)
7. [User Journey](#user-journey)
8. [Testing Guide](#testing-guide)

---

## Overview

This system implements a two-stage user registration process:
- **Stage 1**: User submits signup request
- **Stage 2**: Admin reviews and approves/rejects the request

### Key Benefits
- Admin has full control over user registration
- Prevents spam and unwanted registrations
- Provides audit trail of all signup decisions
- Can add rejection reasons for transparency

---

## Architecture

### System Flow Diagram
```
┌─────────────┐
│   User      │
│  Signup     │
└──────┬──────┘
       │
       ↓
┌──────────────────┐
│ /auth/signup     │ ← Creates Pending Request
└──────┬───────────┘
       │
       ↓
┌────────────────────────┐
│  Signup Requests Store │
│  (status: pending)     │
└──────┬─────────────────┘
       │
       ↓
┌──────────────────────┐
│  Admin Dashboard     │
│  Reviews Requests    │
└──────┬───┬──────────┘
       │   │
    Approve Reject
       │   │
       ↓   ↓
    User  Request
   Created Rejected
```

### Technology Stack
- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express
- **Data Store**: In-memory (can be replaced with DB)
- **Security**: JWT, Rate Limiting, Role-based Access

---

## Files Changed

### 🆕 New Files

#### `backend/data/signupRequests.js`
```javascript
// In-memory signup requests store
// Status: 'pending' | 'approved' | 'rejected'
const signupRequests = [];
module.exports = signupRequests;
```

### ✏️ Modified Files

#### 1. `backend/controllers/auth.controller.js`

**Imports Added:**
```javascript
const signupRequests = require('../data/signupRequests');
```

**New Functions:**

- **`signup()`** - Changed behavior
  - Before: Created user immediately
  - After: Creates pending signup request
  - Validates: No duplicate emails in users or pending requests

- **`getPendingSignups()`** - Fetch pending requests
  - Returns: Array of requests with status "pending"
  - Protected: Admin only

- **`approveSignup(requestId)`** - Approve and create user
  - Hashes password on approval
  - Creates user account
  - Updates request status to "approved"
  - Protected: Admin only

- **`rejectSignup(requestId)`** - Reject signup
  - Updates request status to "rejected"
  - Stores rejection reason
  - Protected: Admin only

#### 2. `backend/routes/auth.routes.js`

**New Routes:**
```javascript
// Admin endpoints
GET  /api/auth/pending-signups
POST /api/auth/approve-signup/:requestId
POST /api/auth/reject-signup/:requestId
```

**Middleware Applied:**
- `verifyToken` - Checks JWT authentication
- `adminOnly` - Ensures user is admin role

#### 3. `src/pages/AdminDashboard.jsx`

**State Added:**
```javascript
const [signupRequests, setSignupRequests] = useState([]);
```

**Functions Added:**
- `loadSignupRequests()` - Fetch pending requests from backend
- `handleApproveSignup(requestId)` - Send approval to backend
- `handleRejectSignup(requestId)` - Send rejection to backend

**UI Sections Added:**
1. **Pending User Signups** - Shows pending requests (conditionally rendered)
2. **Signup Request History** - Shows approved/rejected requests

---

## API Documentation

### Signup Request (User)

**Endpoint:** `POST /api/auth/signup`

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "message": "Signup request submitted. Awaiting admin approval.",
  "requestId": "1674899400000"
}
```

**Error Responses:**
- 400: Missing fields
- 400: Email already registered
- 400: Signup request already pending for this email
- 500: Server error

---

### Get Pending Signups (Admin)

**Endpoint:** `GET /api/auth/pending-signups`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Response (200 OK):**
```json
{
  "requests": [
    {
      "id": "1674899400000",
      "name": "John Doe",
      "email": "john@example.com",
      "status": "pending",
      "createdAt": "2026-01-28T10:30:00Z"
    }
  ]
}
```

**Error Responses:**
- 401: Not authenticated
- 403: Not admin
- 500: Server error

---

### Approve Signup (Admin)

**Endpoint:** `POST /api/auth/approve-signup/:requestId`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Response (200 OK):**
```json
{
  "message": "Signup approved. User account created.",
  "user": {
    "id": "1674899500000",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Side Effects:**
- User account created in users store
- Password hashed with bcrypt
- Signup request status → "approved"
- `approvedAt` timestamp added
- `userId` field populated

**Error Responses:**
- 401: Not authenticated
- 403: Not admin
- 404: Request not found
- 400: Request not pending
- 500: Server error

---

### Reject Signup (Admin)

**Endpoint:** `POST /api/auth/reject-signup/:requestId`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Request:**
```json
{
  "reason": "Email not verified" // Optional
}
```

**Response (200 OK):**
```json
{
  "message": "Signup request rejected.",
  "request": {
    "id": "1674899400000",
    "status": "rejected",
    "rejectedAt": "2026-01-28T10:31:00Z",
    "rejectionReason": "Email not verified"
  }
}
```

**Side Effects:**
- Signup request status → "rejected"
- `rejectedAt` timestamp added
- `rejectionReason` field populated

**Error Responses:**
- 401: Not authenticated
- 403: Not admin
- 404: Request not found
- 400: Request not pending
- 500: Server error

---

## Database Schema

### Signup Request Object

```javascript
{
  id: String,                    // Timestamp-based unique ID
  name: String,                  // User's full name
  email: String,                 // Lowercase email address
  password: String,              // Plain password (temporarily stored)
  status: "pending|approved|rejected",
  createdAt: ISO8601DateTime,    // When request was submitted
  approvedAt?: ISO8601DateTime,  // When request was approved
  userId?: String,               // ID of created user (if approved)
  rejectedAt?: ISO8601DateTime,  // When request was rejected
  rejectionReason?: String       // Reason for rejection (if rejected)
}
```

### Storage Locations
- **Pending Requests**: `backend/data/signupRequests.js`
- **Approved Users**: `backend/data/users.js`

---

## Frontend Components

### AdminDashboard.jsx Changes

#### State Management
```javascript
const [signupRequests, setSignupRequests] = useState([]);
const [loading, setLoading] = useState(false);
const [saving, setSaving] = useState(false);
const [error, setError] = useState(null);
```

#### Data Fetching
```javascript
const loadSignupRequests = async () => {
  try {
    const data = await request('/auth/pending-signups', { method: 'GET' });
    setSignupRequests(data.requests || []);
  } catch (err) {
    setError(err.message || 'Failed to load signup requests');
  }
};

// Called on component mount
useEffect(() => {
  loadOrders();
  loadUsers();
  loadSignupRequests(); // ← Added
}, []);
```

#### Event Handlers
```javascript
const handleApproveSignup = async (requestId) => {
  setSaving(true);
  setError(null);
  try {
    const data = await request(`/auth/approve-signup/${requestId}`, {
      method: 'POST'
    });
    setSignupRequests(prev => 
      prev.map(r => r.id === requestId ? { ...r, status: 'approved' } : r)
    );
    setUsers(prev => [...prev, data.user]);
    alert(`User ${data.user.name} has been approved!`);
  } catch (err) {
    setError(err.message || 'Failed to approve signup');
  } finally {
    setSaving(false);
  }
};

const handleRejectSignup = async (requestId) => {
  const reason = prompt('Enter rejection reason (optional):');
  setSaving(true);
  setError(null);
  try {
    await request(`/auth/reject-signup/${requestId}`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
    setSignupRequests(prev => 
      prev.map(r => r.id === requestId ? { ...r, status: 'rejected' } : r)
    );
    alert('Signup request rejected.');
  } catch (err) {
    setError(err.message || 'Failed to reject signup');
  } finally {
    setSaving(false);
  }
};
```

#### UI Components

**Pending Requests Section:**
- Conditionally rendered (only if pending requests exist)
- Blue gradient header with count
- Card for each request showing name, email, date
- Approve and Reject buttons
- Refresh button

**History Section:**
- Conditionally rendered (only if history exists)
- Approved requests: Green styling
- Rejected requests: Red styling with reason
- Sorted by most recent first

---

## User Journey

### Happy Path: Successful Approval

```
1. User opens signup page
2. Fills form: name, email, password
3. Clicks "Sign Up"
   ↓
4. Backend: /api/auth/signup
   - Validates input
   - Checks for duplicate email
   - Creates pending request
   - Returns success message
   ↓
5. User sees: "Signup request submitted. Awaiting admin approval."
   ↓
6. Admin logs in to dashboard
   ↓
7. Sees "Pending User Signups" section with user's request
   ↓
8. Clicks "✓ Approve"
   ↓
9. Backend: /api/auth/approve-signup/:requestId
   - Hashes password
   - Creates user account
   - Updates request status
   ↓
10. Admin sees success message
    User moves to "All Users" list
    Request moves to "History"
    ↓
11. User receives notification (optional - can add email)
    ↓
12. User can now login with email & password ✓
```

### Sad Path: Rejection

```
1. User submits signup request (same as above)
   ↓
2. Admin sees request in dashboard
   ↓
3. Clicks "✕ Reject"
   ↓
4. Prompt: "Enter rejection reason (optional):"
   Admin enters: "Email not verified"
   ↓
5. Backend: /api/auth/reject-signup/:requestId
   - Updates request status to "rejected"
   - Stores rejection reason
   ↓
6. Admin sees: "Signup request rejected."
   Request moves to "History" with red badge
   ↓
7. User never created
   Cannot login with that email
   ↓
8. If user tries signup again:
   - Can resubmit new request
   - Different email required
```

---

## Testing Guide

### Prerequisites
- Admin account (provided: email: admin123@gmail.com, password: abdullah12345)
- Test user credentials

### Test Case 1: Submit Signup Request

**Steps:**
1. Navigate to signup page
2. Fill in:
   - Name: "Test User One"
   - Email: "testuser1@example.com"
   - Password: "password123"
3. Click "Sign Up"

**Expected Result:**
- Message appears: "Signup request submitted. Awaiting admin approval."
- No login occurs

**Verification:**
- Check browser console: No auth token stored
- Try logging in with those credentials: Should fail

---

### Test Case 2: View Pending Requests

**Steps:**
1. After submitting signup (TC1)
2. Login as admin
3. Go to Admin Dashboard

**Expected Result:**
- "Pending User Signups" section visible
- Shows "Test User One" with email "testuser1@example.com"
- Shows request timestamp
- Two buttons: "✓ Approve" and "✕ Reject"

---

### Test Case 3: Approve Signup

**Steps:**
1. From TC2, in Pending Signups section
2. Click "✓ Approve" button for "Test User One"

**Expected Result:**
- Success message: "User Test User One has been approved..."
- Request disappears from Pending section
- Appears in "Signup Request History" with green badge
- "Test User One" appears in "All Users" list
- Can now create orders with this user

---

### Test Case 4: Reject Signup

**Steps:**
1. Submit another signup: "Test User Two" / "testuser2@example.com"
2. In Admin Dashboard
3. Click "✕ Reject" button
4. Enter reason: "Suspicious activity"

**Expected Result:**
- Prompt appears asking for reason
- After entering reason, alert shows: "Signup request rejected."
- Request appears in history with red badge
- Shows reason: "Suspicious activity"

---

### Test Case 5: Duplicate Signup Prevention

**Steps:**
1. Try to signup again with same email as TC1: "testuser1@example.com"

**Expected Result:**
- Error message: "Email already registered"
- No new request created

---

### Test Case 6: Pending Signup Prevention

**Steps:**
1. Submit signup: "Test User Three" / "testuser3@example.com"
2. Immediately try to signup again with same email

**Expected Result:**
- First signup succeeds: pending request created
- Second signup fails: "Signup request already pending for this email"

---

### Test Case 7: Approved User Can Login

**Steps:**
1. Approve signup from TC3 (Test User One)
2. Logout from admin account
3. Go to login page
4. Try login with: testuser1@example.com / password123

**Expected Result:**
- Login succeeds
- User is authenticated
- Can access user dashboard

---

## Troubleshooting

### Problem: Pending section not showing
**Solution:** 
- Ensure you're logged in as admin
- Ensure there are pending requests
- Click "Refresh" button
- Check browser console for errors

### Problem: Approve/Reject buttons not working
**Solution:**
- Check network tab for API errors
- Ensure admin token is valid
- Clear browser cache and reload
- Check backend logs for errors

### Problem: Approved user can't login
**Solution:**
- Verify user appears in "All Users" list
- Check that password is the same as submitted
- Try logout and login again
- Clear browser local storage

### Problem: Duplicate signup error when trying to approve
**Solution:**
- Email might already be registered (from different approval)
- Check users list for duplicates
- This shouldn't happen with correct implementation

---

## Security Considerations

### ✅ Implemented
- JWT authentication required for admin endpoints
- Role-based access control (adminOnly middleware)
- Email validation (no duplicates)
- Password hashing on approval (bcrypt)
- Rate limiting on signup endpoint
- HTTPS-ready (if deployed)

### ⚠️ Future Improvements
- Add email verification before signup
- Store passwords encrypted (not plain text even temporarily)
- Add audit logging
- Add email notifications on approval/rejection
- Add request expiration (old pending requests auto-delete)
- Add IP-based fraud detection

---

## Summary

This implementation adds a critical approval layer to user registration, giving administrators full control over who can create accounts. The system is:

- **Secure**: Protected with JWT and role-based access
- **User-friendly**: Clear UI and messaging
- **Admin-friendly**: Easy to manage requests
- **Auditable**: History of all decisions
- **Extensible**: Easy to add features like email notifications

The feature is fully functional and ready for production use (with recommended security enhancements).

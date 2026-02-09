# Quick Reference - User Signup Approval System

## Feature Overview
Users can no longer directly sign up. Instead, signup requests go to admin for approval.

## For Users
1. Fill signup form (name, email, password)
2. Submit
3. See message: "Signup request submitted. Awaiting admin approval."
4. Wait for admin approval
5. Once approved, can login with email and password

## For Admin
1. Login to dashboard
2. Look for "Pending User Signups" section (appears only if there are pending requests)
3. See list of users waiting for approval
4. Click "✓ Approve" to create the account
5. Click "✕ Reject" to deny signup (can add optional reason)
6. View all decisions in "Signup Request History"

## Backend API Endpoints

### Public
- `POST /api/auth/signup` → Creates pending request (not user)

### Admin Only (protected)
- `GET /api/auth/pending-signups` → Get pending requests
- `POST /api/auth/approve-signup/:requestId` → Approve and create user
- `POST /api/auth/reject-signup/:requestId` → Reject signup

## Database Changes

### New File
- `backend/data/signupRequests.js` - Stores pending/approved/rejected requests

### Request Object Structure
```javascript
{
  id: "timestamp",
  name: "User Name",
  email: "user@email.com",
  password: "plain_password",
  status: "pending|approved|rejected",
  createdAt: "2026-01-28T...",
  approvedAt: "2026-01-28T..." (if approved),
  userId: "assigned_user_id" (if approved),
  rejectedAt: "2026-01-28T..." (if rejected),
  rejectionReason: "reason text" (if rejected)
}
```

## Frontend Changes

### AdminDashboard.jsx Updates
- New state: `signupRequests`
- New function: `loadSignupRequests()`
- New handlers: `handleApproveSignup()`, `handleRejectSignup()`
- New UI sections: "Pending User Signups", "Signup Request History"

## Testing Commands

### Test 1: Submit Signup Request
```
POST /api/auth/signup
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}

Expected Response:
{
  "message": "Signup request submitted. Awaiting admin approval.",
  "requestId": "1234567890"
}
```

### Test 2: Get Pending Signups (as admin)
```
GET /api/auth/pending-signups
Authorization: Bearer <admin_token>

Expected Response:
{
  "requests": [
    {
      "id": "1234567890",
      "name": "Test User",
      "email": "test@example.com",
      "status": "pending",
      "createdAt": "2026-01-28T10:30:00Z"
    }
  ]
}
```

### Test 3: Approve Signup
```
POST /api/auth/approve-signup/1234567890
Authorization: Bearer <admin_token>

Expected Response:
{
  "message": "Signup approved. User account created.",
  "user": {
    "id": "new_user_id",
    "name": "Test User",
    "email": "test@example.com",
    "role": "user"
  }
}
```

### Test 4: Reject Signup
```
POST /api/auth/reject-signup/1234567890
Authorization: Bearer <admin_token>
{
  "reason": "Email verification failed"
}

Expected Response:
{
  "message": "Signup request rejected.",
  "request": {
    "id": "1234567890",
    "status": "rejected",
    "rejectedAt": "2026-01-28T10:31:00Z",
    "rejectionReason": "Email verification failed"
  }
}
```

## Email Validation
- ❌ Cannot signup if email already registered (existing user)
- ❌ Cannot signup if email has pending request
- ✓ Can signup if email is new or previous request was approved/rejected

## Security
- ✓ All admin endpoints require JWT token + admin role
- ✓ Passwords hashed only on approval (not stored in plain text permanently)
- ✓ Rate limiting on signup endpoint
- ✓ Email validation prevents duplicates

## Files Modified/Created

**Created:**
- `backend/data/signupRequests.js`
- `SIGNUP_APPROVAL_WORKFLOW.md`
- `IMPLEMENTATION_SUMMARY.md`
- `UI_GUIDE.md`
- `QUICK_REFERENCE.md` (this file)

**Modified:**
- `backend/controllers/auth.controller.js`
- `backend/routes/auth.routes.js`
- `src/pages/AdminDashboard.jsx`

## Color Scheme

| Status | Color | Icon |
|--------|-------|------|
| Pending | Blue | ⏳ |
| Approved | Green | ✓ |
| Rejected | Red | ✕ |

## Common Scenarios

### User Signs Up, Admin Approves
```
User signup → Pending request → Admin approves → User created → User can login
```

### User Signs Up, Admin Rejects
```
User signup → Pending request → Admin rejects → Cannot login (must signup again)
```

### User Signs Up Twice
```
First signup → Pending request
Second signup attempt → Error: "Already pending"
```

### Duplicate Email After Approval
```
User A signs up, approved, account created
User B tries signup with same email → Error: "Already registered"
```

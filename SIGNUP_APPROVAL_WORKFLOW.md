# User Signup Approval Workflow

## Overview
When a new user attempts to sign up, their request is submitted to the admin for review instead of being immediately created. The admin can then approve or reject the signup request from the AdminDashboard.

## Signup Flow

### 1. User Signup Request
- User visits signup and fills in name, email, and password
- Request is sent to `POST /api/auth/signup`
- Instead of creating the user directly, a **pending signup request** is created
- User receives feedback: "Signup request submitted. Awaiting admin approval."

### 2. Admin Review (AdminDashboard)
- Admin logs in to AdminDashboard
- A new section "Pending User Signups" is displayed with all pending requests
- Admin can see:
  - User's name, email
  - Request submission date and time
  - Approve or Reject buttons

### 3. Admin Approval
- Admin clicks "✓ Approve" on the request
- User account is created in the system
- Signup request status changes to "approved"
- User can now log in

### 4. Admin Rejection
- Admin clicks "✕ Reject"
- A prompt asks for rejection reason (optional)
- Signup request status changes to "rejected"
- User cannot sign up with that email

### 5. History
- Both approved and rejected requests appear in "Signup Request History" section
- Admin can see the timestamp and reasons for rejections

## API Endpoints

### User Endpoints
- `POST /api/auth/signup` - Submit signup request
  - Request body: `{ name, email, password }`
  - Response: `{ message, requestId }`

### Admin Endpoints (require authentication + admin role)
- `GET /api/auth/pending-signups` - Get all pending signup requests
  - Response: `{ requests: [...] }`

- `POST /api/auth/approve-signup/:requestId` - Approve a signup request
  - Response: `{ message, user: { id, name, email, role } }`

- `POST /api/auth/reject-signup/:requestId` - Reject a signup request
  - Request body: `{ reason: "optional reason" }`
  - Response: `{ message, request: {...} }`

## Data Structure

### Signup Request Object
```javascript
{
  id: "1234567890",           // Unique request ID
  name: "John Doe",
  email: "john@example.com",
  password: "plain-password", // Will be hashed on approval
  status: "pending",          // "pending", "approved", or "rejected"
  createdAt: "2026-01-28T...", // ISO timestamp
  approvedAt: "2026-01-28T...", // (if approved)
  userId: "approved-user-id",    // (if approved) - reference to created user
  rejectedAt: "2026-01-28T...",  // (if rejected)
  rejectionReason: "...",        // (if rejected)
}
```

## Frontend Components

### AdminDashboard Updates
1. **Pending Requests Section** - Shows all pending signups with approve/reject buttons
2. **History Section** - Shows approved and rejected requests with timestamps and reasons

## Testing

### Test Scenario 1: Submit Signup Request
```
1. Go to signup page
2. Enter: name="Test User", email="test@example.com", password="password123"
3. Submit
4. Should see: "Signup request submitted. Awaiting admin approval."
```

### Test Scenario 2: Approve Request
```
1. Login as admin
2. Go to AdminDashboard
3. Look for "Pending User Signups" section
4. Click "✓ Approve" on a request
5. User account should be created and visible in "All Users" section
6. Request moves to history with "approved" status
```

### Test Scenario 3: Reject Request
```
1. Login as admin
2. Go to AdminDashboard
3. Look for "Pending User Signups" section
4. Click "✕ Reject" on a request
5. Enter rejection reason (optional)
6. Request moves to history with "rejected" status
7. User cannot sign up with that email again
```

## Security Notes
- Only admins can view and manage signup requests
- Passwords are stored in plain text temporarily and hashed only after approval
- All endpoints are protected with JWT authentication
- Rate limiting is applied to signup endpoint

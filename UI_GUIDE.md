# User Approval Workflow - Visual Guide

## Signup Page (User Side)

```
┌─────────────────────────────────────────┐
│     SIGNUP FORM                         │
├─────────────────────────────────────────┤
│  Full Name:     [________________]      │
│  Email:         [________________]      │
│  Password:      [________________]      │
│                                         │
│           [SUBMIT SIGNUP]               │
└─────────────────────────────────────────┘

                    ↓ [On Submit]

┌─────────────────────────────────────────┐
│   ✓ Signup request submitted.           │
│   Awaiting admin approval.              │
└─────────────────────────────────────────┘
```

## Admin Dashboard - Pending Requests Section

```
┌────────────────────────────────────────────────────────┐
│  PENDING USER SIGNUPS                       [Refresh]  │
│  2 user(s) awaiting approval                           │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ John Doe                                         │ │
│  │ john@example.com                                 │ │
│  │ Requested: Jan 28, 2026 10:30 AM                │ │
│  │                  [✓ Approve] [✕ Reject]         │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Sarah Khan                                       │ │
│  │ sarah@example.com                                │ │
│  │ Requested: Jan 28, 2026 10:25 AM                │ │
│  │                  [✓ Approve] [✕ Reject]         │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## Approval Flow

```
Admin clicks [✓ Approve] on John Doe's request

              ↓

Database:
├─ signupRequests: status changed to "approved"
└─ users: NEW user added
   {
     id: "1234567890",
     name: "John Doe",
     email: "john@example.com",
     password: "hashed_password",
     role: "user"
   }

              ↓

Frontend:
├─ Request moves from "Pending" to "History"
├─ User added to "All Users" list
└─ Admin Dashboard refreshes
```

## Rejection Flow

```
Admin clicks [✕ Reject] on Sarah Khan's request

              ↓

Prompt appears:
┌────────────────────────────────────────┐
│ Enter rejection reason (optional):     │
│ [________________________]             │
│ Example: "Incomplete information"      │
└────────────────────────────────────────┘

              ↓

Database:
└─ signupRequests: status changed to "rejected"
   rejectedAt: "2026-01-28T10:35:00Z"
   rejectionReason: "Incomplete information"

              ↓

Frontend:
└─ Request moves to "History" with red badge
   "✕ Rejected on Jan 28, 2026 — Incomplete information"
```

## Admin Dashboard - History Section

```
┌────────────────────────────────────────────────────────┐
│  SIGNUP REQUEST HISTORY                                │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ John Doe (john@example.com)                      │ │
│  │ ✓ Approved on Jan 28, 2026              [APPROVED]│ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Sarah Khan (sarah@example.com)                   │ │
│  │ ✕ Rejected on Jan 28, 2026                      │ │
│  │   — Incomplete information           [REJECTED]  │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Ahmed Hassan (ahmed@example.com)                 │ │
│  │ ✓ Approved on Jan 27, 2026              [APPROVED]│ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## State Transitions Diagram

```
                    ┌─────────────┐
                    │  Signup     │
                    │  Form Sent  │
                    └──────┬──────┘
                           │
                           ↓
                ┌──────────────────────┐
                │  Pending Request     │
                │  Created in DB       │
                └──────┬──────┬────────┘
                       │      │
          [Admin Action]│      │
                       │      │
        ┌──────────────┘      └────────────┐
        │                                  │
        ↓                                  ↓
  ┌────────────┐                  ┌──────────────┐
  │ APPROVED   │                  │  REJECTED    │
  ├────────────┤                  ├──────────────┤
  │ User       │                  │ User Cannot  │
  │ Created    │                  │ Login        │
  │ Can Login  │                  │ (Reason)     │
  └────────────┘                  └──────────────┘
```

## Email Validation

```
User tries to signup with email "test@example.com"

    ↓ Check Database

    Is "test@example.com" already a user?
    ├─ YES → Error: "Email already registered"
    └─ NO → Continue

    Is "test@example.com" pending approval?
    ├─ YES → Error: "Signup request already pending for this email"
    └─ NO → Create signup request ✓
```

## Colors & Status Indicators

### Pending Request
```
Background: Blue gradient (from-blue-900/30 to-purple-900/30)
Border: Blue
Badge: N/A (shown as card)
```

### Approved
```
Background: Green
Text: Green
Badge: "approved" with green background
Icon: ✓
```

### Rejected
```
Background: Red
Text: Red
Badge: "rejected" with red background
Icon: ✕
Reason: Displayed below status
```

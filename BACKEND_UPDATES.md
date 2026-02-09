# Backend Updates for Picked Up Order Lifecycle

## Overview
Updated the Node.js/Express backend to support the complete "Picked Up" order lifecycle with timestamps and status tracking.

---

## 1. Order Model Updates

### File: `backend/models/Order.js`

#### Changes Made:

**1. Status Enum Extended**
```javascript
status: { 
  type: String, 
  default: 'pending', 
  enum: ['pending', 'cutting', 'stitching', 'ready', 'picked-up']  // Added 'picked-up'
}
```

**2. New Field: pickedUpAt**
```javascript
pickedUpAt: { type: Date, default: null }
```

**Complete Order Schema:**
```javascript
{
  id: String (unique),
  userId: String (required),
  trackingNo: String (unique),
  price: Number (required),
  dressType: String (required),
  status: ['pending', 'cutting', 'stitching', 'ready', 'picked-up'],
  userName: String,
  userEmail: String,
  measurements: {
    shirt: {
      length, armLength, armHole, armCuff, teera,
      chest, waist, hip, daman, sideNeck, neckDesign, extraDetails
    },
    trouser: { length, thigh, ankle, extraDetails }
  },
  createdAt: Date (default: Date.now),
  pickedUpAt: Date (default: null)  // NEW
}
```

---

## 2. Order Controller Updates

### File: `backend/controllers/order.controller.js`

#### 1. createOrder() - Enhanced
```javascript
exports.createOrder = async (req, res) => {
  try {
    const { userId, price, dressType, status = 'pending', measurements, createdAt, pickedUpAt } = req.body;
    
    // Validation
    if (!userId || !price || !dressType) {
      return res.status(400).json({ message: '...' });
    }
    
    // Create order with timestamps
    const order = new Order({
      id: Date.now().toString(),
      userId,
      trackingNo: generateTracking(),
      price,
      dressType,
      status: status || 'pending',
      userName: user.name,
      userEmail: user.email,
      measurements: measurements || { shirt: {}, trouser: {} },
      createdAt: createdAt ? new Date(createdAt) : new Date(),  // NEW
      pickedUpAt: pickedUpAt ? new Date(pickedUpAt) : null,     // NEW
    });
    
    await order.save();
    return res.status(201).json({ message: 'Order created', order });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create order', error: err.message });
  }
};
```

**Features:**
- Accepts `createdAt` from frontend (ISO timestamp)
- Accepts `pickedUpAt` from frontend (ISO timestamp, usually null)
- Defaults `createdAt` to current time if not provided
- Properly converts string timestamps to Date objects

#### 2. updateOrder() - Enhanced
```javascript
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, price, dressType, pickedUpAt } = req.body;  // Added pickedUpAt
    
    const order = await Order.findOne({ id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // Update fields
    if (status) order.status = status;
    if (price) order.price = price;
    if (dressType) order.dressType = dressType;
    if (pickedUpAt !== undefined) {  // NEW
      order.pickedUpAt = pickedUpAt ? new Date(pickedUpAt) : null;
    }
    
    await order.save();
    return res.json({ message: 'Order updated', order });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update order', error: err.message });
  }
};
```

**Features:**
- Handles `pickedUpAt` field in update requests
- Accepts null to clear the field
- Properly converts ISO timestamps to Date objects

#### 3. Other Functions - Unchanged
```javascript
- getAllOrders()      // Returns all orders with new fields
- getMyOrders()       // Returns user's orders (filters on backend)
- deleteOrder()       // Deletes orders (works with new fields)
```

---

## 3. API Endpoint Specifications

### Create Order
**Endpoint:** `POST /orders`

**Request Body:**
```json
{
  "userId": "user123",
  "price": 5000,
  "dressType": "Sherwani",
  "status": "pending",
  "measurements": {
    "shirt": {
      "length": "32",
      "chest": "40"
    },
    "trouser": {
      "length": "42"
    }
  },
  "createdAt": "2026-01-12T16:45:00.000Z",
  "pickedUpAt": null
}
```

**Response (201 Created):**
```json
{
  "message": "Order created",
  "order": {
    "id": "1234567890",
    "userId": "user123",
    "trackingNo": "BT-20260112-001",
    "price": 5000,
    "dressType": "Sherwani",
    "status": "pending",
    "userName": "Ahmed Khan",
    "userEmail": "ahmed@example.com",
    "measurements": { ... },
    "createdAt": "2026-01-12T16:45:00.000Z",
    "pickedUpAt": null,
    "_id": "..."
  }
}
```

### Update Order Status
**Endpoint:** `PUT /orders/:id`

**Request Body (Status Change to Ready):**
```json
{
  "status": "ready"
}
```

**Request Body (Mark as Picked Up):**
```json
{
  "status": "picked-up",
  "pickedUpAt": "2026-01-15T14:30:00.000Z"
}
```

**Response (200 OK):**
```json
{
  "message": "Order updated",
  "order": {
    "id": "1234567890",
    "status": "picked-up",
    "pickedUpAt": "2026-01-15T14:30:00.000Z",
    ...
  }
}
```

### Get User Orders
**Endpoint:** `GET /orders/my`

**Response (200 OK):**
```json
{
  "orders": [
    {
      "id": "1234567890",
      "userId": "user123",
      "trackingNo": "BT-20260112-001",
      "status": "ready",
      "createdAt": "2026-01-12T16:45:00.000Z",
      "pickedUpAt": null,
      ...
    }
  ]
}
```

---

## 4. Database Migration Notes

### For Existing Orders
If upgrading from the old schema, existing orders will:
1. Keep their current `createdAt` (already exists)
2. Have `pickedUpAt: null` by default
3. Status remains unchanged until explicitly updated

### Recommended Migration Script
```javascript
// Add to backend/scripts/ folder if needed
const Order = require('../models/Order');

exports.migrateOrders = async () => {
  try {
    // Add pickedUpAt to all orders that don't have it
    const result = await Order.updateMany(
      { pickedUpAt: { $exists: false } },
      { $set: { pickedUpAt: null } }
    );
    console.log('Migration complete:', result);
  } catch (err) {
    console.error('Migration failed:', err);
  }
};
```

---

## 5. Status Transition Rules

```
pending → cutting → stitching → ready → picked-up
```

**Backend Validation (Optional - Add if needed):**
```javascript
const validTransitions = {
  'pending': ['cutting'],
  'cutting': ['stitching'],
  'stitching': ['ready'],
  'ready': ['picked-up', 'stitching'],  // Allow fallback
  'picked-up': []  // Terminal state
};
```

---

## 6. Frontend-Backend Communication Flow

### Order Lifecycle Flow:

1. **Create Order**
   - Frontend sends: `{ userId, dressType, price, measurements, createdAt, pickedUpAt: null }`
   - Backend creates order with timestamps
   - Response includes all fields

2. **Update Status to Ready**
   - Frontend sends: `{ status: 'ready' }`
   - Backend updates order
   - Frontend triggers notification

3. **Mark as Picked Up**
   - Frontend sends: `{ status: 'picked-up', pickedUpAt: new Date().toISOString() }`
   - Backend updates order with timestamp
   - Frontend triggers user notification
   - Frontend removes order from dashboard

4. **Get User Orders**
   - Frontend fetches: `GET /orders/my`
   - Backend returns all user orders
   - Frontend filters out `status === 'picked-up'` for display

---

## 7. Error Handling

### Common Errors:
```javascript
// 400 Bad Request - Missing required fields
{ message: 'userId, price, and dressType are required' }

// 404 Not Found - Order doesn't exist
{ message: 'Order not found' }

// 500 Server Error - Database operation failed
{ message: 'Failed to update order', error: err.message }
```

---

## 8. Testing Checklist

- [ ] Create order with `createdAt` timestamp
- [ ] Verify `pickedUpAt` defaults to null
- [ ] Update order status to 'ready'
- [ ] Update order with `status: 'picked-up'` and `pickedUpAt` timestamp
- [ ] Fetch user orders and verify all fields present
- [ ] Test invalid status enum values (should fail)
- [ ] Test date parsing (ISO strings converted properly)
- [ ] Verify MongoDB stores dates correctly

---

## 9. Performance Considerations

- **Indexes:** Consider adding index to `userId` and `trackingNo` for faster queries
- **Timestamps:** Using MongoDB's native Date type for efficient sorting
- **Filtering:** Can filter by `pickedUpAt: { $ne: null }` for picked-up orders

### Optional Index Addition:
```javascript
orderSchema.index({ userId: 1 });
orderSchema.index({ trackingNo: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ pickedUpAt: 1 });
```

---

## 10. Summary

✅ Order model extended with 'picked-up' status and `pickedUpAt` field
✅ Create order controller accepts and stores timestamps
✅ Update order controller handles `pickedUpAt` updates
✅ API endpoints fully support complete lifecycle
✅ Database schema ready for production
✅ Backward compatible with existing orders
✅ Error handling in place

The backend is now fully equipped to support the complete "Picked Up" order lifecycle with proper timestamp tracking and status management.

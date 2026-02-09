const express = require('express');
const {
  createOrder,
  getAllOrders,
  getMyOrders,
  updateOrder,
  deleteOrder,
} = require('../controllers/order.controller');
const { verifyToken, adminOnly, userOnly } = require('../middleware/auth.middleware');

const router = express.Router();

// Admin: create order for a user
router.post('/', verifyToken, adminOnly, createOrder);

// Admin: list all orders
router.get('/', verifyToken, adminOnly, getAllOrders);

// User: list only their orders
router.get('/my', verifyToken, userOnly, getMyOrders);

// Admin: update order
router.put('/:id', verifyToken, adminOnly, updateOrder);

// Admin: delete order
router.delete('/:id', verifyToken, adminOnly, deleteOrder);

module.exports = router;

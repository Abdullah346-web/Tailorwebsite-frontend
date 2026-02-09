const express = require('express');
const { verifyToken, adminOnly } = require('../middleware/auth.middleware');
const { listUsers, deleteUser } = require('../controllers/user.controller');

const router = express.Router();

router.get('/', verifyToken, adminOnly, listUsers);
router.delete('/:id', verifyToken, adminOnly, deleteUser);

module.exports = router;

const User = require('../models/User');
const Order = require('../models/Order');
const SignupRequest = require('../models/SignupRequest');

exports.listUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).lean();
    // Remove hashed password from response, keep plainPassword
    const usersData = users.map(u => {
      const { password, ...userWithoutPassword } = u;
      return userWithoutPassword;
    });
    return res.json({ users: usersData });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ id, role: 'user' });
    if (!user) {
      return res.status(404).json({ message: 'User not found or not deletable' });
    }

    // Delete user
    await User.deleteOne({ id });

    // Delete related orders
    await Order.deleteMany({ userId: id });

    // Delete corresponding signup request (so user can re-signup)
    await SignupRequest.deleteOne({ email: user.email });

    return res.json({ message: 'User deleted', user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
};

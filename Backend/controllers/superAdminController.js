const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// ===============================
// LOGIN
// ===============================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: false, message: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ status: false, message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ status: false, message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    const refresh_token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      status: true,
      message: 'Login successful',
      data: {
        email: user.email,
        username: user.username,
        role: user.role,
        accessFeatures: user.accessFeatures,
        token,
        refresh_token,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

// ===============================
// GET ALL USERS
// ===============================
// exports.getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find({}, { password: 0, __v: 0 });
//     res.status(200).json({ status: true, data: users });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ status: false, message: 'Server error' });
//   }
// };

// ===============================
// GET SINGLE USER
// ===============================
// exports.getUserById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user = await User.findById(id, { password: 0, __v: 0 });
//     if (!user) return res.status(404).json({ status: false, message: 'User not found' });

//     res.status(200).json({ status: true, data: user });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ status: false, message: 'Server error' });
//   }
// };

// ===============================
// CREATE USER (direct, no signup)
// ===============================
exports.createUser = async (req, res) => {
  try {
    const { email, username, password, role, accessFeatures } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: false, message: 'Email and password required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ status: false, message: 'User already exists' });

    const user = new User({
      email,
      username,
      password,
      role: role || 'superadmin',
      accessFeatures: accessFeatures || [],
    });

    await user.save();

    res.status(201).json({
      status: true,
      message: 'User created successfully',
      data: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        accessFeatures: user.accessFeatures,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

// ===============================
// UPDATE USER
// ===============================
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, username, password, role, accessFeatures } = req.body;

    const updateData = { email, username, role, accessFeatures };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true, select: '-password -__v' });
    if (!updatedUser) return res.status(404).json({ status: false, message: 'User not found' });

    res.status(200).json({ status: true, message: 'User updated', data: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

// ===============================
// DELETE USER
// ===============================
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ status: false, message: 'User not found' });

    res.status(200).json({ status: true, message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

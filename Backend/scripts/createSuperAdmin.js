require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const connectDb = require('../config/db');

async function createSuperAdmin() {
  try {
    await connectDb();

    const existing = await User.findOne({ email: 'admin@example.com' });
    if (existing) {
      console.log('Superadmin already exists');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    const user = new User({
      username: 'admin',
      email: 'superadmin@example.com',
      password: hashedPassword,
      role: 'superadmin',
      accessFeatures: ['all'],
    });

    await user.save();
    console.log('Superadmin created successfully');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createSuperAdmin();

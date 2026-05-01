const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const seedUsers = async () => {
  await connectDB();
  try {
    // Check if exists
    let admin = await User.findOne({ email: 'admin@demo.com' });
    if (!admin) {
      await User.create({ name: 'Demo Admin', email: 'admin@demo.com', password: 'password', role: 'Admin' });
      console.log('Demo Admin created (admin@demo.com / password)');
    } else {
      console.log('Demo Admin already exists');
    }
    
    let member = await User.findOne({ email: 'member@demo.com' });
    if (!member) {
      await User.create({ name: 'Demo Member', email: 'member@demo.com', password: 'password', role: 'Member' });
      console.log('Demo Member created (member@demo.com / password)');
    } else {
      console.log('Demo Member already exists');
    }
    console.log('Database Seeded!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedUsers();

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;
    
    // If no URI is provided, or it's local, spin up in-memory DB
    if (!uri || uri.includes('localhost') || uri.includes('127.0.0.1')) {
      if (!uri) {
        console.warn('⚠️ No MONGO_URI provided in environment variables!');
      }
      console.log('Spinning up in-memory MongoDB for easy testing...');
      const mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

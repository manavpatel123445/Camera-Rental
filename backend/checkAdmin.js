const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/camera-rental');
    console.log('Connected to MongoDB');
    
    const Admin = require('./module/Admin');
    
    // Check if superadmin exists
    const admin = await Admin.findOne({ email: 'superadmin@camerarental.com' });
    console.log('Admin found:', admin);
    
    // List all admins
    const allAdmins = await Admin.find({});
    console.log('All admins:', allAdmins);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

connectDB();
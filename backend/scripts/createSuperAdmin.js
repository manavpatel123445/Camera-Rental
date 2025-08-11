import mongoose from 'mongoose';
import Admin from '../module/Admin.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const createSuperAdmin = async () => {
  try {
    // Connect to MongoDB using the correct environment variable name
    const mongoUri = process.env.MONGODB_URL || process.env.MONGO_URI || 'mongodb://localhost:27017/camera-rental';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Check if superadmin already exists
    const existingSuperAdmin = await Admin.findOne({ role: 'superadmin' });
    if (existingSuperAdmin) {
      console.log('Superadmin already exists:', existingSuperAdmin.email);
      console.log('Role:', existingSuperAdmin.role);
      console.log('Skipping creation of new superadmin.');
      process.exit(0);
    }

    // Check if admin with the email exists
    const existingEmail = await Admin.findOne({ email: 'superadmin@camerarental.com' });
    if (existingEmail) {
      console.log('Admin with email already exists:', existingEmail.email);
      console.log('Updating role to superadmin...');
      existingEmail.role = 'superadmin';
      await existingEmail.save();
      console.log('Updated existing admin to superadmin role');
      process.exit(0);
    }

    // Create superadmin
    const superAdminData = {
      username: 'superadmin',
      email: 'superadmin@camerarental.com',
      password: await bcrypt.hash('SuperAdmin@123', 12),
      firstName: 'Super',
      lastName: 'Admin',
      phone: '+1234567890',
      role: 'superadmin'
    };

    const superAdmin = new Admin(superAdminData);
    await superAdmin.save();

    console.log('Superadmin created successfully!');
    console.log('Email: superadmin@camerarental.com');
    console.log('Password: SuperAdmin@123');
    console.log('Please change the password after first login.');

  } catch (error) {
    console.error('Error creating superadmin:', error);
  } finally {
    await mongoose.disconnect();
  }
};

createSuperAdmin();
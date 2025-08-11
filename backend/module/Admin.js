import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    trim: true,
    default: "",
  },
  lastName: {
    type: String,
    trim: true,
    default: "",
  },
  phone: {
    type: String,
    trim: true,
    default: "",
  },
  bio: {
    type: String,
    trim: true,
    default: "",
  },
  dateOfBirth: {
    type: Date,
    default: null,
  },
  profileImage: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ['admin', 'superadmin'],
    default: 'admin'
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
import Admin from "../module/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import multer from "multer";
import path from "path";
import fs from "fs";
import User from "../module/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/profile-images';
    console.log('Upload directory:', uploadDir);
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      console.log('Creating upload directory');
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = 'admin-' + uniqueSuffix + path.extname(file.originalname);
    console.log('Generated filename:', filename);
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  console.log('File filter check:', file.originalname, file.mimetype);
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    console.log('File accepted');
    cb(null, true);
  } else {
    console.log('File rejected - not an image');
    cb(new Error('Only image files are allowed!'), false);
  }
};

export const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export const registerAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required." });
    }
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ message: "Admin with this email already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const admin = new Admin({ username, email, password: hashedPassword });
    await admin.save();
    res.status(201).json({ message: "Admin registered successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const token = jwt.sign({ id: admin._id, email: admin.email, role: "admin" }, JWT_SECRET, { expiresIn: "1d" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    res.json({ 
      token: token, // Include token in response for localStorage
      admin: { 
        username: admin.username, 
        email: admin.email, 
        firstName: admin.firstName || '',
        lastName: admin.lastName || '',
        phone: admin.phone || '',
        bio: admin.bio || '',
        dateOfBirth: admin.dateOfBirth || '',
        profileImage: admin.profileImage || '',
        role: "admin" 
      } 
    });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }
  try {
    const admin = await Admin.findOne({ email });
    if (admin) {
      const token = crypto.randomBytes(32).toString("hex");
      admin.resetPasswordToken = token;
      admin.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await admin.save();
      // In production, send email with token here
    }
    // Always return success for security
    res.json({ message: "If this email is registered, a password reset link will be sent." });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ message: "Token and new password are required." });
  }
  try {
    const admin = await Admin.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!admin) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }
    admin.password = await bcrypt.hash(password, 12);
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;
    await admin.save();
    res.json({ message: "Password has been reset successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password -resetPasswordToken -resetPasswordExpires');
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }
    res.json({
      username: admin.username,
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      phone: admin.phone,
      bio: admin.bio,
      dateOfBirth: admin.dateOfBirth,
      profileImage: admin.profileImage,
      role: "admin"
    });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username, email, firstName, lastName, phone, bio, dateOfBirth } = req.body;
    const updates = {};
    
    // Only update fields that are provided
    if (username !== undefined) updates.username = username;
    if (email !== undefined) updates.email = email;
    if (firstName !== undefined) updates.firstName = firstName;
    if (lastName !== undefined) updates.lastName = lastName;
    if (phone !== undefined) updates.phone = phone;
    if (bio !== undefined) updates.bio = bio;
    if (dateOfBirth !== undefined) updates.dateOfBirth = dateOfBirth;
    
    const admin = await Admin.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password -resetPasswordToken -resetPasswordExpires');
    
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }
    
    res.json({
      username: admin.username,
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      phone: admin.phone,
      bio: admin.bio,
      dateOfBirth: admin.dateOfBirth,
      profileImage: admin.profileImage,
      role: "admin"
    });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

export const uploadProfileImage = async (req, res) => {
  try {
    console.log('Upload request received:', req.file);
    console.log('User ID:', req.user.id);
    
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided." });
    }

    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    console.log('Admin found:', admin.username);
    console.log('File uploaded to:', req.file.path);

    // Delete old profile image if it exists
    if (admin.profileImage && admin.profileImage !== "") {
      const oldImagePath = admin.profileImage;
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
        console.log('Old image deleted:', oldImagePath);
      }
    }

    // Update admin with new profile image path
    admin.profileImage = req.file.path;
    await admin.save();

    console.log('Profile image updated successfully');

    res.json({
      message: "Profile image uploaded successfully",
      profileImage: admin.profileImage,
      username: admin.username,
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      phone: admin.phone,
      bio: admin.bio,
      role: "admin"
    });
  } catch (err) {
    console.error('Error in uploadProfileImage:', err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

export const deleteProfileImage = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    // Delete the image file if it exists
    if (admin.profileImage && admin.profileImage !== "") {
      if (fs.existsSync(admin.profileImage)) {
        fs.unlinkSync(admin.profileImage);
      }
    }

    // Remove the profile image path from database
    admin.profileImage = "";
    await admin.save();

    res.json({
      message: "Profile image deleted successfully",
      profileImage: "",
      username: admin.username,
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      phone: admin.phone,
      bio: admin.bio,
      role: "admin"
    });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['active', 'disabled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }
    const user = await User.findByIdAndUpdate(id, { status }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ message: `User status updated to ${status}.`, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};
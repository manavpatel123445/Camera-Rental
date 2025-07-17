import Admin from "../module/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

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
      admin: { username: admin.username, email: admin.email, role: "admin" } 
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
      role: "admin"
    });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const updates = {};
    if (username) updates.username = username;
    if (email) updates.email = email;
    
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
      role: "admin"
    });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};
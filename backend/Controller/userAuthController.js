import User from "../module/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";
import Order from "../module/Order.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Multer config for user profile images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/profile-images';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = 'user-' + uniqueSuffix + path.extname(file.originalname);
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

export const uploadUserProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided." });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    // Delete old image if exists
    if (user.avatar && user.avatar !== "") {
      const oldImagePath = user.avatar;
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    user.avatar = req.file.path;
    await user.save();
    res.json({
      message: "Profile image uploaded successfully",
      avatar: user.avatar,
      username: user.username,
      email: user.email
    });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields are required." });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered." });

    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required." });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid credentials." });

    if (user.status === 'disabled') {
      return res.status(403).json({ message: 'Your account is disabled. Please contact support.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials." });

    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username, role: "user" },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const updates = {};
    const { username, email, avatar, contact, description, address } = req.body;
    if (username !== undefined) updates.username = username;
    if (email !== undefined) updates.email = email;
    if (avatar !== undefined) updates.avatar = avatar;
    if (contact !== undefined) updates.contact = contact;
    if (description !== undefined) updates.description = description;
    if (address !== undefined) updates.address = address;
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated." });
    }
    const { items, total, startDate, endDate } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order items required." });
    }

    // Import Product model
    const Product = (await import('../module/Product.js')).default;

    // Check product availability and update quantities
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.name} not found.` });
      }
      if (product.quantity < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient quantity for ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}` 
        });
      }
    }

    // Create order
    const order = new Order({
      user: req.user.id,
      items,
      total,
      status: 'pending',
      startDate,
      endDate,
    });
    await order.save();

    // Update product quantities
    for (const item of items) {
      const product = await Product.findById(item.product);
      product.quantity -= item.quantity;
      
      // Mark as inactive if out of stock
      if (product.quantity <= 0) {
        product.quantity = 0;
        product.status = 'Inactive';
      }
      
      await product.save();
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findOne({ _id: orderId, user: req.user.id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    if (order.status === 'cancelled') {
      return res.status(400).json({ message: 'Order is already cancelled.' });
    }

    // Import Product model
    const Product = (await import('../module/Product.js')).default;

    // Restore product quantities
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.quantity += item.quantity;
        
        // Reactivate product if it was out of stock
        if (product.quantity > 0 && product.status === 'Inactive') {
          product.status = 'Active';
        }
        
        await product.save();
      }
    }

    order.status = 'cancelled';
    await order.save();
    res.json({ message: 'Order cancelled successfully.', order });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};
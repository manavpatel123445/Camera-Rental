import jwt from 'jsonwebtoken';
import Admin from '../module/Admin.js';

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export const superAdminAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: "No token provided, authorization denied." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-password');
    
    if (!admin) {
      return res.status(401).json({ message: "Token is not valid." });
    }

    if (admin.role !== 'superadmin') {
      return res.status(403).json({ message: "Access denied. Superadmin privileges required." });
    }

    req.user = admin;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid." });
  }
};
import express from "express";
import { 
  registerAdmin, 
  loginAdmin, 
  forgotPassword, 
  resetPassword, 
  getProfile, 
  updateProfile,
  uploadProfileImage,
  deleteProfileImage,
  upload,
  getAllUsers,
  updateUserStatus,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  getDashboardAnalytics,
  getOrderAnalytics,
  getUserAnalytics,
  createAdmin,
  getAllAdmins,
  updateAdminRole,
  deleteAdmin
} from "../Controller/adminController.js";
import { adminAuth } from "../middleware/authMiddleware.js";
import { superAdminAuth } from "../middleware/superAdminAuth.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/profile", adminAuth, getProfile);
router.patch("/profile", adminAuth, updateProfile);
router.post("/profile/image", adminAuth, upload.single('profileImage'), uploadProfileImage);
router.delete("/profile/image", adminAuth, deleteProfileImage);
router.get("/users", adminAuth, getAllUsers);
router.patch("/users/:id/status", adminAuth, updateUserStatus);
router.get("/orders", adminAuth, getAllOrders);
router.patch("/orders/:id/status", adminAuth, updateOrderStatus);
router.delete("/orders/:id", adminAuth, deleteOrder);

// Analytics routes
router.get("/analytics/dashboard", adminAuth, getDashboardAnalytics);
router.get("/analytics/orders", adminAuth, getOrderAnalytics);
router.get("/analytics/users", adminAuth, getUserAnalytics);

// Superadmin routes
router.post("/super/create-admin", superAdminAuth, createAdmin);
router.get("/super/admins", superAdminAuth, getAllAdmins);
router.patch("/super/admins/:id/role", superAdminAuth, updateAdminRole);
router.delete("/super/admins/:id", superAdminAuth, deleteAdmin);

export default router;
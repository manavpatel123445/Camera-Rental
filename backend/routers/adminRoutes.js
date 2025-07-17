import express from "express";
import { registerAdmin, loginAdmin, forgotPassword, resetPassword, getProfile, updateProfile } from "../Controller/adminController.js";
import { adminAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/profile", adminAuth, getProfile);
router.patch("/profile", adminAuth, updateProfile);

export default router;
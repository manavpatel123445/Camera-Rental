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
  upload
} from "../Controller/adminController.js";
import { adminAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/profile", adminAuth, getProfile);
router.patch("/profile", adminAuth, updateProfile);
router.post("/profile/image", adminAuth, upload.single('profileImage'), uploadProfileImage);
router.delete("/profile/image", adminAuth, deleteProfileImage);

export default router;
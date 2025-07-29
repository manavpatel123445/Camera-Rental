import express from "express";
import { registerUser, loginUser, updateUserProfile, upload, uploadUserProfileImage, createOrder, getUserOrders, cancelOrder } from "../Controller/userAuthController.js";
import { userAuth } from "../middleware/authMiddleware.js";
import User from '../module/User.js';

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
// Updated /profile route
router.get('/profile', userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.put("/profile", userAuth, updateUserProfile);
router.put("/profile/avatar", userAuth, upload.single("avatar"), uploadUserProfileImage);
router.post("/orders", userAuth, createOrder);
router.get("/orders", userAuth, getUserOrders);
router.patch("/orders/:id/cancel", userAuth, cancelOrder);

export default router; 
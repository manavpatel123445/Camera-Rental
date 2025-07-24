import express from "express";
import { registerUser, loginUser, getUserProfile, updateUserProfile, upload, uploadUserProfileImage, createOrder, getUserOrders, cancelOrder } from "../Controller/userAuthController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", auth, getUserProfile);
router.put("/profile", auth, updateUserProfile);
router.put("/profile/avatar", auth, upload.single("avatar"), uploadUserProfileImage);
router.post("/orders", auth, createOrder);
router.get("/orders", auth, getUserOrders);
router.patch("/orders/:id/cancel", auth, cancelOrder);

export default router; 
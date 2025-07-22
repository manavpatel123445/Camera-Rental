import express from "express";
import { registerUser, loginUser, getUserProfile, updateUserProfile, upload, uploadUserProfileImage } from "../Controller/userAuthController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", auth, getUserProfile);
router.put("/profile", auth, updateUserProfile);
router.put("/profile/avatar", auth, upload.single("avatar"), uploadUserProfileImage);

export default router; 
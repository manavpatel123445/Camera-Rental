import express from "express";
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, getProductStats } from "../Controller/productController.js";
import { adminAuth } from "../middleware/authMiddleware.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// Public
router.get("/", getAllProducts);
router.get("/stats", getProductStats);
router.get("/:id", getProductById);

// Admin only
router.post("/", adminAuth, upload.single("image"), createProduct);
router.put("/:id", adminAuth, upload.single('image'), updateProduct);
router.patch('/:id', adminAuth, upload.single('image'), updateProduct);
router.delete("/:id", adminAuth, deleteProduct);

export default router;
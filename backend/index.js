import express from "express";
import { connectDB } from "./db.js";
import adminRoutes from "./routers/adminRoutes.js";
import cors from "cors";
import productRoutes from "./routers/productRoutes.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import userAuthRoutes from "./routers/userAuthRoutes.js";
import reviewRoutes from './routers/reviewRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/user", userAuthRoutes);
app.use('/api', reviewRoutes);

// Error handling middleware for multer uploads
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ message: error.message });
  }
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({ message: error.message });
  }
  next(error);
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

app.get('/', (req, res) => {
  res.json({ message: 'Camera Rental API is running.' });
});

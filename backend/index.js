import express from "express";
import { connectDB } from "./db.js";
import adminRoutes from "./routers/adminRoutes.js";
import cors from "cors";
import productRoutes from "./routers/productRoutes.js";
import cookieParser from "cookie-parser";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

app.get('/', (req, res) => {
  res.json({ message: 'Camera Rental API is running.' });
});

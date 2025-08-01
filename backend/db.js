import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL;

export const connectDB = async () => {
  if (!MONGODB_URL) {
    console.error("❌ MONGODB_URL environment variable is not defined!");
    console.error("Please set the MONGODB_URL environment variable in your Render dashboard.");
    console.error("Go to your service → Environment → Add Environment Variable");
    console.error("Example: mongodb+srv://username:password@cluster.mongodb.net/database");
    process.exit(1);
  }
  
  try {
    console.log("🔗 Attempting to connect to MongoDB...");
    await mongoose.connect(MONGODB_URL);
    console.log("✅ Successfully connected to MongoDB");
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    console.error("Please check your MongoDB connection string and network connectivity.");
    process.exit(1);
  }
};

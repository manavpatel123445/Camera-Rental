import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL;

export const connectDB = async () => {
  if (!MONGODB_URL) {
    console.error("MONGODB_URL is not defined in .env file");
    process.exit(1);
  }
  try {
    await mongoose.connect(MONGODB_URL);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
};

import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true }, // e.g. camera, lens, etc.
  pricePerDay: { type: Number, required: true },
  description: { type: String },
  image: { type: String }, // URL or filename
  quantity: { type: Number, required: true, default: 1 },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Product = mongoose.model("Product", productSchema);
export default Product;
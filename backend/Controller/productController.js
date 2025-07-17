import Product from "../module/Product.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, category, pricePerDay, description, imageUrl, quantity } = req.body;
    if (!name || !category || !pricePerDay) {
      return res.status(400).json({ message: "Name, category, and pricePerDay are required." });
    }
    let image;
    if (req.file) {
      image = req.file.buffer;
    } else if (imageUrl) {
      image = imageUrl;
    } else {
      image = undefined;
    }
    const product = new Product({ name, category, pricePerDay, description, image, quantity });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updateFields = {};
    const { name, category, pricePerDay, description, imageUrl, quantity } = req.body;

    if (name !== undefined) updateFields.name = name;
    if (category !== undefined) updateFields.category = category;
    if (pricePerDay !== undefined) updateFields.pricePerDay = pricePerDay;
    if (description !== undefined) updateFields.description = description;
    if (quantity !== undefined) updateFields.quantity = quantity;

    if (req.file) {
      updateFields.image = req.file.buffer;
    } else if (imageUrl !== undefined) {
      updateFields.image = imageUrl;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.json({ message: "Product deleted." });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
}; 
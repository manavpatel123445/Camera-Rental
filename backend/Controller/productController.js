import Product from "../module/Product.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isDeleted: false });
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    console.log('Admin user:', req.user);
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);
    console.log('Request file:', req.file);
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
    console.log('Update Product Request:', { body: req.body, file: req.file, headers: req.headers });
    const updateFields = {};
    const { name, category, pricePerDay, description, imageUrl, quantity } = req.body;

    console.log('Image URL from request:', imageUrl);

    if (name !== undefined) updateFields.name = name;
    if (category !== undefined) updateFields.category = category;
    if (pricePerDay !== undefined) updateFields.pricePerDay = pricePerDay;
    if (description !== undefined) updateFields.description = description;
    if (quantity !== undefined) updateFields.quantity = quantity;

    if (req.file) {
      console.log('Using uploaded file for image');
      updateFields.image = req.file.buffer;
    } else if (imageUrl !== undefined) {
      console.log('Using image URL:', imageUrl);
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
    const productId = req.params.id;
    
    // Check if product is used in any orders (not deleted orders)
    const Order = (await import('../module/Order.js')).default;
    const ordersWithProduct = await Order.find({ 
      'items.product': productId,
      isDeleted: false,
      status: { $nin: ['cancelled'] }
    });
    
    if (ordersWithProduct.length > 0) {
      return res.status(400).json({ 
        message: "Cannot delete product: This product is used in active orders.",
        orderCount: ordersWithProduct.length
      });
    }
    
    // Soft delete the product
    const product = await Product.findByIdAndUpdate(
      productId,
      { 
        isDeleted: true, 
        deletedAt: new Date(),
        status: "Inactive"
      },
      { new: true }
    );
    
    if (!product) return res.status(404).json({ message: "Product not found." });
    
    res.json({ message: "Product soft deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

export const getProductStats = async (req, res) => {
  try {
    const products = await Product.find({ isDeleted: false });
    const total = products.length;
    const cameras = products.filter(p => p.category?.toLowerCase() === 'camera').length;
    const lenses = products.filter(p => p.category?.toLowerCase() === 'lens').length;
    const accessories = products.filter(p => p.category?.toLowerCase().includes('accessor')).length;
    res.json({ total, cameras, lenses, accessories });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};
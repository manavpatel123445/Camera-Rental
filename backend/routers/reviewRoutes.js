import express from 'express';
import Review from '../module/Review.js';
import Product from '../module/Product.js';
import { userAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all reviews for a product
router.get('/products/:id/reviews', async (req, res) => {
  try {
    console.log('Fetching reviews for product:', req.params.id); // Debug log
    const reviews = await Review.find({ product: req.params.id }).populate('user', 'username');
    res.json(reviews);
  } catch (err) {
    console.error('Error fetching reviews:', err); // Error log
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

// Add a review to a product (user must be logged in)
router.post('/products/:id/reviews', userAuth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = new Review({
      product: req.params.id,
      user: req.user._id,
      rating,
      comment
    });
    await review.save();
    await review.populate('user', 'username');
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Error adding review' });
  }
});

export default router; 
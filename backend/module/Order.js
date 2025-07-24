import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      name: String,
      pricePerDay: Number,
      quantity: Number,
      image: String,
    }
  ],
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'shipped', 'completed', 'cancelled'], default: 'pending' },
  startDate: { type: Date },
  endDate: { type: Date },
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
export default Order; 
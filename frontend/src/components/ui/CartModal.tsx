import React from 'react';
import { Button } from './Button';
import { FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface CartItem {
  _id: string;
  name: string;
  pricePerDay: number;
  quantity: number;
  image?: string;
  rentalDays?: number;
}

interface CartModalProps {
  open: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemove: (id: string) => void;
  total: number;
  onUpdateQuantity?: (id: string, qty: number) => void;
  onUpdateRentalDays?: (id: string, days: number) => void;
}

const rentalOptions = [1, 2, 3, 5, 7, 14, 30];
const TAX_RATE = 0;

const CartModal: React.FC<CartModalProps> = ({ open, onClose, cart, onRemove, onUpdateQuantity, onUpdateRentalDays }) => {
  if (!open) return null;
  const subtotal = cart.reduce((sum, item) => sum + (item.pricePerDay || 0) * item.quantity * (item.rentalDays || 1), 0);
  const tax = subtotal * TAX_RATE;
  const grandTotal = subtotal + tax;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0  bg-opacity-60 flex items-center justify-center z-60">
      <div className="bg-[#232136] rounded-2xl shadow-lg p-8 w-full max-w-2xl relative">
        <button
          className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-purple-400"
          onClick={onClose}
          aria-label="Close cart"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6 text-white">Your Cart</h2>
        {cart.length === 0 ? (
          <div className="text-gray-400">Your cart is empty.</div>
        ) : (
          <>
            <div className="flex flex-col gap-6 mb-8 max-h-80 overflow-y-auto pr-2">
              {cart.map(item => (
                <div key={item._id} className="bg-[#1E293B] rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
                  <div className="w-24 h-24 flex-shrink-0 bg-white rounded-lg flex items-center justify-center overflow-hidden mb-4 md:mb-0">
                    {item.image && (
                      <img src={item.image.startsWith('http') ? item.image : `http://localhost:3000/${item.image}`} alt={item.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col gap-2 w-full">
                    <div className="font-bold text-white text-lg mb-1">{item.name}</div>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">Quantity:</span>
                        <button
                          className="px-2 py-1 bg-[#334155] text-white rounded hover:bg-purple-600"
                          onClick={() => onUpdateQuantity && onUpdateQuantity(item._id, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                        >-</button>
                        <span className="px-2 text-white font-bold">{item.quantity}</span>
                        <button
                          className="px-2 py-1 bg-[#334155] text-white rounded hover:bg-purple-600"
                          onClick={() => onUpdateQuantity && onUpdateQuantity(item._id, item.quantity + 1)}
                        >+</button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">Rental Days:</span>
                        <select
                          className="bg-[#334155] text-white rounded px-2 py-1"
                          value={item.rentalDays || 1}
                          onChange={e => onUpdateRentalDays && onUpdateRentalDays(item._id, Number(e.target.value))}
                        >
                          {rentalOptions.map(opt => (
                            <option key={opt} value={opt}>{opt} day{opt > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="text-gray-400 text-sm">${item.pricePerDay}/day × {item.quantity} × {item.rentalDays || 1} day(s)</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="font-bold text-white text-lg">${item.pricePerDay * item.quantity * (item.rentalDays || 1)}</div>
                    <button
                      className="text-red-400 hover:text-red-600 text-xl"
                      onClick={() => onRemove(item._id)}
                      aria-label="Remove from cart"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* Order Summary */}
            <div className="bg-[#1E293B] rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-white mb-4">Order Summary</h3>
              <div className="flex flex-col gap-2 text-white">
                <div className="flex justify-between"><span>Total Items:</span><span>{totalItems}</span></div>
                <div className="flex justify-between"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Tax (10%):</span><span>${tax.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-lg mt-2"><span>Total:</span><span>${grandTotal.toFixed(2)}</span></div>
              </div>
            </div>
            <Link to= "/checkout" >
            <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg w-full text-lg">
              Proceed to Checkout
            </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default CartModal; 
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { type  RootState } from '../../APP/store';
import { addToCart, removeFromCart, updateQuantity, clearCart } from '../../APP/cart/cartSlice';
import { Button } from './Button';

const CartTest: React.FC = () => {
  const cart = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  const testProduct = {
    _id: 'test-product-1',
    name: 'Test Camera',
    pricePerDay: 50,
    quantity: 1,
    image: 'https://via.placeholder.com/150',
    rentalDays: 1,
  };

  const handleAddTestProduct = () => {
    dispatch(addToCart(testProduct));
  };

  const handleRemoveTestProduct = () => {
    dispatch(removeFromCart('test-product-1'));
  };

  const handleUpdateQuantity = () => {
    dispatch(updateQuantity({ id: 'test-product-1', quantity: 2 }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-bold mb-4">Cart Test</h3>
      
      <div className="space-y-2 mb-4">
        <Button onClick={handleAddTestProduct} className="mr-2">
          Add Test Product
        </Button>
        <Button onClick={handleRemoveTestProduct} className="mr-2">
          Remove Test Product
        </Button>
        <Button onClick={handleUpdateQuantity} className="mr-2">
          Update Quantity
        </Button>
        <Button onClick={handleClearCart}>
          Clear Cart
        </Button>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold mb-2">Cart Items ({cart.length}):</h4>
        {cart.length === 0 ? (
          <p className="text-gray-500">Cart is empty</p>
        ) : (
          <ul className="space-y-2">
            {cart.map((item, index) => (
              <li key={index} className="text-sm">
                {item.name} - Qty: {item.quantity} - ${item.pricePerDay}/day
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t pt-4 mt-4">
        <h4 className="font-semibold mb-2">Cart Total:</h4>
        <p className="text-lg font-bold">
          ${cart.reduce((sum, item) => sum + (item.pricePerDay || 0) * item.quantity * (item.rentalDays || 1), 0).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default CartTest; 
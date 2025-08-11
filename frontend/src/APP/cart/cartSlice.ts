import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  _id: string;
  name: string;
  pricePerDay: number;
  quantity: number;
  image?: string;
  rentalDays?: number;
  pickupDate?: string;
  dropoffDate?: string;
}

interface CartState {
  items: CartItem[];
}

const loadCartFromStorage = (): CartItem[] => {
  try {
    const data = localStorage.getItem('cart');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (cart: CartItem[]) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  // eslint-disable-next-line no-empty
  } catch {}
};

const initialState: CartState = {
  items: loadCartFromStorage(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(item => item._id === action.payload._id);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push({ ...action.payload });
      }
      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item._id !== action.payload);
      saveCartToStorage(state.items);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(i => i._id === action.payload.id);
      if (item) {
        // For now, we'll allow the update but the actual validation happens in components
        item.quantity = Math.max(1, action.payload.quantity);
      }
      saveCartToStorage(state.items);
    },
    updateRentalDays: (state, action: PayloadAction<{ id: string; rentalDays: number }>) => {
      const item = state.items.find(i => i._id === action.payload.id);
      if (item) {
        item.rentalDays = action.payload.rentalDays;
        if (item.rentalDays! < 1) item.rentalDays = 1;
      }
      saveCartToStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
      // Don't clear dates here - they should persist for future rentals
      // Dates will only be cleared after successful order completion
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, updateRentalDays, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
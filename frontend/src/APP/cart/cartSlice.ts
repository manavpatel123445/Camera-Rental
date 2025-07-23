import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  _id: string;
  name: string;
  pricePerDay: number;
  quantity: number;
  image?: string;
  rentalDays?: number;
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
        item.quantity = action.payload.quantity;
        if (item.quantity < 1) item.quantity = 1;
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
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, updateRentalDays, clearCart } = cartSlice.actions;
export default cartSlice.reducer; 
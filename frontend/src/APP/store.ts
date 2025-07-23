import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import userAuthReducer from './userAuth/userAuthSlice';
import productReducer from './products/productSlice';
import cartReducer from './cart/cartSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer, // admin
    userAuth: userAuthReducer, // user
    products: productReducer, // products
    cart: cartReducer, // cart
    // ...other reducers
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import userAuthReducer from './userAuth/userAuthSlice';
import productReducer from './products/productSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer, // admin
    userAuth: userAuthReducer, // user
    products: productReducer, // products
    // ...other reducers
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import userAuthReducer from './userAuth/userAuthSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer, // admin
    userAuth: userAuthReducer, // user
    // ...other reducers
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

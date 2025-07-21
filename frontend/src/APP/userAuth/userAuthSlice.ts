import { createSlice, type  PayloadAction } from '@reduxjs/toolkit';

interface User {
  username: string;
  email: string;
  token: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UserAuthState {
  user: User | null;
}

const loadUserFromStorage = () => {
  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error loading user from storage:', error);
    return null;
  }
};

const initialState: UserAuthState = {
  user: loadUserFromStorage(),
};

const userAuthSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout(state) {
      state.user = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
});

export const { setUser, logout } = userAuthSlice.actions;
export default userAuthSlice.reducer; 
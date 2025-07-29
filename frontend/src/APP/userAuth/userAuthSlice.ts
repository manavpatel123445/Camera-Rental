import { createSlice, type  PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface User {
  username: string;
  email: string;
  token: string;
  createdAt?: string;
  updatedAt?: string;
  avatar?: string;
  role?: string;
  contact?: string;
  description?: string;
  address?: Address;
}

interface UserAuthState {
  user: User | null;
}

const loadUserFromStorage = () => {
  try {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (userData) {
      const user = JSON.parse(userData);
      if (!user.token && token) {
        user.token = token;
      }
      return user;
    }
    return null;
  } catch (error) {
    console.error('Error loading user from storage:', error);
    return null;
  }
};

const initialState: UserAuthState = {
  user: loadUserFromStorage(),
};

export const fetchUserProfile = createAsyncThunk(
  'userAuth/fetchUserProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { userAuth: UserAuthState };
      const token = state.userAuth.user?.token;
      const res = await fetch('http://localhost:3000/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return rejectWithValue('Unauthorized');
      }
      if (!res.ok) throw new Error('Failed to fetch profile');
      return await res.json();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'userAuth/updateUserProfile',
  async (profile: Partial<User>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { userAuth: UserAuthState };
      const token = state.userAuth.user?.token;
      const res = await fetch('http://localhost:3000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      return await res.json();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const userAuthSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
      if (action.payload.token) {
        localStorage.setItem('token', action.payload.token);
      }
    },
    logout(state) {
      state.user = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      });
  },
});

export const { setUser, logout } = userAuthSlice.actions;
export default userAuthSlice.reducer; 
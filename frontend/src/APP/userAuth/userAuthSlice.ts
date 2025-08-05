import { createSlice, type  PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface User {
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
      const token = state.userAuth.user?.token || localStorage.getItem('token');
      console.log('FETCH PROFILE TOKEN:', token); // Debug: log the token being sent
      const res = await fetch('https://camera-rental-ndr0.onrender.com/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include'
      });
      if (res.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return rejectWithValue({ error: 'Unauthorized', statusCode: 401 });
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
      const token = state.userAuth.user?.token || localStorage.getItem('token');
      
      console.log('Current state user:', state.userAuth.user); // Debug: log current user state
      console.log('Token from state or localStorage:', token); // Debug: log token
      
      if (!token) {
        console.error('Authentication token missing');
        return rejectWithValue('Authentication token missing');
      }
      
      console.log('UPDATE PROFILE DATA:', profile); // Debug: log the profile data being sent
      console.log('UPDATE PROFILE DATA JSON:', JSON.stringify(profile)); // Debug: log stringified data
      
      const res = await fetch('https://camera-rental-ndr0.onrender.com/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
        credentials: 'include'
      });
      
      console.log('Response status:', res.status); // Debug: log response status
      console.log('Response headers:', Object.fromEntries([...res.headers.entries()])); // Debug: log response headers
      
      if (res.status === 401) {
        console.error('Unauthorized access - clearing tokens');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return rejectWithValue({ error: 'Unauthorized', statusCode: 401 });
      }
      
      if (!res.ok) {
        const errorText = await res.text(); // Get raw response text first
        console.error('Profile update error raw response:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
          console.error('Profile update error parsed:', errorData);
        } catch (parseErr) {
          console.error('Failed to parse error response:', parseErr);
          errorData = { message: 'Server error: ' + res.status };
        }
        
        return rejectWithValue(errorData.message || 'Failed to update profile');
      }
      
      const responseText = await res.text(); // Get raw response text first
      console.log('Profile update raw response:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('PROFILE UPDATE RESPONSE parsed:', data);
      } catch (parseErr) {
        console.error('Failed to parse success response:', parseErr);
        return rejectWithValue('Invalid response from server');
      }
      
      return data;
    } catch (err: any) {
      console.error('Profile update exception:', err);
      return rejectWithValue(err.message || 'An error occurred while updating profile');
    }
  }
);

const userAuthSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      // Persist user and token to localStorage
      localStorage.setItem('user', JSON.stringify(action.payload));
      if (action.payload.token) {
        localStorage.setItem('token', action.payload.token);
      }
    },
    logout(state) {
      state.user = null;
      // Ensure all user-related data is removed from localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      // Force a page reload to clear any cached state
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        // Clear user state when authentication fails
        if (action.payload && typeof action.payload === 'object' && 'statusCode' in action.payload && action.payload.statusCode === 401) {
          state.user = null;
        }
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
        console.log('updateUserProfile.fulfilled - payload:', action.payload);
        // Make sure we preserve the token from the current state
        const token = state.user?.token || localStorage.getItem('token');
        state.user = { ...action.payload, token };
        localStorage.setItem('user', JSON.stringify(state.user));
        console.log('Updated user state:', state.user);
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        console.error('updateUserProfile.rejected - payload:', action.payload);
        console.error('updateUserProfile.rejected - error:', action.error);
        // Handle specific error cases if needed
      });
  },
});

export const { setUser, logout } = userAuthSlice.actions;
export default userAuthSlice.reducer;
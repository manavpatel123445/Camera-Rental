import { createSlice } from '@reduxjs/toolkit';

interface User {
  username?: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  profileImage?: string;
}

interface AuthState {
  user: User | null;
}

// Load user data from localStorage on initialization
const loadUserFromStorage = () => {
  try {
    const userData = localStorage.getItem('adminProfile');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error loading user from storage:', error);
    return null;
  }
};

const initialState: AuthState = {
  user: loadUserFromStorage(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAdminUser: (state, action: { payload: User }) => {
      state.user = action.payload;
      // Save to localStorage for persistence
      try {
        localStorage.setItem('adminProfile', JSON.stringify(action.payload));
      } catch (error) {
        console.error('Error saving user to storage:', error);
      }
    },
    logout: (state) => {
      state.user = null;
      // Clear localStorage
      localStorage.removeItem('adminProfile');
      localStorage.removeItem('token');
    },
  },
});

export const { setAdminUser, logout } = authSlice.actions;
export default authSlice.reducer;

// Thunk to fetch admin profile
export const fetchAdminProfile = () => async (dispatch: any) => {
  const token = localStorage.getItem('token');
  if (!token) return;
  try {
    const res = await fetch('http://localhost:3000/api/admin/profile', {
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include', // Include cookies in the request
    });
    if (res.ok) {
      const data = await res.json();
      dispatch(setAdminUser(data));
    } else if (res.status === 401) {
      dispatch(logout());
      localStorage.removeItem('token');
    }
  } catch (err) {
    console.error('Error fetching profile:', err);
    // Optionally handle error
  }
};

// Thunk to login and fetch complete profile
export const loginAndFetchProfile = (email: string, password: string) => async (dispatch: any) => {
  try {
    const response = await fetch("http://localhost:3000/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }
    
    // Save token
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    
    // Fetch complete profile data
    const profileRes = await fetch('http://localhost:3000/api/admin/profile', {
      headers: { Authorization: `Bearer ${data.token}` },
      credentials: 'include',
    });
    
    if (profileRes.ok) {
      const profileData = await profileRes.json();
      dispatch(setAdminUser(profileData));
    } else {
      // If profile fetch fails, use basic login data
      dispatch(setAdminUser(data.admin));
    }
    
    return { success: true };
  } catch (error) {
    throw error;
  }
};
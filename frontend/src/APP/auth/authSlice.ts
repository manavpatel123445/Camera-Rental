import { createSlice } from '@reduxjs/toolkit';

interface User {
  username?: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAdminUser: (state, action: { payload: User }) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
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
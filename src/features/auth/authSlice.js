import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('role') || null, // 'customer' | 'driver' | 'admin'
  profile: JSON.parse(localStorage.getItem('profile') || 'null'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, role, profile } = action.payload;
      state.token = token;
      state.role = role;
      state.profile = profile;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('profile', JSON.stringify(profile));
    },
    updateProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
      localStorage.setItem('profile', JSON.stringify(state.profile));
    },
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.profile = null;
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('profile');
    },
  },
});

export const { setCredentials, updateProfile, logout } = authSlice.actions;
export default authSlice.reducer;

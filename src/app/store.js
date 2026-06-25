import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import rideReducer from '../features/ride/rideSlice';
import walletReducer from '../features/wallet/walletSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ride: rideReducer,
    wallet: walletReducer,
  },
});

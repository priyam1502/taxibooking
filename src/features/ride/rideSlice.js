import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeRide: null,
  driverLocation: null, // { lat, lng } - live updates via socket
  vehicles: [],
  fareEstimate: null,
};

const rideSlice = createSlice({
  name: 'ride',
  initialState,
  reducers: {
    setActiveRide: (state, action) => {
      state.activeRide = action.payload;
    },
    updateDriverLocation: (state, action) => {
      state.driverLocation = action.payload;
    },
    setVehicles: (state, action) => {
      state.vehicles = action.payload;
    },
    setFareEstimate: (state, action) => {
      state.fareEstimate = action.payload;
    },
    clearRide: (state) => {
      state.activeRide = null;
      state.driverLocation = null;
      state.fareEstimate = null;
    },
  },
});

export const { setActiveRide, updateDriverLocation, setVehicles, setFareEstimate, clearRide } =
  rideSlice.actions;
export default rideSlice.reducer;

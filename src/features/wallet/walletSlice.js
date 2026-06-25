import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  balance: 0,
  pendingBalance: 0,
  transactions: [],
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWallet: (state, action) => {
      state.balance = action.payload.balance;
      state.pendingBalance = action.payload.pendingBalance || 0;
      state.transactions = action.payload.transactions || [];
    },
  },
});

export const { setWallet } = walletSlice.actions;
export default walletSlice.reducer;

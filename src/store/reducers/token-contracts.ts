import { createSlice } from '@reduxjs/toolkit'

export const tokenContracts = createSlice({
  name: 'tokenContracts',
  initialState: {
    contracts: [],
    symbols: [],
    balances: [0, 0]
  },
  reducers: {
    setContracts: (state, action) => {
      state.contracts = action.payload;
    },
    setSymbols: (state, action) => {
      state.symbols = action.payload;
    },
    setBalances: (state, action) => {
      state.balances = action.payload;
    }
  }
});

export const {
  setContracts,
  setSymbols,
  setBalances
} = tokenContracts.actions;

export default tokenContracts.reducer;
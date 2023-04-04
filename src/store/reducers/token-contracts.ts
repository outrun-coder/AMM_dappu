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
      state.contracts = action.payload
    }
  }
});

export const {
  setContracts
} = tokenContracts.actions;

export default tokenContracts.reducer;
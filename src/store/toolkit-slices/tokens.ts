import { createSlice } from '@reduxjs/toolkit'

export const tokensReducerSlice = createSlice({
  name: 'tokens_reducer',
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

const { actions, reducer } = tokensReducerSlice;

export const {
  setContracts,
  setSymbols,
  setBalances
} = actions;

export default reducer;
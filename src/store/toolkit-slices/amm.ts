import { createSlice } from '@reduxjs/toolkit'

export const ammReducerSlice = createSlice({
  name: 'amm_reducer',
  initialState: {
    contract: null,
    shares: 0,
    swaps: [],
    
  },
  reducers: {
    setAmmContract: (state, action) => {
      state.contract = action.payload;
    },
    setShares: (state, action) => {
      state.shares = action.payload;
    }
  }
});

const { actions, reducer } = ammReducerSlice;

export const {
  setAmmContract,
  setShares
} = actions;

export default reducer;
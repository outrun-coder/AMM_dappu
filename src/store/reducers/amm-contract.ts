import { createSlice } from '@reduxjs/toolkit'

export const ammContract = createSlice({
  name: 'ammContract',
  initialState: {
    contract: null,
    shares: 0,
    swaps: [],
    
  },
  reducers: {
    setAmmContract: (state, action) => {
      state.contract = action.payload;
    },
  }
});

export const {
  setAmmContract
} = ammContract.actions;

export default ammContract.reducer;
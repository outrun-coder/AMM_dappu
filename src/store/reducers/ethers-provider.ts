import { createSlice } from '@reduxjs/toolkit'

export const ethersProvider = createSlice({
  name: 'ethersProvider',
  initialState: {
    connection: null,
    chainId: null,
    account: null
  },
  reducers: {
    setAccount: (state, action) => {
      state.account = action.payload;
    }
  }
});

export const { setAccount } = ethersProvider.actions;

export default ethersProvider.reducer;
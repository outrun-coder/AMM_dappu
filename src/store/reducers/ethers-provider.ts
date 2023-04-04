import { createSlice } from '@reduxjs/toolkit'

export const ethersProvider = createSlice({
  name: 'ethersProvider',
  initialState: {
    connection: null,
    chainId: null,
    account: null
  },
  reducers: {
    setConnection: (state, action) => {
      state.connection = action.payload;
    },
    setNetwork: (state, action) => {
      state.chainId = action.payload;
    },
    setAccount: (state, action) => {
      state.account = action.payload;
    }
  }
});

export const {
  setConnection,
  setNetwork,
  setAccount
} = ethersProvider.actions;

export default ethersProvider.reducer;
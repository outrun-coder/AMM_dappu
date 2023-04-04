import { createSlice } from '@reduxjs/toolkit'

export const ethersProvider = createSlice({
  name: 'ethersProvider',
  initialState: {
    connection: null,
    chainId: null,
    account: null
  },
  reducers: {
    
  }
});

export default ethersProvider.reducer;
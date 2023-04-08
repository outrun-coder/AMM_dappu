import { createSlice } from '@reduxjs/toolkit'

export const networkReducerSlice = createSlice({
  name: 'network_reducer',
  initialState: {
    connection: null, // or === "provider"
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

const { actions, reducer } = networkReducerSlice;

export const {
  setConnection,
  setNetwork,
  setAccount
} = actions;

export default reducer;
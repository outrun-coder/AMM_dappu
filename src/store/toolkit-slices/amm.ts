import { createSlice } from '@reduxjs/toolkit'

export const ammReducerSlice = createSlice({
  name: 'amm_reducer',
  initialState: {
    contract: null,
    shares: 0,
    swaps: [],
    swapRequest: {
      isRunning: false,
      isSuccess: 0,
      transactionHash: null
    }
  },
  reducers: {
    setAmmContract: (state, action) => {
      state.contract = action.payload;
    },
    setShares: (state, action) => {
      state.shares = action.payload;
    },
    startSwapRequest: (state, _action) => {
      state.swapRequest = {
        // Next run reset...
        isRunning: true,
        isSuccess: 0,
        transactionHash: null
      };
    }
  }
});

const { actions, reducer } = ammReducerSlice;

export const {
  setAmmContract,
  setShares,
  startSwapRequest
} = actions;

export default reducer;
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
      transactionHash: null,
      error: null
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
        transactionHash: null,
        error: null
      };
    },
    finishSwapRequest: (state, action) => {
      const { transactionHash } = action.payload;
      state.swapRequest = {
        // SUCCESS
        isRunning: false,
        isSuccess: 1,
        transactionHash,
        error: null
      };
    },
    failSwapRequest: (state, action) => {
      const { error } = action.payload;
      state.swapRequest = {
        // FAIL ( ! )
        isRunning: false,
        isSuccess: -1,
        transactionHash: null,
        error
      };
    }
  }
});

const { actions, reducer } = ammReducerSlice;

export const {
  setAmmContract,
  setShares,
  startSwapRequest,
  finishSwapRequest,
  failSwapRequest
} = actions;

export default reducer;
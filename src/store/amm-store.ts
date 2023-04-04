import { configureStore } from "@reduxjs/toolkit";
import ethersProvider from "./reducers/ethers-provider";
import tokenContracts from "./reducers/token-contracts";


export const ammStore = configureStore({
  reducer: {
    ethersProvider,
    tokenContracts
  },
  middleware: getDefaultMiddleware => 
    getDefaultMiddleware({
      serializableCheck: false
    })
});
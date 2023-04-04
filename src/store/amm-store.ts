import { configureStore } from "@reduxjs/toolkit";
import ethersProvider from "./reducers/ethers-provider";
import tokenContracts from "./reducers/token-contracts";
import ammContract from "./reducers/amm-contract";


export const ammStore = configureStore({
  reducer: {
    ethersProvider,
    tokenContracts,
    ammContract
  },
  middleware: getDefaultMiddleware => 
    getDefaultMiddleware({
      serializableCheck: false
    })
});
import { configureStore } from "@reduxjs/toolkit";
import ethersProvider from "./reducers/ethers-provider";


export const ammStore = configureStore({
  reducer: {
    ethersProvider
  },
  middleware: getDefaultMiddleware => 
    getDefaultMiddleware({
      serializableCheck: false
    })
});
import { configureStore } from "@reduxjs/toolkit";
import networkReducer from "./toolkit-slices/network";
import tokensReducer from "./toolkit-slices/tokens";
import ammReducer from "./toolkit-slices/amm";


export const ammStore = configureStore({
  reducer: {
    network: networkReducer,
    tokens: tokensReducer,
    amm: ammReducer
  },
  middleware: getDefaultMiddleware => 
    getDefaultMiddleware({
      serializableCheck: false
    })
});
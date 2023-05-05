import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import { userSlice } from "./auth/UserSlice";
import { userActionSlice } from "./userActions/userActionSlice";

const makeStore = () =>
  configureStore({
    reducer: {
      user: userSlice.reducer,
      useractions:userActionSlice.reducer
    },
    devTools: true,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
// middleware: (getDefaultMiddleware)=>
// getDefaultMiddleware({
//       serializableCheck: false
//   }),
export const wrapper = createWrapper(makeStore);

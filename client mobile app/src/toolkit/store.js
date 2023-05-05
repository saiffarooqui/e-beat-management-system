import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./auth/UserSlice";
import { beatSlice } from "./beat/BeatAreaSlice";
export default configureStore({
  //combining reducers
  reducer: {
    user: userSlice.reducer,
    beat: beatSlice.reducer
  },
  // middleware: (getDefaultMiddleware)=>
  // getDefaultMiddleware({
  //       serializableCheck: false
  //   }),
  
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     serializableCheck: {
  //       ignoredActions: ["[TypeError: Network request failed]"],
  //       // ignoredActionPaths: ["property"],
  //       // ignoredPaths: ["reducer.property"],
  //     },
  //   }),
});

import { configureStore } from "@reduxjs/toolkit";

import appSlice from "@/features/app/appSlice";
import authSlice from "@/features/auth/authSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    app: appSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

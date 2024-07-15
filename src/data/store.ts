import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./appSlice";
import { useDispatch, useStore } from "react-redux";

export const makeStore = () =>
  configureStore({
    reducer: {
      app: appReducer,
    },
  });

export const store = makeStore();

if (typeof window !== "undefined") {
  (window as any).store = store;
}

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppStore = useStore.withTypes<AppStore>();

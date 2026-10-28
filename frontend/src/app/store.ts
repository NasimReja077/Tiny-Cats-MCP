import { configureStore } from "@reduxjs/toolkit";
import { catsApi } from "../features/api/catsApi";
import favoritesReducer from "../features/favorites/favoritesSlice";

export const store = configureStore({
  reducer: {
    [catsApi.reducerPath]: catsApi.reducer,
    favorites: favoritesReducer,
  },
  middleware: (getDefault) => getDefault().concat(catsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

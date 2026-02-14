// Redux store

import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../services/api";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "../features/auth/authSlice";
import cartReducer from "../features/cart/cartSlice";
import favoritesReducer from "../features/favorites/favoriteSlice";
import { getFavoritesFromLocalStorage } from "../../Utils/localStorage";
import shopReducer from "../features/shop/shopSlice";
const initialFavorites = getFavoritesFromLocalStorage();

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    favorites: favoritesReducer,
    cart: cartReducer,
    shop: shopReducer,
  },
  preloadedState: {
    favorites: initialFavorites,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

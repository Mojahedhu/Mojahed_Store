import { createSlice } from "@reduxjs/toolkit";
import type { Product } from "../product/productsTypes";

const initialState: Product[] = [];
const favoritesSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    addToFavorites: (state, action: { payload: Product }) => {
      // check if the product not already favorites
      if (!state.some((product) => product._id === action.payload._id)) {
        state.push(action.payload);
      }
    },
    removeFromFavorites: (state, action: { payload: Product }) => {
      // remove the product with matching _id
      return state.filter((product) => product._id !== action.payload._id);
    },

    setFavorites: (_state, action: { payload: Product[] }) => {
      // Set the favorite from localStorage
      return action.payload;
    },
  },
});

export const { addToFavorites, removeFromFavorites, setFavorites } =
  favoritesSlice.actions;
export default favoritesSlice.reducer;

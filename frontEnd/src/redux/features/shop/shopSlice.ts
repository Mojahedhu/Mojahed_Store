import { createSlice } from "@reduxjs/toolkit";
import type { ShopState } from "./shopTypes";

const initialState: ShopState = {
  checked: [],
  radio: "50000",
  brand: "",
};

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    setChecked: (state, action: { payload: string[] }) => {
      state.checked = action.payload;
    },
    setRadio: (state, action: { payload: string }) => {
      state.radio = action.payload;
    },
    setBrand: (state, action: { payload: string }) => {
      state.brand = action.payload;
    },
    resetFilter: (state) => {
      state.checked = [];
      state.radio = "5000";
      state.brand = "";
    },
  },
});
export const { setChecked, setRadio, resetFilter, setBrand } =
  shopSlice.actions;

export default shopSlice.reducer;

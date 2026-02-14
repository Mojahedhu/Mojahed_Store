import { createSlice } from "@reduxjs/toolkit";
import type { Product } from "../product/productsTypes";
import { updateCart } from "../../../Utils/cartUtils";

export type CartItem = {
  qty: number;
} & Product;

export type ShippingAddress = {
  address: string;
  city: string;
  postalCode: string;
  country: string;
};
export type CartState = {
  paymentMethod: string;
  itemsPrice: number;
  cartItems: CartItem[];
  shippingAddress: ShippingAddress;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
};

const initialState: CartState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart")!)
  : {
      paymentMethod: "PayPal",
      itemsPrice: 0,
      cartItems: [],
      shippingAddress: {
        address: "",
        city: "",
        postalCode: "",
        country: "",
      },
      shippingPrice: 0,
      taxPrice: 0,
      totalPrice: 0,
    };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: { payload: CartItem }) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);
      if (existItem) {
        existItem.qty = item.qty;
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      return updateCart(state);
    },
    increaseQty: (state, action: { payload: Product }) => {
      const { _id } = action.payload;
      const existItem = state.cartItems.find((x) => x._id === _id);
      if (existItem) {
        if (existItem.qty < existItem.countInStock) existItem.qty += 1;
      } else {
        state.cartItems.push({ ...action.payload, qty: 1 });
      }
      return updateCart(state);
    },
    removeFromCart: (state, action: { payload: string }) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      return updateCart(state);
    },
    saveShippingAddress: (state, action: { payload: ShippingAddress }) => {
      state.shippingAddress = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },
    savePaymentMethod: (state, action: { payload: string }) => {
      state.paymentMethod = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      localStorage.setItem("cart", JSON.stringify(state));
    },
    resetCart: () => initialState,
  },
});

export const {
  addToCart,
  increaseQty,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  resetCart,
} = cartSlice.actions;
export default cartSlice.reducer;

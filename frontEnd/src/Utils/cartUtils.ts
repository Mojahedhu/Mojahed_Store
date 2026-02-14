import type { CartState } from "../redux/features/cart/cartSlice";

export const addDecimals = (num: number) => {
  return Number((Math.round(num * 100) / 100).toFixed(2));
};

export const updateCart = (state: CartState) => {
  // Calculate the items price
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0),
  );

  // Calculate the shipping price
  state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);

  // Calculate the tax price
  state.taxPrice = addDecimals(Number((0.15 * state.itemsPrice).toFixed(2)));

  //   Calculate the total price
  state.totalPrice = addDecimals(
    state.itemsPrice + state.shippingPrice + state.taxPrice,
  );

  // Save the cart to local storage
  localStorage.setItem("cart", JSON.stringify(state));

  return state;
};

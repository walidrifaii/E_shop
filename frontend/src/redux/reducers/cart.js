import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  cart: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
};

const cartReducer = createReducer(initialState, (builder) => {
  builder.addCase("addToCart", (state, action) => {
    const item = action.payload;
    const isItemExists = state.cart.find((i) => i._id === item._id);
    if (isItemExists) {
      return {
        ...state,
        cart: state.cart.map((i) => (i._id === isItemExists._id ? item : i)),
      };
    } else {
      return {
        ...state,
        cart: [...state.cart, item],
      };
    }
  });
  builder.addCase("removeFromCart", (state, action) => {
    return {
      ...state,
      cart: state.cart.filter((i) => i._id !== action.payload),
    };
  });
});

export default cartReducer;

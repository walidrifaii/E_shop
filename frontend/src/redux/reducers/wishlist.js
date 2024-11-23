import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  wishlist: localStorage.getItem("wishlistItems")
    ? JSON.parse(localStorage.getItem("wishlistItems"))
    : [],
};

const WishlistReducer = createReducer(initialState, (builder) => {
  builder.addCase("addToWishlist", (state, action) => {
    const item = action.payload;
    const isItemExists = state.wishlist.find((i) => i._id === item._id);
    if (isItemExists) {
      return {
        ...state,
        wishlist: state.wishlist.map((i) => (i._id === isItemExists._id ? item : i)),
      };
    } else {
      return {
        ...state,
        wishlist: [...state.wishlist, item],
      };
    }
  });
  builder.addCase("removeFromWishlist", (state, action) => {
    return {
      ...state,
      wishlist: state.wishlist.filter((i) => i._id !== action.payload),
    };
  });
});

export default WishlistReducer;

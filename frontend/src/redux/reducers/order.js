import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
};

const orderReducer = createReducer(initialState, (builder) => {
  builder
    
    // get all order
    .addCase("getAllOrdersUserRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllOrdersUserSuccess", (state, action) => {
      state.isLoading = false;
      state.orders = action.payload;
    })
    .addCase("getAllOrdersUserFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })


    .addCase("getAllOrdersShopRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllOrdersShopSuccess", (state, action) => {
      state.isLoading = false;
      state.orders = action.payload;
    })
    .addCase("getAllOrdersShopFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    

    .addCase("getAllOrdersAdminRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllOrdersAdminSuccess", (state, action) => {
      state.isLoading = false;
      state.adminOrders = action.payload;
    })
    .addCase("getAllOrdersAdminFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })


 

    .addCase("clearErrors", (state) => {
      state.error = null;
    });
});

export default orderReducer;

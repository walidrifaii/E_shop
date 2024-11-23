import axios from "axios";
import { server } from "../../server";
export const getAllOrdersOfUser = (userId) => async (dispatch) => {
    try {
      dispatch({
        type: "getAllOrdersUserRequest",
      });
      const { data } = await axios.get(
        `${server}/order/get-all-orders/${userId}`
      );
      dispatch({
        type: "getAllOrdersUserSuccess",
        payload: data.orders,
      });
    } catch (error) {
      dispatch({
        type: "getAllOrdersUserFailed",
        payload: error.response.data.message,
      });
    }
  };
  export const getAllOrdersOfShop = (shopId) => async (dispatch) => {
    try {
      dispatch({
        type: "getAllOrdersShopRequest",
      });
      const { data } = await axios.get(
        `${server}/order/get-seller-all-orders/${shopId}`
      );
      dispatch({
        type: "getAllOrdersShopSuccess",
        payload: data.orders,
      });
    } catch (error) {
      dispatch({
        type: "getAllOrdersShopFailed",
        payload: error.response.data.message,
      });
    }
  };


  // get all orders of admin
  export const getAllOrdersOfAdmin = () => async (dispatch) => {
    try {
      dispatch({
        type: "getAllOrdersAdminRequest",
      });
      const { data } = await axios.get(`${server}/order/admin-all-orders` , {withCredentials:true});
      dispatch({
        type: "getAllOrdersAdminSuccess",
        payload: data.orders,
      });
    } catch (error) {
      dispatch({
        type: "getAllOrdersAdminFailed",
        payload: error.response.data.message,
      });
    }
  };
 
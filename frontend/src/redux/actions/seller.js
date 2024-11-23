import axios from "axios";
import { server } from "../../server";

    // get all sellers of admin
    export const getAllSellers = () => async (dispatch) => {
        try {
          dispatch({
            type: "getAllSellersAdminRequest",
          });
          const { data } = await axios.get(`${server}/shop/admin-all-sellers` , {withCredentials:true});
          dispatch({
            type: "getAllSellersAdminSuccess",
            payload: data.sellers,
          });
        } catch (error) {
          dispatch({
            type: "getAllSellersAdminFailed",
            payload: error.response.data.message,
          });
        }
      };

 
 
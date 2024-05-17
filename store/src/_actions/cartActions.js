import { useDispatch } from "react-redux";
import axios from "axios";
import {
  ADD_TO_CART,
  GET_CART_ITEM,
  UPDATE_CART_ITEM,
  REMOVE_CART_ITEM,
  CLEAR_CART_ITEM,
} from "./types";

export default function useCart() {
  const token = localStorage.getItem("customerToken");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const dispatch = useDispatch();
  const addToCart = (data) => {
    const result = axios
      .post("http://localhost:4000/cart/addToCart", data, config)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err.response.data;
      });
    return {
      type: ADD_TO_CART,
      payload: result,
    };
  };

  const updateCartItems = (data) => {
    const result = axios
      .put("http://localhost:4000/cart/updateCartItems", data, config)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err.response.data;
      });
    return {
      type: UPDATE_CART_ITEM,
      payload: result,
    };
  };

  const deleteCartItems = (productId) => {
    const result = axios
      .put(
        `http://localhost:4000/cart/removeCartItem/${productId}`,
        false,
        config
      )
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err.response.data;
      });
    return {
      type: REMOVE_CART_ITEM,
      payload: result,
    };
  };

  const getCartItems = () => async (dispatch) => {
    try {
      const res = await axios.get("http://localhost:4000/cart", config);

      dispatch({
        type: GET_CART_ITEM,
        payload: res.data,
      });
    } catch (err) {
      console.error("Error getting cart items:", err);
    }
  };

  const clearCart = () => {
    dispatch({
      type: CLEAR_CART_ITEM,
    });
  };

  return {
    getCartItems,
    addToCart,
    updateCartItems,
    deleteCartItems,
    clearCart,
  };
}

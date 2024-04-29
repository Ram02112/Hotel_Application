import { useDispatch } from "react-redux";
import axios from "axios";
import {
  ADD_TO_CART,
  GET_CART_ITEM,
  UPDATE_CART_ITEM,
  REMOVE_CART_ITEM,
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
      .delete(
        `http://localhost:4000/cart/removeCartItems/${productId}`,
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

  const getCartItems = () => {
    const result = axios
      .get("http://localhost:4000/cart", config)
      .then((res) => {
        return res.data;
      })
      .catch((err) => err.response.data);
    dispatch({
      type: GET_CART_ITEM,
      payload: result,
    });
  };
  return {
    getCartItems,
    addToCart,
    updateCartItems,
    deleteCartItems,
  };
}

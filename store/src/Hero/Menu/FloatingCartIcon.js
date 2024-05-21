import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import cartIcon from "../../assets/img/cart.svg";

const FloatingCartIcon = () => {
  const cartItems = useSelector((state) => state.cart.cartItems?.cartDetails);

  // Calculate the total number of items in the cart
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="position-fixed bottom-0 end-0 p-3">
      <Link
        to="/cart"
        className="btn btn-floating"
        style={{
          backgroundColor: "white",
          fontSize: "1.5rem",
          display: "flex",
          alignItems: "center",
          width: "100px",
        }}
      >
        <img
          src={cartIcon}
          alt="cart"
          className="me-2"
          style={{ width: "30px" }}
        />
        <span
          className="badge bg-danger"
          style={{ marginLeft: "5px", fontSize: "0.8rem" }}
        >
          {totalItems}
        </span>
      </Link>
    </div>
  );
};

export default FloatingCartIcon;

import React from "react";
import { useSelector } from "react-redux";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems?.cartDetails);

  const renderCartItems = () => {
    // Check if cartItems is undefined or null
    if (!cartItems || cartItems.length === 0) {
      return <div>No items in the cart</div>;
    }

    return (
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Product</th>
              <th scope="col">Price ($)</th>
              <th scope="col">Quantity</th>
              <th scope="col">Amount ($)</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item._product._id}>
                <td>
                  <div className="d-flex align-items-center">
                    <div className="p-1">
                      <strong>{item._product.name}</strong>
                      <img
                        src={item._product.image}
                        alt="Product"
                        className="img-fluid ml-2 rounded"
                        style={{ maxWidth: "80px", marginLeft: "15px" }}
                      />
                    </div>
                  </div>
                </td>
                <td className="text-right">{item.price}</td>
                <td className="text-right">{item.quantity}</td>
                <td className="text-right">{item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="container">
      <h1>Cart</h1>
      {renderCartItems()}
    </div>
  );
};

export default Cart;

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useCart from "../_actions/cartActions";
import { message } from "antd";
import { FaEdit, FaSave, FaTimes, FaTrash } from "react-icons/fa";
import { sumBy } from "lodash";
import StripeCheckout from "react-stripe-checkout";
import useOrders from "../_actions/orderActions";
import OrderResult from "./OrderResult";

const Cart = () => {
  const dispatch = useDispatch();
  const { getCartItems, updateCartItems, deleteCartItems, clearCart } =
    useCart();

  const { checkout } = useOrders();
  const cartItems = useSelector((state) => state.cart.cartItems?.cartDetails);

  const auth = useSelector((state) => state.customer.auth);

  const [editItem, setEditItem] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (auth) {
      dispatch(getCartItems());
    }
  }, []);

  const handleEdit = (item) => {
    setEditItem(item);
    setQuantity(item.quantity);
  };

  const handleReset = () => {
    setEditItem(null);
  };

  const handleUpdateCartItems = (item) => {
    if (parseInt(quantity) === 0) {
      handleDelete(item);
      return;
    }

    const data = {
      _productId: item?._product?._id,
      quantity,
    };
    dispatch(updateCartItems(data)).then((res) => {
      if (res.payload.status) {
        message.success({ content: "Cart updated successfully", duration: 3 });
        setEditItem(null);
      } else {
        message.error({ content: "Failed to update cart", duration: 3 });
      }
    });
  };

  const handleDelete = (item) => {
    dispatch(deleteCartItems(item._product._id)).then((res) => {
      if (res.payload.status) {
        message.success({
          content: "Item deleted from cart successfully",
          duration: 3,
        });
      } else {
        message.error({
          content: "failed to delete item from cart",
          duration: 3,
        });
      }
    });
  };

  const handlePayment = (token, total) => {
    dispatch(checkout({ token, total })).then((res) => {
      if (res.payload.status) {
        clearCart();
        setShowResult(true);
      } else {
        message.error({ content: "Payment Successful", duration: 3 });
      }
    });
  };

  const renderCartItems = () => {
    if (!cartItems || cartItems.length === 0) {
      return <div>No items in the cart</div>;
    }

    return (
      <div className="table-responsive">
        <table className="table table-striped">
          <thead className="bg-primary text-light">
            <tr>
              <th className="align-middle">Product</th>
              <th className="align-middle">Price ($)</th>
              <th className="align-middle">Quantity</th>
              <th className="align-middle">Amount ($)</th>
              <th className="align-middle">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item._product._id}>
                <td className="align-middle">
                  <div className="d-flex align-items-center">
                    <img
                      src={`http://localhost:4000/${item._product.image}`}
                      alt="Product"
                      className="img-fluid rounded me-2"
                      style={{ maxWidth: "50px" }}
                    />
                    <span>{item._product.name}</span>
                  </div>
                </td>
                <td className="align-middle">${item.price.toFixed(2)}</td>
                <td className="align-middle">
                  {editItem && editItem._product._id === item._product._id ? (
                    <input
                      type="number"
                      className="form-control"
                      value={quantity}
                      min="0"
                      onChange={(e) => setQuantity(e.target.value)}
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  ) : (
                    <span>{item.quantity}</span>
                  )}
                </td>
                <td className="align-middle">${item.amount.toFixed(2)}</td>
                <td className="align-middle">
                  {editItem && editItem._product._id === item._product._id ? (
                    <div className="d-flex">
                      <button
                        className="btn btn-success me-2"
                        onClick={() => handleUpdateCartItems(item)}
                      >
                        <FaSave />
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={handleReset}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex">
                      <button
                        className="btn btn-primary me-2"
                        onClick={() => handleEdit(item)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(item)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderCheckout = () => {
    const total =
      Math.round(sumBy(cartItems, (item) => item.amount) * 100) / 100;

    // Check if the user is a student and apply a 10% discount if true
    const isStudent = auth?.data?.isStudent;
    const discountPercentage = isStudent ? 0.1 : 0;
    const discountedTotal = total * (1 - discountPercentage);

    if (cartItems?.length > 0) {
      return (
        <center>
          <p>Total Amount: ${total.toFixed(2)}</p>
          {isStudent && (
            <p style={{ color: "green" }}>Student discount applied (10% off)</p>
          )}
          <p>Discounted Amount: ${discountedTotal.toFixed(2)}</p>
          <input
            type="hidden"
            name="discountedAmount"
            value={discountedTotal.toFixed(2)}
          />
          <StripeCheckout
            name="payment"
            email={auth?.data?.email}
            description="Order Payment"
            amount={Math.round(discountedTotal * 100)}
            token={(token) => handlePayment(token, discountedTotal)}
            stripeKey="pk_test_51PBA8YRqKgtFpEdWZ4ngjn5FKwzaR3wgtGgtyzBCyr8MnwBQZGdbUzmKvbEpiEWjtdDayyMsbXNGguE78tgjsI2800VOS4LBtD"
          >
            <button className="btn btn-primary">Pay Now</button>
          </StripeCheckout>
        </center>
      );
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Cart</h1>
      {renderCartItems()}
      {renderCheckout()}
      <OrderResult
        visible={showResult}
        oncCancel={() => setShowResult(false)}
      />
    </div>
  );
};

export default Cart;

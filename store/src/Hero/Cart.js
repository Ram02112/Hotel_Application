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
  const [couponCode, setCouponCode] = useState("");

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
    const data = {
      _productId: item?._product?._id,
      quantity,
    };
    dispatch(updateCartItems(data)).then((res) => {
      if (res.payload.status) {
        message.success({ response: res.payload.message, duration: 3 });
        setEditItem(null);
      } else {
        message.error({ response: res.payload.message, duration: 3 });
      }
    });
  };

  const handleDelete = (item) => {
    dispatch(deleteCartItems(item._product._id)).then((res) => {
      if (res.payload.status) {
        message.success({ response: res.payload.message, duration: 3 });
      } else {
        message.error({ response: res.payload.message, duration: 3 });
      }
    });
  };

  const handlePayment = (token, total) => {
    dispatch(checkout({ token, total })).then((res) => {
      if (res.payload.status) {
        clearCart();
        setShowResult(true);
      } else {
        message.error({ response: res.payload.message, duration: 3 });
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
          <thead>
            <tr>
              <th>Product</th>
              <th>Price ($)</th>
              <th>Quantity</th>
              <th>Amount ($)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item._product._id}>
                <td>
                  <div className="d-flex align-items-center">
                    <img
                      src={item._product.image}
                      alt="Product"
                      className="img-fluid rounded mr-2"
                      style={{ maxWidth: "50px" }}
                    />
                    <span>{item._product.name}</span>
                  </div>
                </td>
                <td>${item.price.toFixed(2)}</td>
                <td>
                  {editItem && editItem._product._id === item._product._id ? (
                    <input
                      type="number"
                      className="form-control"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  ) : (
                    item.quantity
                  )}
                </td>
                <td>${item.amount.toFixed(2)}</td>
                <td>
                  {editItem && editItem._product._id === item._product._id ? (
                    <div>
                      <button
                        className="btn btn-sm btn-success "
                        onClick={() => handleUpdateCartItems(item)}
                        style={{ marginRight: "10px" }}
                      >
                        <FaSave />
                      </button>
                      <button
                        className="btn btn-sm btn-secondary "
                        onClick={handleReset}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleEdit(item)}
                        style={{ marginRight: "10px" }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
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

    const applyCoupon = () => {
      if (couponCode === "SAVE10") {
        return Math.round(total * 0.9);
      } else {
        return null;
      }
    };

    const discountedTotal = applyCoupon();
    const displayTotal = discountedTotal !== null ? discountedTotal : total;

    if (cartItems?.length > 0) {
      return (
        <center>
          <p>Total Amount : $ {total.toFixed(2)}</p>
          {discountedTotal !== null && (
            <p>Discounted Amount : ${discountedTotal.toFixed(2)}</p>
          )}
          <input
            type="text"
            className="form-control w-25"
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter coupon code"
          />
          <br />
          <StripeCheckout
            name="payment"
            email={auth?.data?.email}
            description="Order Payment"
            amount={displayTotal * 100}
            token={(token) => handlePayment(token, displayTotal)}
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

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import useCart from "../_actions/cartActions";
import { message } from "antd";
import { FaEdit, FaSave, FaTimes, FaTrash } from "react-icons/fa";

const Cart = () => {
  const dispatch = useDispatch();
  const { updateCartItems, deleteCartItems } = useCart();
  const cartItems = useSelector((state) => state.cart.cartItems?.cartDetails);
  const [editItem, setEditItem] = useState(null);
  const [quantity, setQuantity] = useState(null);

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
        message.success(res.payload.message);
        setEditItem(null);
      } else {
        message.error(res.payload.message);
      }
    });
  };

  const handleDelete = (item) => {
    dispatch(deleteCartItems(item._product)).then((res) => {
      if (res.payload.status) {
        message.success(res.payload.message);
      } else {
        message.error(res.payload.message);
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

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Cart</h1>
      {renderCartItems()}
    </div>
  );
};

export default Cart;

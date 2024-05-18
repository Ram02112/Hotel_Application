import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import cartIcon from "../../assets/img/cart.svg";
import { useDispatch } from "react-redux";
import { message } from "antd";
import useCart from "../../_actions/cartActions";

const MenuItems = ({ menuItems }) => {
  const { addToCart } = useCart();
  const dispatch = useDispatch();
  const [expandedMenus, setExpandedMenus] = useState({});

  const handleAddToCart = (menuItem) => {
    const data = {
      _productId: menuItem._id,
      quantity: 1,
    };
    dispatch(addToCart(data)).then((res) => {
      if (res.payload.status) {
        message.success({ response: res.payload.message, duration: 3 });
      } else {
        message.error({ response: res.payload.message, duaration: 3 });
      }
    });
  };

  const toggleExpandedMenu = (index) => {
    setExpandedMenus((prevExpandedMenus) => ({
      ...prevExpandedMenus,
      [index]: !prevExpandedMenus[index],
    }));
  };

  const isItemOutOfStock = (menuItem) => {
    return menuItem.outOfStock;
  };

  return (
    <div className="container">
      <h2 className="text-center mb-4">Menu</h2>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {menuItems.map((menuItem, index) => (
          <div
            key={menuItem._id}
            className={`col ${
              isItemOutOfStock(menuItem) ? "out-of-stock" : ""
            }`}
          >
            <div
              className={`card border-0 shadow ${
                isItemOutOfStock(menuItem) ? "out-of-stock" : ""
              }`}
              style={{
                minHeight: "500px",
                maxWidth: "400px",
                filter: isItemOutOfStock(menuItem) ? "grayscale(100%)" : "none",
              }}
            >
              {isItemOutOfStock(menuItem) && (
                <div
                  className="position-absolute top-50 start-50 translate-middle text-center text-white fs-4 fw-bold"
                  style={{
                    transform: "rotate(-45deg)",
                    background: "black",
                    padding: "10px",
                    zIndex: 1,
                  }}
                >
                  Out of Stock
                </div>
              )}
              <div className="position-relative overflow-hidden">
                <img
                  src={menuItem.image}
                  className="card-img-top rounded menu-item-image"
                  alt={menuItem.name}
                  style={{
                    objectFit: "cover",
                    height: "200px",
                  }}
                />
              </div>
              <div className="card-body">
                <h4 className="card-title mb-3">{menuItem.name}</h4>
                <p className="card-text text-muted fs-6 mb-3">
                  Price: $<span className="fw-bold">{menuItem.price}</span>
                </p>
                <p className="card-text text-muted fs-6 mb-3">
                  <b>Ingredients:</b>{" "}
                  {expandedMenus[index]
                    ? menuItem.description
                    : `${menuItem.description.substring(0, 100)}...`}
                  <button
                    className="btn btn-link p-0"
                    onClick={() => toggleExpandedMenu(index)}
                  >
                    {expandedMenus[index] ? "Show less" : "Read more"}
                  </button>
                </p>
                <p className="card-text text-muted fs-6 mb-3">
                  <b>Calories:</b> {menuItem.calories} Kcal
                </p>
                <button
                  className={`btn btn-primary d-flex justify-content-between align-items-center ${
                    isItemOutOfStock(menuItem) ? "disabled" : ""
                  }`}
                  onClick={() => handleAddToCart(menuItem)}
                  disabled={isItemOutOfStock(menuItem)}
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="Out of Stock"
                >
                  <img src={cartIcon} alt="carticon" className="me-1" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuItems;

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import cartIcon from "../../assets/img/cart.svg";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";
import useCart from "../../_actions/cartActions";
import FloatingCartIcon from "./FloatingCartIcon";

const MenuItems = ({ menuItems }) => {
  const { addToCart } = useCart();
  const dispatch = useDispatch();
  const [expandedMenus, setExpandedMenus] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const cartItems = useSelector((state) => state.cart.cartItems?.cartDetails);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:4000/categories");
      const data = await response.json();
      if (data.status) {
        setCategories(data.data.map((category) => category.name));
      } else {
        message.error("Failed to fetch categories");
      }
    } catch (error) {
      message.error("Failed to fetch categories");
    }
  };

  const handleAddToCart = (menuItem) => {
    if (menuItem.outOfStock) {
      message.warning("This item is out of stock");
      return;
    }

    const data = {
      _productId: menuItem._id,
      quantity: 1,
    };
    dispatch(addToCart(data)).then((res) => {
      if (res.payload.status) {
        message.success({ content: "Add to cart successful", duration: 3 });
      } else {
        message.error({
          content: "You need to login to continue",
          duration: 3,
        });
      }
    });
  };

  const toggleExpandedMenu = (index) => {
    setExpandedMenus((prevExpandedMenus) => ({
      ...prevExpandedMenus,
      [index]: !prevExpandedMenus[index],
    }));
  };

  const filteredMenuItems = selectedCategory
    ? menuItems.filter((menuItem) => menuItem.category === selectedCategory)
    : menuItems;

  return (
    <div className="container">
      <h2 className="text-center mb-4">Menu</h2>
      <div className="mb-4">
        <label htmlFor="categoryFilter" className="form-label">
          Filter by Category:
        </label>
        <select
          id="categoryFilter"
          className="form-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {filteredMenuItems.length > 0 ? (
          filteredMenuItems.map((menuItem, index) => (
            <div
              key={menuItem._id}
              className={`col ${menuItem.outOfStock ? "out-of-stock" : ""}`}
            >
              <div
                className={`card border-0 shadow ${
                  menuItem.outOfStock ? "out-of-stock" : ""
                }`}
                style={{
                  minHeight: "500px",
                  maxWidth: "400px",
                  filter: menuItem.outOfStock ? "grayscale(100%)" : "none",
                }}
              >
                <div className="position-relative overflow-hidden">
                  <img
                    src={
                      menuItem.image.startsWith("http")
                        ? menuItem.image
                        : `http://localhost:4000/${menuItem.image}`
                    }
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
                  <div className="d-flex justify-content-between align-items-center">
                    <button
                      className={`btn btn-primary ${
                        menuItem.outOfStock ? "disabled" : ""
                      }`}
                      onClick={() => handleAddToCart(menuItem)}
                      disabled={menuItem.outOfStock}
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title={menuItem.outOfStock ? "Out of Stock" : ""}
                    >
                      <img src={cartIcon} alt="carticon" className="me-1" />
                      Add to Cart
                    </button>
                    {menuItem.outOfStock && (
                      <span className="badge bg-danger ms-2">Out of Stock</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-center text-muted fs-4">
              No products available in this category.
            </p>
          </div>
        )}
        {cartItems && cartItems.length > 0 && (
          <div className="position-fixed bottom-0 end-0 p-3">
            <FloatingCartIcon />
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuItems;

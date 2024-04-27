import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import cartIcon from "../../assets/img/cart.svg";
import { useDispatch } from "react-redux";
import { message } from "antd";
import useCart from "../../_actions/cartActions";
const MenuItems = ({ menuItems }) => {
  const { addToCart } = useCart();
  const dispatch = useDispatch();
  const handleAddToCart = (menuItems) => {
    const data = {
      _productId: menuItems._id,
      quantity: 1,
    };
    dispatch(addToCart(data)).then((res) => {
      if (res.payload.status) {
        message.success(res.payload.message);
      } else {
        message.error(res.payload.message);
      }
    });
  };
  return (
    <div className="container">
      <h2 className="text-center mb-4">Menu</h2>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {menuItems.map((menuItem) => (
          <div key={menuItem._id} className="col">
            <div className="card border-0 shadow-sm">
              <img
                src={menuItem.image}
                className="card-img-top rounded"
                alt={menuItem.name}
              />
              <div className="card-body">
                <h4 className="card-title fs-5">{menuItem.name}</h4>
                <p className="card-text fs-7">
                  Price: $ <span className="fw-bold">{menuItem.price}</span>
                </p>
                <p className="card-text fs-9 fw-light">
                  <b>Ingredients</b> - {menuItem.description}
                </p>
                <p className="card-text fs-9 ">
                  <b>Calories</b> - {menuItem.calories} Kcal
                </p>
                <button
                  className="btn btn-primary d-flex justify-content-between align-items-center"
                  onClick={() => handleAddToCart(menuItem)}
                >
                  <img src={cartIcon} alt="carticon" className="m-1" />
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

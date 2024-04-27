import React from "react";
import { Link } from "react-router-dom";

const FoodMenuItem = ({ image, price, name, ingredients }) => {
  return (
    <div className="col">
      <div className="card mb-4">
        <img src={image} className="card-img-top" alt="Menu Item" />
        <div className="card-body">
          <h5 className="card-title">{name}</h5>
          <p className="card-text">{ingredients}</p>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="text-muted">${price}</h6>
            </div>
            <Link to="/menu" className="nav-link">
              <button className="btn btn-primary">Order Now</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodMenuItem;

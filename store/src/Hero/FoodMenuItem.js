import React from "react";

const FoodMenuItem = ({ image, price, name, ingredients }) => {
  return (
    <div className="col">
      <div className="card mb-4" style={{ minHeight: "450px" }}>
        <img
          src={image}
          className="card-img-top rounded menu-item-image"
          alt="Menu Item"
          style={{
            objectFit: "cover",
            height: "200px",
          }}
        />
        <div className="card-body">
          <h5 className="card-title">{name}</h5>
          <p className="card-text">{ingredients}</p>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="text-muted">
                <b>Price</b> - ${price}
              </h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodMenuItem;

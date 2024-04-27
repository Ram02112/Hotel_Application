import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const MenuItems = ({ menuItems, userId }) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const handleUpdateItem = async (menuItem, operation) => {
    const updatedCart = { ...cartItems };
    const quantity = updatedCart[menuItem._id] || 0;

    try {
      const response = await fetch(`http://localhost:3000/add-to-cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userId,
          menuItem: menuItem._id,
          quantity: operation === "add" ? 1 : -1,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update cart");
      }

      const data = await response.json();
      if (data.status) {
        updatedCart[menuItem._id] = quantity + (operation === "add" ? 1 : -1);
        setCartItems(updatedCart);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  return (
    <div className="container">
      <h2 className="text-center mb-4">Menu</h2>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {menuItems.map((menuItem) => (
          <div key={menuItem._id} className="col">
            <div className="card p-2" style={{ height: "230px" }}>
              <div className="d-flex">
                <img
                  src={menuItem.image}
                  className="img-fluid w-25 h-50 rounded"
                  alt={menuItem.name}
                />
                <div className="card-body p-2">
                  <h4 className="card-title fs-5">{menuItem.name}</h4>
                  <p className="card-text fs-7">
                    Price: $ <span className="fw-bold">{menuItem.price}</span>
                  </p>
                  <div>
                    <p
                      className="card-text fs-7 fw-light"
                      style={{ maxWidth: "180px" }}
                    >
                      {menuItem.description}
                    </p>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center p-1">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleUpdateItem(menuItem, "remove")}
                  >
                    -
                  </button>
                  <span className="fs-7">{cartItems[menuItem._id] || 0}</span>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleUpdateItem(menuItem, "add")}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuItems;

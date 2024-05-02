import React, { useState, useEffect } from "react";
import MenuItems from "./MenuItems";
import { message } from "antd";

const ItemMenu = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch("http://localhost:4000/products");
      if (response.ok) {
        const data = await response.json();

        setMenuItems(data);
      } else {
        message.error("Failed to fetch menu items");
      }
    } catch (error) {
      message.error("Error fetching menu items:", error);
    }
  };
  return (
    <div>
      <div className="container mt-4">
        <div className="row">
          <div className="col">
            <MenuItems menuItems={menuItems} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemMenu;

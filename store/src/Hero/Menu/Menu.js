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
        message.error({ content: "Failed to fetch menu items", duration: 3 });
      }
    } catch (error) {
      message.error({
        content: "Error fetching menu items",
        duration: 3,
        error,
      });
    }
  };
  return (
    <div>
      <div className="container mt-4">
        <div className="row">
          <div className="col" id="top">
            <MenuItems menuItems={menuItems} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemMenu;

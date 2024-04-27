import React, { useState, useEffect } from "react";
import EditableMenu from "./EditableMenu";

const AdminMenu = () => {
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
        console.error("Failed to fetch menu items");
      }
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };
  return (
    <div>
      <div className="container mt-4">
        <div className="row">
          <div className="col">
            <EditableMenu menuItems={menuItems} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;

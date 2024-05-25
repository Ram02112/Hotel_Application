import React, { useState, useEffect } from "react";
import EditableMenu from "./EditableMenu";
import { message } from "antd";

const AdminMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
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
        content: "Error fetching menu items:",
        duration: 3,
        error,
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:4000/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data);
      } else {
        message.error({ content: "Failed to fetch categories", duration: 3 });
      }
    } catch (error) {
      message.error({
        content: "Error fetching categories:",
        duration: 3,
        error,
      });
    }
  };

  return (
    <div>
      <div className="container mt-4">
        <div className="row">
          <div className="col">
            <EditableMenu menuItems={menuItems} categories={categories} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;

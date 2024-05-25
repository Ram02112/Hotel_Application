import React, { useState, useEffect } from "react";
import { message } from "antd";

const AdminCategory = () => {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:4000/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data);
      } else {
        message.error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/categories/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
        }),
      });
      if (response.ok) {
        setName("");
        const res = await response.json();
        message.success(res.message);
        fetchCategories(); // Fetch categories again after adding a new one
      } else {
        message.warning({
          content: "Failed to add category",
          duration: 3,
          response: response.statusText,
        });
      }
    } catch (error) {
      message.warning({
        content: "Error adding category",
        response: error,
        duration: 3,
      });
    }
  };

  const handleDelete = async (categoryId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/categories/${categoryId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        message.success("Category deleted successfully");
        fetchCategories(); // Fetch categories again after deleting
      } else {
        message.warning({
          content: "Failed to delete category",
          duration: 3,
          response: response.statusText,
        });
      }
    } catch (error) {
      message.warning({
        content: "Error deleting category",
        response: error,
        duration: 3,
      });
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Add New Category</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-block"
                >
                  Add Category
                </button>
              </form>
            </div>
          </div>
          <div className="mt-5">
            <h2 className="text-center mb-4">Categories</h2>
            <ul className="list-group">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <li
                    key={category._id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {category.name}
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(category._id)}
                    >
                      Delete
                    </button>
                  </li>
                ))
              ) : (
                <li className="list-group-item">No categories available</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCategory;

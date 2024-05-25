import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { message, Select } from "antd";

const { Option } = Select;

const AddMenuItemForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [calories, setCalories] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

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

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("calories", calories);
    formData.append("price", price);
    formData.append("category", selectedCategory?._id);
    formData.append("imageFile", imageFile);

    try {
      const response = await fetch("http://localhost:4000/products/create", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        setName("");
        setDescription("");
        setCalories("");
        setPrice("");
        setImageFile(null);
        setSelectedCategory(null);
        const res = await response.json();
        message.success(res.message);
        fetchCategories();
      } else {
        message.warning({
          content: "Failed to add menu item",
          duration: 3,
          response: response.statusText,
        });
      }
    } catch (error) {
      message.warning({
        content: "Error adding menu item",
        response: error,
        duration: 3,
      });
    }
  };

  const handleImageFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Add New Menu Item</h2>
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
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Ingredients
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="calories" className="form-label">
                    Calories
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="calories"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="price" className="form-label">
                    Price
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="category" className="form-label">
                    Category
                  </label>
                  <Select
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Select a category"
                    optionFilterProp="children"
                    value={selectedCategory ? selectedCategory._id : null}
                    onChange={(value) => {
                      const category = categories.find(
                        (cat) => cat._id === value
                      );
                      setSelectedCategory(category);
                    }}
                  >
                    {categories &&
                      categories.map((category) => (
                        <Option key={category._id} value={category._id}>
                          {category.name}
                        </Option>
                      ))}
                  </Select>
                </div>
                <div className="mb-3">
                  <label htmlFor="imageFile" className="form-label">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="imageFile"
                    onChange={handleImageFileChange}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-block"
                >
                  Add Item
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMenuItemForm;

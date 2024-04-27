import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const AddMenuItemForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [calories, setCalories] = useState("");
  const [price, setPrice] = useState("");
  const [imageURL, setImageURL] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/products/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          calories,
          price,
          image: imageURL,
        }),
      });
      if (response.ok) {
        setName("");
        setDescription("");
        setCalories("");
        setPrice("");
        setImageURL("");
        console.log("Menu item added successfully!");
      } else {
        console.error("Failed to add menu item:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding menu item:", error);
    }
  };

  return (
    <div>
      <h2>Add New Menu Item</h2>
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
          <label htmlFor="description" className="form-label">
            Calories
          </label>
          <input
            type="text"
            className="form-control"
            id="description"
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
          <label htmlFor="imageURL" className="form-label">
            Image URL
          </label>
          <input
            type="text"
            className="form-control"
            id="imageURL"
            value={imageURL}
            onChange={(e) => setImageURL(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Item
        </button>
      </form>
    </div>
  );
};

export default AddMenuItemForm;

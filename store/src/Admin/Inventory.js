import React, { useState } from "react";
import axios from "axios";
import { message } from "antd";
const InventoryManagement = ({ fetchInventory }) => {
  const [formData, setFormData] = useState({
    nameOfRawMaterial: "",
    price: "",
    quantity: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post("http://localhost:4000/inventory/add", formData);
      setFormData({
        nameOfRawMaterial: "",
        price: "",
        quantity: "",
      });
      if (fetchInventory) {
        fetchInventory();
      }
      message.success({
        content: "Added Item to inventory successfully",
        duration: 3,
      });
    } catch (error) {
      setError(
        "Error adding inventory: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-5 p-4 border rounded shadow bg-light"
      style={{ maxWidth: "500px", margin: "auto" }}
    >
      <h2 className="mb-4 fs-5 text-center">Add Inventory</h2>
      <div className="mb-3">
        <label htmlFor="nameOfRawMaterial" className="form-label fs-6">
          Name of Raw Material
        </label>
        <input
          type="text"
          className="form-control rounded-3"
          id="nameOfRawMaterial"
          name="nameOfRawMaterial"
          placeholder="Enter name"
          value={formData.nameOfRawMaterial}
          onChange={handleChange}
          required
        />
      </div>
      <div className="row g-2 mb-3">
        <div className="col">
          <label htmlFor="price" className="form-label fs-6">
            Price
          </label>
          <div className="input-group">
            <span className="input-group-text bg-primary text-light rounded-start">
              $
            </span>
            <input
              type="number"
              className="form-control bg-light border-primary text-primary rounded-end"
              id="price"
              name="price"
              placeholder="Enter price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="col">
          <label htmlFor="quantity" className="form-label fs-6">
            Quantity
          </label>
          <div className="input-group">
            <input
              type="number"
              className="form-control bg-light border-primary text-primary rounded-start"
              id="quantity"
              name="quantity"
              placeholder="Enter quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
            <span className="input-group-text bg-primary text-light rounded-end">
              Kgs
            </span>
          </div>
        </div>
      </div>
      <div className="d-grid">
        <button type="submit" className="btn btn-primary rounded-3">
          Add Inventory
        </button>
      </div>
      {loading && <p className="mt-3 text-center">Loading...</p>}
      {error && <p className="text-danger mt-3 text-center">{error}</p>}
    </form>
  );
};

export default InventoryManagement;

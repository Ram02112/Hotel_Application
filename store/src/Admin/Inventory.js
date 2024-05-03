import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "react-bootstrap";

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [formData, setFormData] = useState({
    nameOfRawMaterial: "",
    price: "",
    quantity: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editedItem, setEditedItem] = useState(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:4000/inventory");
      setInventory(response.data.inventoryItems || []);
    } catch (error) {
      setError("Error fetching inventory: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:4000/inventory/add", formData);
      setFormData({
        nameOfRawMaterial: "",
        price: "",
        quantity: "",
      });
      fetchInventory();
    } catch (error) {
      setError("Error adding inventory: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditedItem(item);
    setFormData({
      nameOfRawMaterial: item.nameOfRawMaterial,
      price: item.price,
      quantity: item.quantity,
    });
    setEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:4000/inventory/${id}`);
      fetchInventory();
    } catch (error) {
      setError("Error deleting inventory item: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setEditedItem(null);
    setEditModalOpen(false);
  };

  const handleModalSubmit = async () => {
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:4000/inventory/${editedItem._id}`,
        formData
      );
      setFormData({
        nameOfRawMaterial: "",
        price: "",
        quantity: "",
      });
      fetchInventory();
      setEditModalOpen(false);
    } catch (error) {
      setError("Error editing inventory item: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Inventory Management</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nameOfRawMaterial" className="form-label">
            Name of Raw Material
          </label>
          <input
            type="text"
            className="form-control"
            id="nameOfRawMaterial"
            name="nameOfRawMaterial"
            placeholder="Name"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Price
          </label>
          <input
            type="number"
            className="form-control"
            id="price"
            name="price"
            placeholder="Price"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="quantity" className="form-label">
            Quantity
          </label>
          <input
            type="number"
            className="form-control"
            id="quantity"
            name="quantity"
            placeholder="Quantity"
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Inventory
        </button>
      </form>
      <hr />
      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}
      {!loading && !error && (
        <>
          <h2>Inventory List</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Name of Raw Material</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item._id}>
                  <td>{item.nameOfRawMaterial}</td>
                  <td>$ {item.price}</td>
                  <td>{item.quantity} Kgs</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ marginRight: "10px" }}
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {editedItem && (
        <Modal show={editModalOpen} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Inventory Item</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="mb-3">
                <label htmlFor="nameOfRawMaterial" className="form-label">
                  Name of Raw Material
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="nameOfRawMaterial"
                  name="nameOfRawMaterial"
                  value={formData.nameOfRawMaterial}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="price" className="form-label">
                  Price
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="quantity" className="form-label">
                  Quantity
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-secondary" onClick={handleModalClose}>
              Close
            </button>
            <button className="btn btn-primary" onClick={handleModalSubmit}>
              Save Changes
            </button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default InventoryManagement;

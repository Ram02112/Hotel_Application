import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form } from "react-bootstrap";
import { message } from "antd";

const EditableMenu = ({ menuItems }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  useEffect(() => {
    if (menuItems && menuItems.length > 0) {
      setSelectedMenuItem(menuItems[0]);
    }
  }, [menuItems]);

  const handleEdit = (menuItem) => {
    setSelectedMenuItem(menuItem);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/products/update/${selectedMenuItem._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedMenuItem),
        }
      );

      if (response.ok) {
        message.success("Menu item updated successfully");
        setShowModal(false);
        window.location.reload();
      } else {
        message.error("Failed to update menu item");
      }
    } catch (error) {
      message.error("Error updating menu item:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:4000/products/delete/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        message.success("Menu item deleted successfully");
        window.location.reload();
      } else {
        message.error("Failed to delete menu item");
      }
    } catch (error) {
      message.error("Error deleting menu item:", error);
    }
  };

  const handleOutOfStockChange = async (id, checked) => {
    try {
      const response = await fetch(`http://localhost:4000/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          outOfStock: checked,
        }),
      });
      if (response.ok) {
        message.success("Out of stock status updated successfully");
        window.location.reload();
      } else {
        message.error("Failed to update out of stock status");
      }
    } catch (error) {
      message.error("Error updating out of stock status:", error);
    }
  };

  return (
    <div className="container">
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Description</th>
            <th>Calories</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {menuItems.map((menuItem) => (
            <tr key={menuItem._id}>
              <td>{menuItem.name}</td>
              <td>${menuItem.price.toFixed(2)}</td>
              <td>{menuItem.description}</td>
              <td>{menuItem.calories}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm me-1"
                  onClick={() => handleEdit(menuItem)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(menuItem._id)}
                >
                  Delete
                </button>
                <input
                  type="checkbox"
                  checked={menuItem.outOfStock}
                  onChange={() => handleOutOfStockChange(menuItem._id)}
                  className="form-check-input d-none"
                  id={`outOfStockCheckbox-${menuItem._id}`}
                />
                <label
                  htmlFor={`outOfStockCheckbox-${menuItem._id}`}
                  className="ms-2"
                >
                  Out of Stock
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Menu Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={selectedMenuItem ? selectedMenuItem.name : ""}
                onChange={(e) =>
                  setSelectedMenuItem({
                    ...selectedMenuItem,
                    name: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={selectedMenuItem ? selectedMenuItem.price : ""}
                onChange={(e) =>
                  setSelectedMenuItem({
                    ...selectedMenuItem,
                    price: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                value={selectedMenuItem ? selectedMenuItem.description : ""}
                onChange={(e) =>
                  setSelectedMenuItem({
                    ...selectedMenuItem,
                    description: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formImageUrl">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image URL"
                value={selectedMenuItem ? selectedMenuItem.image : ""}
                onChange={(e) =>
                  setSelectedMenuItem({
                    ...selectedMenuItem,
                    image: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group controlId="formOutOfStock">
              <Form.Check
                type="checkbox"
                label="Out of Stock"
                checked={selectedMenuItem ? selectedMenuItem.outOfStock : false}
                onChange={(e) =>
                  setSelectedMenuItem({
                    ...selectedMenuItem,
                    outOfStock: e.target.checked,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditableMenu;

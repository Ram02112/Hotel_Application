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
        message.success({
          content: "Menu item updated successfully",
          duration: 3,
        });
        setShowModal(false);
        window.location.reload();
      } else {
        message.warning({ content: "Failed to update menu item", duration: 3 });
      }
    } catch (error) {
      message.warning({
        content: "Error updating menu item:",
        duration: 3,
        error,
      });
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
              <td style={{ width: "150px" }}>
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
                {menuItem.outOfStock && (
                  <span className="ms-2 text-danger">Out of Stock</span>
                )}
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
              <Form.Label>Calories</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Calories"
                value={selectedMenuItem ? selectedMenuItem.calories : ""}
                onChange={(e) =>
                  setSelectedMenuItem({
                    ...selectedMenuItem,
                    calories: e.target.value,
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

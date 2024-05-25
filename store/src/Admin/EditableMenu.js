import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form } from "react-bootstrap";
import { message } from "antd";

const EditableMenu = ({ menuItems }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [useImageURL, setUseImageURL] = useState(false);
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);

  useEffect(() => {
    fetchCategories();
    if (menuItems && menuItems.length > 0) {
      setSelectedMenuItem(menuItems[0]);
    }
  }, [menuItems]);

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

  const handleEdit = (menuItem) => {
    setSelectedMenuItem(menuItem);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveChanges = async () => {
    try {
      const formData = new FormData();
      formData.append("imageFile", selectedMenuItem.file);

      const uploadResponse = await fetch("http://localhost:4000/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      const imageUrl = await uploadResponse.text();

      const saveResponse = await fetch(
        `http://localhost:4000/products/update/${selectedMenuItem._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...selectedMenuItem, image: imageUrl }),
        }
      );

      if (saveResponse.ok) {
        message.success({
          content: "Menu item updated successfully",
          duration: 3,
        });
        setShowModal(false);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        message.warning({
          content: "Failed to update menu item",
          duration: 3,
        });
      }
    } catch (error) {
      message.warning({
        content: `Error updating menu item: ${error}`,
        duration: 3,
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
      message.error(`Error deleting menu item: ${error}`);
    }
  };
  useEffect(() => {
    setFilteredMenuItems(
      selectedCategory
        ? menuItems.filter((menuItem) => menuItem.category === selectedCategory)
        : menuItems
    );
  }, [selectedCategory, menuItems]);

  return (
    <div className="container">
      <div className="mb-4">
        <label htmlFor="categoryFilter" className="form-label">
          Filter by Category:
        </label>
        <select
          id="categoryFilter"
          className="form-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All</option>
          {categories.map((category) => (
            <option key={category._id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      {filteredMenuItems.length === 0 ? (
        <div className="text-center">No items for the selected category</div>
      ) : (
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Description</th>
              <th>Calories</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMenuItems.map((menuItem) => (
              <tr key={menuItem._id}>
                <td>{menuItem.name}</td>
                <td>${menuItem.price.toFixed(2)}</td>
                <td>{menuItem.description}</td>
                <td>{menuItem.calories}</td>
                <td>{menuItem.category && menuItem.category}</td>
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
      )}

      {selectedMenuItem && (
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
                  value={selectedMenuItem.name}
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
                  value={selectedMenuItem.price}
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
                  value={selectedMenuItem.description}
                  onChange={(e) =>
                    setSelectedMenuItem({
                      ...selectedMenuItem,
                      description: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group controlId="formCalories">
                <Form.Label>Calories</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Calories"
                  value={selectedMenuItem.calories}
                  onChange={(e) =>
                    setSelectedMenuItem({
                      ...selectedMenuItem,
                      calories: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group controlId="formImage">
                <Form.Group controlId="formImageFile">
                  <Form.Label>Upload Image</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setSelectedMenuItem({
                        ...selectedMenuItem,
                        file: file,
                        image: URL.createObjectURL(file),
                      });
                    }}
                  />
                </Form.Group>
              </Form.Group>

              <Form.Group controlId="formCategory">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedMenuItem.category}
                  onChange={(e) =>
                    setSelectedMenuItem({
                      ...selectedMenuItem,
                      category: e.target.value,
                    })
                  }
                >
                  {Array.isArray(categories) &&
                    categories.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formOutOfStock">
                <Form.Check
                  type="checkbox"
                  label="Out of Stock"
                  checked={selectedMenuItem.outOfStock}
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
      )}
    </div>
  );
};

export default EditableMenu;

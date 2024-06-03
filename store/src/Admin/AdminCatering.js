import React, { useState, useEffect } from "react";
import axios from "axios";
import { message, Modal, Button, Input, Form, Select } from "antd";
import { BsTrash, BsPencil } from "react-icons/bs";
import moment from "moment";

const { Option } = Select;

const AdminCatering = () => {
  const [caterings, setCaterings] = useState([]);
  const [error, setError] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentCatering, setCurrentCatering] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCaterings();
  }, []);

  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("adminToken");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const fetchCaterings = async () => {
    try {
      const response = await axios.get("http://localhost:4000/catering");
      if (response.data && Array.isArray(response.data.data)) {
        setCaterings(response.data.data);
      } else {
        setError("No catering data available");
      }
    } catch (error) {
      setError("Error fetching catering data");
    }
  };

  const handleDeleteCatering = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/catering/cancelbooking/${id}`);
      message.success({
        content: "Catering deleted successfully",
        duration: 3,
      });
      fetchCaterings();
    } catch (error) {
      message.error({ content: "Error deleting catering", duration: 3 });
    }
  };

  const handleEditCatering = (catering) => {
    setCurrentCatering(catering);
    const formattedDate = new Date(catering.date).toISOString().split("T")[0];
    form.setFieldsValue({
      cateringName: catering.cateringName,
      address: catering.address,
      phoneNumber: catering.phoneNumber,
      numberOfPeople: catering.numberOfPeople,
      date: formattedDate,
      time: catering.time[0],
    });
    setEditModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      const updatedCatering = {
        cateringName: values.cateringName,
        address: values.address,
        phoneNumber: values.phoneNumber,
        numberOfPeople: values.numberOfPeople,
        date: values.date,
        time: [values.time],
      };
      await axios.put(
        `http://localhost:4000/catering/editbooking/${currentCatering._id}`,
        updatedCatering
      );
      message.success({
        content: "Catering updated successfully",
        duration: 3,
      });
      setEditModalVisible(false);
      fetchCaterings();
    } catch (error) {
      message.error({ content: "Error updating catering", duration: 3 });
    }
  };

  const handleCancelEdit = () => {
    setEditModalVisible(false);
    setCurrentCatering(null);
  };

  const generateTimeSlots = () => {
    const slots = [];
    const currentHour = new Date().getHours();
    for (let i = 10; i <= 21; i++) {
      if (i > currentHour) {
        slots.push(`${i}:00 - ${i + 1}:00`);
      }
    }
    return slots;
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <h2 className="card-header bg-dark text-white text-center">
          Admin Caterings
        </h2>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {caterings.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th scope="col">Booking ID</th>
                    <th scope="col">Catering for</th>
                    <th scope="col">Date</th>
                    <th scope="col">Time</th>
                    <th scope="col">Address</th>
                    <th scope="col">Phone Number</th>
                    <th scope="col">Number of People</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {caterings.map((catering) => (
                    <tr key={catering._id}>
                      <td>{catering._id}</td>
                      <td>{catering.cateringName}</td>
                      <td>{new Date(catering.date).toLocaleDateString()}</td>
                      <td>{catering.time[0]}</td>
                      <td>{catering.address}</td>
                      <td>{catering.phoneNumber}</td>
                      <td>{catering.numberOfPeople}</td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => handleEditCatering(catering)}
                        >
                          <BsPencil /> Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteCatering(catering._id)}
                        >
                          <BsTrash /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-info">No caterings booked</div>
          )}
        </div>
      </div>

      <Modal
        visible={editModalVisible}
        title="Edit Catering"
        onCancel={handleCancelEdit}
        footer={[
          <Button key="cancel" onClick={handleCancelEdit}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleEditSubmit}>
            Save Changes
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="cateringName"
            label="Catering for"
            rules={[{ required: true, message: "Please enter catering name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please enter address" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="numberOfPeople"
            label="Number of People"
            rules={[
              {
                required: true,
                message: "Please enter the number of people",
              },
              {
                type: "number",
                min: 100,
                max: 300,
                message: "Number of people must be between 100 and 300",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please select a date" }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="time"
            label="Time"
            rules={[{ required: true, message: "Please select a time slot" }]}
          >
            <Select>
              {generateTimeSlots().map((slot, index) => (
                <Option key={index} value={slot}>
                  {slot}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminCatering;

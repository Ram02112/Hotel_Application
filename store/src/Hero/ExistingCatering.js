import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { message, Modal, Button, Input, Form, Select, DatePicker } from "antd";
import { BsTrash, BsPencil } from "react-icons/bs";
import moment from "moment";
const { Option } = Select;
const ExistingCatering = () => {
  const [customerEmail, setCustomerEmail] = useState("");
  const [existingCatering, setExistingCatering] = useState([]);
  const [error, setError] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentCatering, setCurrentCatering] = useState(null);
  const [form] = Form.useForm();
  useEffect(() => {
    const userEmail = getUserEmail();
    setCustomerEmail(userEmail);
    fetchExistingCatering(userEmail);
  }, []);

  const getUserEmail = () => {
    const token = localStorage.getItem("customerToken");
    if (token) {
      const decodedToken = jwtDecode(token);

      return decodedToken.email;
    } else {
      return null;
    }
  };
  const fetchExistingCatering = async (email) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/catering/customer/${email}`
      );
      setExistingCatering(response.data.caterings);
    } catch (error) {
      setError("Error fetching existing catering");
    }
  };
  const handleDeleteBooking = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/catering/cancelbooking/${id}`
      );
      message.success(response.data.message);
      fetchExistingCatering(customerEmail);
    } catch (error) {
      message.error({ content: "Error deleting booking", duration: 3 });
    }
  };
  const handleEditCatering = (catering) => {
    setCurrentCatering(catering);
    form.setFieldsValue({
      cateringName: catering.cateringName,
      address: catering.address,
      phoneNumber: catering.phoneNumber,
      numberOfPeople: catering.numberOfPeople,
      date: moment(catering.date),
      time: catering.time[0],
    });
    setEditModalVisible(true);
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
      fetchExistingCatering(customerEmail);
    } catch (error) {
      message.error({ content: "Error updating catering", duration: 3 });
    }
  };
  const handleCancelEdit = () => {
    setEditModalVisible(false);
    setCurrentCatering(null);
  };
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("customerToken");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return (
    <div className="container mt-4">
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {existingCatering.map((catering, index) => (
          <div key={index} className="col">
            <div className="card shadow">
              <div className="card-body">
                <h5 className="card-title text-center mb-3">
                  Catering {index + 1}
                </h5>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="table-responsive">
                  <table className="table table-bordered table-striped mb-4">
                    <tbody>
                      <tr>
                        <td className="fw-bold">Catering ID:</td>
                        <td>{catering._id}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Catering Name:</td>
                        <td>{catering.cateringName}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Number of People:</td>
                        <td>{catering.numberOfPeople}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Date:</td>
                        <td>{new Date(catering.date).toLocaleDateString()}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Time:</td>
                        <td>{catering.time}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Address:</td>
                        <td>{catering.address}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Phone Number:</td>
                        <td>{catering.phoneNumber}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    className="btn btn-primary btn-sm rounded-pill px-3 py-1 mx-1"
                    onClick={() => handleEditCatering(catering)}
                    disabled={
                      moment(catering.date).diff(moment(), "hours") < 24
                    }
                  >
                    <BsPencil /> Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm rounded-pill px-3 py-1"
                    onClick={() => handleDeleteBooking(catering._id)}
                  >
                    <BsTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Modal
        open={editModalVisible}
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
              { required: true, message: "Please enter number of people" },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="date"
            label="Date"
            rules={[
              {
                required: true,
                message: "Please select a date",
              },
            ]}
          >
            <input
              type="date"
              min={moment().format("YYYY-MM-DD")}
              className="ant-input"
              style={{ width: "100%" }}
            />
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

export default ExistingCatering;

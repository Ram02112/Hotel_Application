import React, { useState, useEffect } from "react";
import axios from "axios";
import { message, Modal, Button, Input, Form, Select } from "antd";
import { jwtDecode } from "jwt-decode";
import { BsTrash, BsPencil } from "react-icons/bs";
import moment from "moment";
const { Option } = Select;
const ExistingBooking = () => {
  const [existingBookings, setExistingBookings] = useState([]);
  const [customerEmail, setCustomerEmail] = useState("");
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [form] = Form.useForm();
  useEffect(() => {
    const userEmail = getUserEmail();
    setCustomerEmail(userEmail);
    fetchExistingBookings(userEmail);
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
  const fetchExistingBookings = async (email) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/booking/customer/${email}`
      );
      setExistingBookings(response.data.bookings);
    } catch (error) {
      setError("Error fetching existing bookings");
    }
  };
  const handleDeleteBooking = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/booking/cancelbooking/${id}`
      );
      message.success(response.data.message);
      fetchExistingBookings(customerEmail);
    } catch (error) {
      message.error({ content: "Error deleting booking", duration: 3 });
    }
  };
  const handleEditBooking = (booking) => {
    setCurrentBooking(booking);
    const formattedDate = new Date(booking.date).toISOString().split("T")[0];
    form.setFieldsValue({
      name: booking.name,
      date: formattedDate,
      time: booking.time[0],
      numberOfPeople: booking.numberOfPeople,
    });
    setEditModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      const updatedBooking = {
        name: values.name,
        date: values.date,
        time: [values.time],
        numberOfPeople: values.numberOfPeople,
      };
      await axios.put(
        `http://localhost:4000/booking/${currentBooking._id}`,
        updatedBooking
      );
      message.success({ content: "Booking updated successfully", duration: 3 });
      setEditModalVisible(false);
      fetchExistingBookings(customerEmail);
    } catch (error) {
      message.error({ content: "Error updating booking", duration: 3 });
    }
  };

  const handleCancelEdit = () => {
    setEditModalVisible(false);
    setCurrentBooking(null);
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
    <div className="container mt-4">
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {existingBookings.map((booking, index) => (
          <div key={index} className="col">
            <div className="card shadow">
              <div className="card-body">
                <h5 className="card-title text-center mb-3">
                  Booking {index + 1}
                </h5>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="table-responsive">
                  <table className="table table-bordered table-striped mb-4">
                    <tbody>
                      <tr>
                        <td className="fw-bold">Booking ID:</td>
                        <td>{booking._id}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Booking For:</td>
                        <td>{booking.name}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Number of People:</td>
                        <td>{booking.numberOfPeople}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Date:</td>
                        <td>{new Date(booking.date).toLocaleDateString()}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Time:</td>
                        <td>{booking.time}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    className="btn btn-primary btn-sm rounded-pill px-3 py-1 mx-1"
                    onClick={() => handleEditBooking(booking)}
                    disabled={moment(booking.date).diff(moment(), "hours") < 24}
                  >
                    <BsPencil /> Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm rounded-pill px-3 py-1"
                    onClick={() => handleDeleteBooking(booking._id)}
                  >
                    <BsTrash /> Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Modal
        open={editModalVisible}
        title="Edit Booking"
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
            name="name"
            label="Name of Booking"
            rules={[
              { required: true, message: "Please enter name of booking" },
            ]}
          >
            <Input />
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
          <Form.Item
            name="numberOfPeople"
            label="Number of People"
            rules={[
              { required: true, message: "Please enter number of people" },
            ]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ExistingBooking;

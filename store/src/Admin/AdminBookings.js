import React, { useState, useEffect } from "react";
import axios from "axios";
import { message, Modal, Button, Input, Form, Select } from "antd";
import { BsTrash, BsPencil } from "react-icons/bs";
import moment from "moment";

const { Option } = Select;

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchBookings();
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

  const fetchBookings = async () => {
    try {
      const response = await axios.get("http://localhost:4000/booking");
      setBookings(response.data);
    } catch (error) {
      setError("Error fetching bookings");
    }
  };

  const handleDeleteBooking = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/booking/${id}`);
      message.success("Booking deleted successfully");
      fetchBookings();
    } catch (error) {
      message.error("Error deleting booking");
    }
  };

  const handleEditBooking = (booking) => {
    setCurrentBooking(booking);
    form.setFieldsValue({
      name: booking.name,
      date: moment(booking.date),
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
      message.success("Booking updated successfully");
      setEditModalVisible(false);
      fetchBookings();
    } catch (error) {
      message.error("Error updating booking");
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
    <div className="container mt-5">
      <div className="card">
        <h2 className="card-header bg-dark text-white text-center">
          Admin Bookings
        </h2>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {bookings.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th scope="col">Booking ID</th>
                    <th scope="col">Name of Booking</th>
                    <th scope="col">Date</th>
                    <th scope="col">Time</th>
                    <th scope="col">Number of People</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>{booking._id}</td>
                      <td>{booking.name}</td>
                      <td>{new Date(booking.date).toLocaleDateString()}</td>
                      <td>{booking.time.join(", ")}</td>
                      <td>{booking.numberOfPeople}</td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => handleEditBooking(booking)}
                        >
                          <BsPencil /> Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteBooking(booking._id)}
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
            <div className="alert alert-info">No bookings available</div>
          )}
        </div>
      </div>

      <Modal
        visible={editModalVisible}
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

export default AdminBookings;

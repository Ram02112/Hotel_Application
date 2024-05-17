import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import { jwtDecode } from "jwt-decode";
import { BsTrash } from "react-icons/bs";
const ExistingBooking = () => {
  const [existingBookings, setExistingBookings] = useState([]);
  const [customerEmail, setCustomerEmail] = useState("");
  const [error, setError] = useState("");
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
      message.error("Error deleting booking");
    }
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
    </div>
  );
};

export default ExistingBooking;

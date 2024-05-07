import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import { jwtDecode } from "jwt-decode";

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
    <div className="container mt-1">
      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <h3 className="card-title mb-4">Existing Bookings</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            {existingBookings && existingBookings.length > 0 ? (
              <div>
                <ul className="list-group">
                  {existingBookings.map((booking) => (
                    <li key={booking._id} className="list-group-item">
                      <span>Booking ID - {booking._id}</span>
                      <br />
                      <span>Booking For - {booking.name}</span> <br />
                      <span>
                        Number of People - {booking.numberOfPeople}
                      </span>{" "}
                      <br />
                      <span>
                        Date - {new Date(booking.date).toLocaleDateString()}
                      </span>{" "}
                      <br />
                      <span>Time - {booking.time}</span>
                      <br />
                      <br />
                      <button
                        className="btn btn-danger btn-sm ml-2"
                        onClick={() => handleDeleteBooking(booking._id)}
                      >
                        Cancel
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="alert alert-warning">No existing bookings</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExistingBooking;

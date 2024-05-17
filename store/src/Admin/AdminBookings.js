import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import { BsTrash } from "react-icons/bs";
function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

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
    </div>
  );
}

export default AdminBookings;

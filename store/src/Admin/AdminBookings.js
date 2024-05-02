import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

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
      <h2>Admin Bookings</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <table className="table">
        <thead>
          <tr>
            <th>Name of Booking</th>
            <th>Date</th>
            <th>Time</th>
            <th>Number of People</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td>{booking.name}</td>

              <td>{new Date(booking.date).toLocaleDateString()}</td>
              <td>{booking.time}</td>
              <td>{booking.numberOfPeople}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteBooking(booking._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminBookings;

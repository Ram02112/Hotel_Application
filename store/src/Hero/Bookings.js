import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import { jwtDecode } from "jwt-decode";

function Bookings() {
  const [customerEmail, setCustomerEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState("");
  const [existingBookings, setExistingBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const userEmail = getUserEmail();
    setCustomerEmail(userEmail);
    fetchExistingBookings(userEmail);
  }, []);

  const getUserEmail = () => {
    const token = localStorage.getItem("customerToken");
    const decodedToken = jwtDecode(token);
    return decodedToken.email;
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/booking/add", {
        customerEmail,
        date,
        time,
        numberOfPeople,
      });
      message.success(response.data.message);
      fetchExistingBookings(customerEmail);
      setCustomerEmail("");
      setDate("");
      setTime("");
      setNumberOfPeople("");
    } catch (error) {
      message.error(error.response.data.message);
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
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title mb-4">Make a Booking</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="date">Date:</label>
                  <input
                    type="date"
                    id="date"
                    required
                    className="form-control"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <br />
                <div className="form-group">
                  <label htmlFor="time">Time:</label>
                  <input
                    type="time"
                    id="time"
                    required
                    className="form-control"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
                <br />
                <div className="form-group">
                  <label htmlFor="numberOfPeople">Number of People:</label>
                  <input
                    type="number"
                    id="numberOfPeople"
                    required
                    className="form-control"
                    value={numberOfPeople}
                    onChange={(e) => setNumberOfPeople(e.target.value)}
                  />
                </div>
                <br />
                <button type="submit" className="btn btn-primary">
                  Book Now
                </button>
              </form>
            </div>
          </div>
        </div>
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
    </div>
  );
}

export default Bookings;

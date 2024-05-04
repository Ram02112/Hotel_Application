import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import { jwtDecode } from "jwt-decode";

function Bookings() {
  const [customerEmail, setCustomerEmail] = useState("");
  const [name, setName] = useState("");
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
    if (token) {
      const decodedToken = jwtDecode(token);
      return decodedToken.email;
    } else {
      return null;
    }
  };

  const handleTimeChange = (selectedTime) => {
    setTime(selectedTime);
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
        name,
        date,
        time: [time],
        numberOfPeople,
      });
      message.success(response.data.message);
      fetchExistingBookings(customerEmail);
      setName("");
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

  // Generate time slots from 10 AM to 9 PM
  const generateTimeSlots = () => {
    const slots = [];
    const currentHour = new Date().getHours();

    for (let i = 10; i <= 21; i++) {
      // Check if the time slot is in the future (after the current hour)
      if (i > currentHour) {
        slots.push(`${i}:00 - ${i + 1}:00`);
      }
    }
    return slots;
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
                  <label htmlFor="name">Booking Name:</label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <label htmlFor="date">Date:</label>
                  <input
                    type="date"
                    id="date"
                    required
                    className="form-control"
                    value={date}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <br />
                <div className="form-group">
                  <label htmlFor="time">Time:</label>
                  <select
                    id="time"
                    required
                    className="form-select"
                    value={time}
                    onChange={(e) => handleTimeChange(e.target.value)}
                  >
                    <option value="">Select a time slot</option>
                    {generateTimeSlots().map((slot, index) => (
                      <option
                        key={index}
                        value={slot}
                        className="list-group-item"
                      >
                        {slot}
                      </option>
                    ))}
                  </select>
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
                    max="6"
                    min="1"
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
    </div>
  );
}

export default Bookings;

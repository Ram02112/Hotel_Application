import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import { jwtDecode } from "jwt-decode";

const CateringForm = () => {
  const [cateringData, setCateringData] = useState({
    cateringName: "",
    address: "",
    phoneNumber: "",
    numberOfPeople: "",
  });
  const [customerEmail, setCustomerEmail] = useState("");
  const [existingCatering, setExistingCatering] = useState([]);
  const [error, setError] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const handleTimeChange = (selectedTime) => {
    setTime(selectedTime);
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
  useEffect(() => {
    const userEmail = getUserEmail();
    setCustomerEmail(userEmail);
    if (userEmail) {
      fetchExistingCatering(userEmail);
    }
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
      message.error("Error deleting booking");
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCateringData({ ...cateringData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/catering/create",
        {
          customerEmail,
          ...cateringData,
          date,
          time: [time],
        }
      );
      message.success(response.data.message);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      message.error(error.response.data.message);
      console.log(error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <h2>Book Catering</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Catering Name:</label>
              <input
                type="text"
                name="cateringName"
                value={cateringData.cateringName}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
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
                  <option key={index} value={slot} className="list-group-item">
                    {slot}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Address:</label>
              <input
                type="text"
                name="address"
                value={cateringData.address}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone Number:</label>
              <input
                type="text"
                name="phoneNumber"
                value={cateringData.phoneNumber}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Number of People:</label>
              <input
                type="number"
                name="numberOfPeople"
                value={cateringData.numberOfPeople}
                onChange={handleChange}
                className="form-control"
                required
                max="300"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Book Catering
            </button>
          </form>
        </div>
        <div className="col-md-6">
          <h2>Scheduled Catering</h2>
          {existingCatering && existingCatering.length > 0 ? (
            <ul className="list-group">
              {existingCatering.map((catering) => (
                <li key={catering._id} className="list-group-item">
                  <div>
                    <h4 className="mb-0">{catering.cateringName}</h4>
                    <p className="mb-1">ID: {catering._id}</p>
                    <p className="mb-1">
                      Date: {new Date(catering.date).toLocaleDateString()}
                    </p>
                    <p className="mb-1">Time Slot: {catering.time}</p>
                    <p className="mb-1">Address: {catering.address}</p>
                    <p className="mb-1">Phone Number: {catering.phoneNumber}</p>
                    <p className="mb-1">
                      Number of People: {catering.numberOfPeople}
                    </p>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteBooking(catering._id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="alert alert-warning">No scheduled catering</div>
          )}
          {error && <div className="alert alert-danger">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default CateringForm;

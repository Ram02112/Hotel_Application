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

  useEffect(() => {
    const userEmail = getUserEmail();
    setCustomerEmail(userEmail);
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
  const handleTimeChange = (selectedTime) => {
    setTime(selectedTime);
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
      message.success({ response: response.data.message, duration: 3 });

      setName("");
      setDate("");
      setTime("");
      setNumberOfPeople("");
    } catch (error) {
      message.error({ response: error.response.data.message, duration: 3 });
    }
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
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Make a Booking</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Booking Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="date" className="form-label">
                    Date
                  </label>
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
                <div className="mb-3">
                  <label htmlFor="time" className="form-label">
                    Time
                  </label>
                  <select
                    id="time"
                    required
                    className="form-select"
                    value={time}
                    onChange={(e) => handleTimeChange(e.target.value)}
                  >
                    <option value="">Select a time slot</option>
                    {generateTimeSlots().map((slot, index) => (
                      <option key={index} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="numberOfPeople" className="form-label">
                    Number of People
                  </label>
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
                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-block"
                >
                  Book Now
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bookings;

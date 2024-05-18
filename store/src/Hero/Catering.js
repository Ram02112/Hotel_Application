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
      message.success({ response: response.data.message, duration: 3 });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      message.error({ response: error.response.data.message, duration: 3 });
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Book Catering</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="cateringName" className="form-label">
                    Catering Name:
                  </label>
                  <input
                    type="text"
                    id="cateringName"
                    name="cateringName"
                    value={cateringData.cateringName}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="date" className="form-label">
                    Date:
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
                    Time:
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
                  <label htmlFor="address" className="form-label">
                    Address:
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={cateringData.address}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="phoneNumber" className="form-label">
                    Phone Number:
                  </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={cateringData.phoneNumber}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="numberOfPeople" className="form-label">
                    Number of People:
                  </label>
                  <input
                    type="number"
                    id="numberOfPeople"
                    name="numberOfPeople"
                    value={cateringData.numberOfPeople}
                    onChange={handleChange}
                    className="form-control"
                    required
                    max="300"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-block"
                >
                  Book Catering
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CateringForm;

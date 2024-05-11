import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import { jwtDecode } from "jwt-decode";

const ExistingCatering = () => {
  const [customerEmail, setCustomerEmail] = useState("");
  const [existingCatering, setExistingCatering] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    const userEmail = getUserEmail();
    setCustomerEmail(userEmail);
    fetchExistingCatering(userEmail);
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
  return (
    <div className="container">
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
  );
};

export default ExistingCatering;

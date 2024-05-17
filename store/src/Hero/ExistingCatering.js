import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import { jwtDecode } from "jwt-decode";
import { BsTrash } from "react-icons/bs";
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
    <div className="container mt-4">
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {existingCatering.map((catering, index) => (
          <div key={index} className="col">
            <div className="card shadow">
              <div className="card-body">
                <h5 className="card-title text-center mb-3">
                  Catering {index + 1}
                </h5>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="table-responsive">
                  <table className="table table-bordered table-striped mb-4">
                    <tbody>
                      <tr>
                        <td className="fw-bold">Catering ID:</td>
                        <td>{catering._id}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Catering Name:</td>
                        <td>{catering.cateringName}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Number of People:</td>
                        <td>{catering.numberOfPeople}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Date:</td>
                        <td>{new Date(catering.date).toLocaleDateString()}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Time:</td>
                        <td>{catering.time}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Address:</td>
                        <td>{catering.address}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Phone Number:</td>
                        <td>{catering.phoneNumber}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    className="btn btn-danger btn-sm rounded-pill px-3 py-1"
                    onClick={() => handleDeleteBooking(catering._id)}
                  >
                    <BsTrash /> Delete
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

export default ExistingCatering;

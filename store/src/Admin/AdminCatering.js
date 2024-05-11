import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";

function AdminCatering() {
  const [caterings, setCaterings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCaterings();
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
  const fetchCaterings = async () => {
    try {
      const response = await axios.get("http://localhost:4000/catering");
      if (response.data && Array.isArray(response.data.data)) {
        setCaterings(response.data.data);
      } else {
        setError("No catering data available");
      }
    } catch (error) {
      setError("Error fetching catering data");
    }
  };

  const handleDeleteCatering = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/catering/cancelbooking/${id}`);
      message.success("catering deleted successfully");
      fetchCaterings();
    } catch (error) {
      message.error("Error deleting catering");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Admin Caterings</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {caterings.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Catering for</th>
              <th>Date</th>
              <th>Time</th>
              <th>Address</th>
              <th>Phone Number</th>
              <th>Number of People</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {caterings.map((catering) => (
              <tr key={catering._id}>
                <td>{catering._id}</td>
                <td>{catering.cateringName}</td>
                <td>{new Date(catering.date).toLocaleDateString()}</td>
                <td>{catering.time}</td>
                <td>{catering.address}</td>
                <td>{catering.phoneNumber}</td>
                <td>{catering.numberOfPeople}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteCatering(catering._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="alert alert-info">No caterings booked</div>
      )}
    </div>
  );
}

export default AdminCatering;

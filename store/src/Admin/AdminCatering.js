import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import { BsTrash } from "react-icons/bs";
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
      <div className="card">
        <h2 className="card-header bg-dark text-white text-center">
          Admin Caterings
        </h2>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {caterings.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th scope="col">Booking ID</th>
                    <th scope="col">Catering for</th>
                    <th scope="col">Date</th>
                    <th scope="col">Time</th>
                    <th scope="col">Address</th>
                    <th scope="col">Phone Number</th>
                    <th scope="col">Number of People</th>
                    <th scope="col">Action</th>
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
                          <BsTrash /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-info">No caterings booked</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminCatering;

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsBoxArrowRight } from "react-icons/bs";
import "bootstrap/dist/css/bootstrap.min.css";

const AdNb = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/admin");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link to="/admin" className="navbar-brand">
          Admin Page
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/menu" className="nav-link">
                Menu
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/orderstatus" className="nav-link">
                Order Status
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/inventory" className="nav-link">
                Inventory
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/report" className="nav-link">
                Report
              </Link>
            </li>
            <li className="nav-item">
              <button className="btn btn-outline-light" onClick={handleLogout}>
                <BsBoxArrowRight />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AdNb;

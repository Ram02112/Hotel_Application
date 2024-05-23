import React, { useState } from "react";
import axios from "axios";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/news/subscribe", { email });
      alert("Subscribed successfully!");
      setEmail("");
    } catch (error) {
      console.error("Failed to subscribe:", error);
      alert("Failed to subscribe");
    }
  };

  return (
    <footer className="bg-dark text-light py-5">
      <div className="container">
        <div className="row">
          {/* About Us */}
          <div className="col-md-3 mb-4 mb-md-0">
            <h4>About Us</h4>
            <p>
              Three new entrepreneurs embarked on our journey to bring a high
              quality fast food restaurant chain in Adelaide CBD.
            </p>
          </div>

          {/* Address */}
          <div className="col-md-3 mb-4 mb-md-0">
            <h4>Contact Us</h4>
            <p>6/127 Rundle Mall, Adelaide SA 5000</p>
            <ul className="list-unstyled">
              <li>
                <span>Phone: </span> (08) 8888 8888
              </li>
              <li>
                <span>Email: </span> restaurantmanagement@gmail.com
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div className="col-md-3 mb-4 mb-md-0">
            <h4>Opening Hours</h4>
            <ul className="list-unstyled">
              <li>
                <span>Mon - Tues : </span> 10.00 am - 10.00 pm
              </li>
              <li>
                <span>Wednes - Thurs :</span> closed
              </li>
              <li>
                <span>Fri- Sun : </span> 10.00 am - 10.00 pm
              </li>
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div className="col-md-3">
            <h4>Newsletter</h4>
            <form onSubmit={handleSubscribe}>
              <div className="form-group">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary mt-2">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="container mt-5">
        <div className="row align-items-center">
          <div className="col-md-4 mb-3 mb-md-0">
            <p className="text-light">
              &copy; Copyright 2024. All Rights Reserved by Restaurant
            </p>
          </div>
        </div>
      </div>
      {/* End Footer Bottom */}
    </footer>
  );
};

export default Footer;

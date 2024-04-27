import React from "react";
import UserNavbar from "../Header/NavBar/Navbar";
import { BsGeoAlt, BsClock, BsTelephone, BsEnvelopeOpen } from "react-icons/bs";
import "./Contact.css";
import Footer from "../Footer/Footer";

const Contact = () => {
  return (
    <div>
      <UserNavbar />
      <div className="contact-us-area py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-8 offset-md-2">
              <div className="contact-content">
                <h2 className="contact-heading mb-4">Contact Us</h2>
                <p className="contact-description mb-4">
                  If you have any questions or inquiries, feel free to reach out
                  to us. We're here to help!
                </p>
                <div className="address-items">
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <div className="address-item">
                        <BsGeoAlt className="address-icon" />
                        <div className="address-details">
                          <span className="font-weight-bold">Address:</span>
                          <span>
                            22 Baker Street,
                            <br /> London, United Kingdom,
                            <br /> W1U 3BW
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="address-item">
                        <BsClock className="address-icon" />
                        <div className="address-details">
                          <span className="font-weight-bold">Email:</span>
                          <span>
                            info@yourdomain.com
                            <br />
                            admin@yourdomain.com
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="address-item">
                        <BsTelephone className="address-icon" />
                        <div className="address-details">
                          <span className="font-weight-bold">Phone:</span>
                          <span>
                            +44-20-7328-4499 <br />
                            +99-34-8878-9989
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="address-item">
                        <BsEnvelopeOpen className="address-icon" />
                        <div className="address-details">
                          <span className="font-weight-bold">Email:</span>
                          <span>
                            info@yourdomain.com
                            <br />
                            admin@yourdomain.com
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;

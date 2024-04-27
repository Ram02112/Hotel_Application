import React from "react";
const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5">
      <div className="container">
        <div className="row">
          {/* About Us */}
          <div className="col-md-4 mb-4 mb-md-0">
            <h4>About Us</h4>
            <p>
              Excellence decisively nay man yet impression for contrasted
              remarkably. There spoke happy for you are out. Fertile how old
              address.
            </p>
          </div>

          {/* Address */}
          <div className="col-md-4 mb-4 mb-md-0">
            <p>
              20, floor, Queenslad Victoria Building. 60 california street
              california USA
            </p>
            <ul className="list-unstyled">
              <li>
                <span>Phone: </span> +123 456 7890
              </li>
              <li>
                <span>Email: </span> something@something.com
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div className="col-md-4">
            <h4>Opening Hours</h4>
            <ul className="list-unstyled">
              <li>
                <span>Mon - Tues : </span> 6.00 am - 10.00 pm
              </li>
              <li>
                <span>Wednes - Thurs :</span> 8.00 am - 6.00 pm
              </li>
              <li>
                <span>Sun : </span> Closed
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="container mt-5">
        <div className="row align-items-center">
          <div className="col-md-4 mb-3 mb-md-0">
            <p className="text-light">
              &copy; Copyright 2019. All Rights Reserved by Restaurant
            </p>
          </div>
        </div>
      </div>
      {/* End Footer Bottom */}
    </footer>
  );
};

export default Footer;

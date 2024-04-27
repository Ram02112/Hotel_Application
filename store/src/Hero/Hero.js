import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from "../assets/img/banner/3.jpg";
import aboutImage from "../assets/img/banner/1.jpeg";
import FoodMenuItem from "./FoodMenuItem";

const Hero = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/products")
      .then((response) => response.json())
      .then((data) => setMenuItems(data.slice(0, 6)))
      .catch((error) => console.error("Error fetching menu items:", error));
  }, []);
  return (
    <div>
      <div
        style={{
          backgroundImage: `url(${Image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "100vh",
        }}
      >
        <div className="content d-flex flex-column">
          <h3 className="text-light fw-light">Welcome to RestCafe</h3>
          <h1 className="text-light fw-light fs-1">
            Awesome delicious food Collections
          </h1>
        </div>
      </div>
      <br /> <br />
      <div className="about-area default-padding">
        <div className="container">
          <div className="row">
            <div className="col-md-6 thumb">
              <img
                src={aboutImage}
                alt="Thumb"
                className="img-fluid"
                style={{ height: 500, width: 500 }}
              />
            </div>
            <div className="col-md-6 info">
              <h3>Our Story</h3>
              <h2>
                Until I discovered cooking I was never really interested in
                anything
              </h2>
              <p>
                Pleased anxious or as in by viewing forbade minutes prevent. Too
                leave had those get being led weeks blind. Had men rose from
                down lady able. Its son him ferrars proceed six parlors.
              </p>

              <div className="address">
                <ul className="list-unstyled">
                  <li>
                    <span>Address</span>
                    <p>22 Baker Street, London, United Kingdom, W1U 3BW</p>
                  </li>
                  <li>
                    <span>Phone</span>
                    <p>+123 456 7890</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <br />
      <div className="row d-flex justify-content-center">
        <div className="col-md-8 col-md-offset-2">
          <div className="site-heading text-center">
            <h3>Discover</h3>
            <h2>Our Menu</h2>
            <p>
              While mirth large of on front. Ye he greater related adapted
              proceed entered an. Through it examine express promise no. Past
              add size game cold girl off how old
            </p>
          </div>
        </div>
      </div>
      <br />
      <div className="container mx-auto">
        <div className="row">
          {menuItems.map((item) => (
            <div className="col-md-4" key={item._id}>
              <FoodMenuItem
                image={item.image}
                price={item.price}
                name={item.name}
                ingredients={item.description}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;

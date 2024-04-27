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
        className="d-flex justify-content-center align-items-center"
      >
        <div className="content text-center text-light ">
          <h3 className="fw-light fs-1 ">Welcome to RestCafe</h3>
          <h1 className="fw-light fs-1">Awesome delicious food Collections</h1>
        </div>
      </div>
      <br />
      <br />

      <div className="about-area default-padding">
        <div className="container">
          <div className="row">
            <div className="col-6">
              <img
                src={aboutImage}
                alt="Thumb"
                className="img-fluid rounded "
                style={{ height: "700px", width: "100%" }}
              />
            </div>
            <div className="col-md-6 info d-flex flex-column justify-content-center bg-light p-6 rounded">
              <h3>Our Story</h3>
              <h2 className="fw-light fs-1">
                Until I discovered cooking I was never really interested in
                anything
              </h2>
              <p className="lead">
                Nestled in the heart of downtown, our burger restaurant beckons
                with the tantalizing aroma of sizzling patties and freshly baked
                buns. Step through our doors and be greeted by the warm ambiance
                of rustic décor and friendly chatter. Our menu boasts a
                delectable array of handcrafted burgers, each a masterpiece of
                flavor and texture. Sink your teeth into our signature "Juicy
                Lucy," oozing with melted cheese, or savor the smoky allure of
                our barbecue bacon burger. Vegetarian? No problem! Our veggie
                burger, packed with wholesome ingredients and bursting with
                flavor, is sure to delight even the most discerning palate. Pair
                your burger with a side of crispy golden fries or opt for our
                zesty coleslaw for a refreshing crunch. Whether you're grabbing
                a quick bite on your lunch break or settling in for a leisurely
                dinner, our burger joint promises a satisfying experience that
                will keep you coming back for more.
              </p>
              <div className="address">
                <ul className="list-unstyled">
                  <li>
                    <h4>Address</h4>
                    <p className="fw-light fs-6">
                      20, floor, Queenslad Victoria Building. 60 california
                      street california USA
                    </p>
                  </li>
                  <li>
                    <h4>Phone</h4>
                    <p className="fw-light fs-6">+123 456 7890</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <br />

      <div className="site-heading text-center bg-dark text-light p-1">
        <h1 className="fw-light">Our Menu</h1>
      </div>
      <br />

      <div className="container mx-auto">
        <div className="row">
          {menuItems.map((item) => (
            <div className="col-md-4 mb-4" key={item._id}>
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

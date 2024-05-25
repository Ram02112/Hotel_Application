import React, { useState, useEffect } from "react";

const Feedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await fetch("http://localhost:4000/feedback");

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setFeedbackList(data);
      } else {
        console.error("Failed to fetch feedback");
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-5 display-4">Feedback From Users</h2>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <ul className="list-group">
            {feedbackList.map((feedback, index) => (
              <li
                key={index}
                className="list-group-item mb-4 p-4 border-0 shadow-sm"
                style={{ background: "#343a40", color: "#f8f9fa" }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-2 font-weight-bold">
                      Rating:
                      <span className="text-warning ml-2">
                        {Array.from({ length: feedback.rating }).map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="#ffc107"
                            className="bi bi-star-fill"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8 .29l1.902 5.826h5.997a.607.607 0 0 1 .464 1.02l-4.833 3.513 1.903 5.827a.608.608 0 0 1-.923.675L8 13.201l-4.513 3.168a.608.608 0 0 1-.923-.675l1.903-5.827L.637 7.136a.607.607 0 0 1 .464-1.02h5.997L8 .291a.608.608 0 0 1 .503-.002z" />
                          </svg>
                        ))}
                      </span>
                    </h5>
                    <p className="mb-2 font-italic">"{feedback.comment}"</p>
                  </div>
                  <small className="font-italic">By: {feedback.user}</small>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Feedback;

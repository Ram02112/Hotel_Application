import React, { useState } from "react";
import { Button, Result, Modal, Rate, Input, message } from "antd";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;

const OrderResult = (props) => {
  const { visible, onCancel } = props;
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleFeedbackSubmit = () => {
    const token = localStorage.getItem("customerToken");
    const feedbackData = {
      rating: rating,
      comment: comment,
    };
    fetch("http://localhost:4000/feedback/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(feedbackData),
    })
      .then((response) => {
        if (response.ok) {
          message.success("Feedback submitted successfully");
          navigate("/");
        } else {
          message.error("Failed to submit feedback");
        }
      })
      .catch((error) => {
        console.error("Error submitting feedback:", error);
        message.error("Failed to submit feedback");
      });
  };

  const handleSkipFeedback = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <Modal
      title="Order Result"
      width={700}
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Result
        status="success"
        title="Successfully Purchased Product(s)"
        subTitle="Thank you for purchasing"
        extra={[
          <div key="feedback">
            <p>How would you rate your experience?</p>
            <Rate onChange={handleRatingChange} value={rating} />
            <p>Add a comment (optional):</p>
            <TextArea rows={4} onChange={handleCommentChange} value={comment} />
            <Button type="primary" onClick={handleFeedbackSubmit}>
              Submit Feedback
            </Button>
            <Button onClick={handleSkipFeedback}>Skip</Button>
          </div>,
          <Button type="primary" key="console" onClick={handleGoBack}>
            Go to Home
          </Button>,
        ]}
      />
    </Modal>
  );
};

export default OrderResult;

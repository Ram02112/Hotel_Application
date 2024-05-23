import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const NewsletterComposer = () => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/news/sendNewsletter", {
        subject,
        content,
      });
      alert("Newsletter sent successfully!");
      setSubject("");
      setContent("");
    } catch (error) {
      console.error("Failed to send newsletter:", error);
      alert("Failed to send newsletter");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-header text-center bg-primary text-white">
          <h2>Compose Newsletter</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                className="form-control"
                id="subject"
                placeholder="Enter subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="content">Content</label>
              <textarea
                className="form-control"
                id="content"
                rows="6"
                placeholder="Enter content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={{ resize: "none" }}
                required
              />
            </div>
            <button type="submit" className="btn btn-success btn-block mt-3">
              Send Newsletter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewsletterComposer;

const express = require("express");
const router = express.Router();
const Feedback = require("../models/FeedBack");
const jwt = require("jsonwebtoken");

router.post("/add", async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!req.headers.authorization) {
      return res
        .status(401)
        .json({ message: "Authorization header is missing" });
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token is missing" });
    }
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_KEY);
    } catch (error) {
      return res.status(401).json({ message: "Token is invalid" });
    }
    const user = decodedToken.email;
    if (!user) {
      return res
        .status(401)
        .json({ message: "User information is missing in token" });
    }
    const newFeedback = new Feedback({
      rating,
      comment,
      user,
    });
    await newFeedback.save();
    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ message: "Failed to submit feedback" });
  }
});

router.get("/", async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Failed to fetch feedback" });
  }
});

module.exports = router;

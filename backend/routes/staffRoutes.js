const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Staff } = require("../models/Staff");
const { Token } = require("../models/Token");
const { staffAuth } = require("../middlewares/auth");

router.post("/signup", async (req, res) => {
  try {
    const existingStaff = await Staff.findOne({ email: req.body.email });
    if (existingStaff) {
      return res.status(401).json({
        status: false,
        message: "Email already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newStaff = new Staff({ ...req.body, password: hashedPassword });
    const savedStaff = await newStaff.save();
    return res.status(200).json({
      status: true,
      message: "Registration successful!",
      data: savedStaff,
    });
  } catch (error) {
    console.error("Error during staff signup:", error);
    return res.status(500).json({
      status: false,
      message: "Server error during signup",
    });
  }
});

// Route for staff login
router.post("/login", async (req, res) => {
  try {
    const staff = await Staff.findOne({ email: req.body.email });
    if (!staff) {
      return res.status(401).json({
        status: false,
        message: "User not found",
      });
    }
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      staff.password
    );
    if (passwordMatch) {
      const token = jwt.sign(
        { email: staff.email, staffId: staff._id },
        process.env.JWT_KEY,
        { expiresIn: "2h" }
      );
      await Token.findOneAndUpdate(
        { _staffId: staff._id, tokenType: "login" },
        { token: token },
        { new: true, upsert: true }
      );
      return res.status(200).json({
        status: true,
        message: "Login successful!",
        data: { token, staff },
      });
    } else {
      return res.status(401).json({
        status: false,
        message: "Invalid password",
      });
    }
  } catch (error) {
    console.error("Error during staff login:", error);
    return res.status(500).json({
      status: false,
      message: "Server error during login",
    });
  }
});

// Route for staff logout
router.get("/logout", staffAuth, async (req, res) => {
  try {
    await Token.findOneAndDelete({ _staffId: req.staffId, tokenType: "login" });
    return res.status(200).json({
      status: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Error during staff logout:", error);
    return res.status(500).json({
      status: false,
      message: "Server error during logout",
    });
  }
});

// Route to authenticate staff
router.get("/authStaff", staffAuth, async (req, res) => {
  try {
    const staffId = req.staffId;
    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(401).json({
        status: false,
        message: "Staff not found",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Authentication successful",
      data: staff,
    });
  } catch (error) {
    console.error("Error during staff authentication:", error);
    return res.status(500).json({
      status: false,
      message: "Server error during authentication",
    });
  }
});

module.exports = router;

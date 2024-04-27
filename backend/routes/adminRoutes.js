const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Admin } = require("../models/Admin");
const { Token } = require("../models/Token");
const { adminAuth } = require("../middlewares/auth");

router.post("/signup", (req, res) => {
  Admin.find({ email: req.body.email })
    .exec()
    .then((admin) => {
      if (admin.length >= 1) {
        return res.status(401).json({
          status: false,
          message: "Email exists",
          data: undefined,
        });
      } else {
        bcrypt.hash(req.body.password, 2, (err, hash) => {
          if (err) {
            return res.status(500).json({
              status: false,
              message: "Error, cannot encrypt password",
              data: undefined,
            });
          } else {
            const admin = new Admin({ ...req.body, password: hash });
            admin.save((err, doc) => {
              if (err)
                return res.json({
                  status: false,
                  message: err,
                  data: undefined,
                });
              return res.status(200).json({
                status: true,
                message: "Register successfull!",
                data: doc,
              });
            });
          }
        });
      }
    });
});

router.post("/login", (req, res) => {
  Admin.findOne({ email: req.body.email })
    .exec()
    .then((admin) => {
      if (!admin) {
        return res.status(401).json({
          message: "User not found",
          status: false,
          data: undefined,
        });
      }
      bcrypt.compare(req.body.password, admin.password, async (err, result) => {
        if (err) {
          return res.status(401).json({
            status: false,
            message: "Server error, authentication failed",
            data: undefined,
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: admin.email,
              adminId: admin._id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "2h",
            }
          );

          await Token.findOneAndUpdate(
            { _adminId: admin._id, tokenType: "login" },
            { token: token },
            { new: true, upsert: true }
          );
          return res.status(200).json({
            status: true,
            message: "Login successfull!",
            data: {
              token,
              admin,
            },
          });
        }
        return res.status(401).json({
          status: false,
          message: "Wrong password, login failed",
          data: undefined,
        });
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: false,
        message: "Server error, authentication failed",
        data: undefined,
      });
    });
});

router.get("/logout", adminAuth, (req, res) => {
  Token.findOneAndDelete(
    { _adminId: req.adminId, tokenType: "login" },
    (err, doc) => {
      if (err)
        return res.status(401).json({
          status: false,
          message: "Server error, logout failed",
        });
      return res.status(200).json({
        status: true,
        message: "Logout successfull",
      });
    }
  );
});

router.get("/authAdmin", adminAuth, (req, res) => {
  const adminId = req.adminId;
  Admin.findById(adminId, (err, admin) => {
    if (err) {
      return res.status(401).json({
        status: false,
        message: "Authentication failed",
        data: undefined,
      });
    }
    if (admin) {
      res.status(200).json({
        data: admin,
        message: "Authentication successfull!",
        status: true,
      });
    }
  });
});

module.exports = router;

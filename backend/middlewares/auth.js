const { Token } = require("../models/Token");
const jwt = require("jsonwebtoken");

let auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    Token.findOne(
      { _customerId: decoded.customerId, token, tokenType: "login" },
      (err, customerToken) => {
        if (err) throw err;
        if (!customerToken) {
          return res.json({
            status: false,
            message: "Authentication failed",
          });
        }
        req.token = token;
        req.customerId = decoded.customerId;
        next();
      }
    );
  } catch (error) {
    return res.json({
      status: false,
      message: "Authentication failed",
    });
  }
};
let adminAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    Token.findOne(
      { _adminId: decoded.adminId, token, tokenType: "login" },
      (err, adminToken) => {
        if (err) throw err;
        if (!adminToken) {
          return res.json({
            status: false,
            message: "Authentication failed",
          });
        }
        req.token = token;
        req.adminId = decoded.adminId;
        next();
      }
    );
  } catch (error) {
    return res.json({
      status: false,
      message: "Authentication failed",
    });
  }
};
let staffAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    Token.findOne(
      { _staffId: decoded.staffId, token, tokenType: "login" },
      (err, staffToken) => {
        if (err) throw err;
        if (!staffToken) {
          return res.json({
            status: false,
            message: "Authentication failed",
          });
        }
        req.token = token;
        req.staffId = decoded.staffId;
        next();
      }
    );
  } catch (error) {
    return res.json({
      status: false,
      message: "Authentication failed",
    });
  }
};

module.exports = { auth, adminAuth, staffAuth };

const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema({
  firstName: {
    type: String,
    maxLength: 50,
  },
  lastName: {
    type: String,
    maxLength: 50,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    minLength: 6,
  },
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = { Admin };

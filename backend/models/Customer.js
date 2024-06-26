const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customSchema = Schema({
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
  isStudent: {
    type: Boolean,
  },
});

const Customer = mongoose.model("customers", customSchema);
module.exports = { Customer };

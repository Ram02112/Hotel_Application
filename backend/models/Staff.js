const mongoose = require("mongoose");
const staffSchema = new mongoose.Schema({
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

const Staff = mongoose.model("Staff", staffSchema);

module.exports = { Staff };

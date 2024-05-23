const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
});

const Subscriber = mongoose.model("subcriber", subscriberSchema);

module.exports = { Subscriber };

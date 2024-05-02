const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    name: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    numberOfPeople: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("bookings", bookingSchema);

module.exports = Booking;

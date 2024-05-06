const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cateringSchema = new Schema({
  cateringName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  numberOfPeople: {
    type: Number,
    required: true,
  },
  date: { type: Date, required: true },
  time: { type: [String], required: true },
  customer: {
    type: Schema.Types.ObjectId,
    ref: "customers",
    required: true,
  },
});

const Catering = mongoose.model("catering", cateringSchema);
module.exports = Catering;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = Schema({
  token: {
    type: String,
    required: true,
  },
  _customerId: {
    type: Schema.Types.ObjectId,
    ref: "customers",
  },
  _adminId: { type: Schema.Types.ObjectId, required: true },
  tokenType: {
    type: String,
    enum: ["login", "resetPassword"],
  },
});

const Token = mongoose.model("tokens", tokenSchema);
module.exports = { Token };

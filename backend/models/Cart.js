const mongoose = require("mongoose");
const orderDetailsSchema = require("./Order").OrderDetails.schema;
const cartSchema = mongoose.Schema({
  _customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customers",
    required: true,
  },
  cartDetails: [
    {
      type: orderDetailsSchema,
    },
  ],
});

const Cart = mongoose.model("carts", cartSchema);

module.exports = { Cart };

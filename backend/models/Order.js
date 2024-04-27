const mongoose = require("mongoose");

const orderDetailsSchema = mongoose.Schema(
  {
    _product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    price: {
      type: Number,
    },
    quantity: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
    },
  },
  {
    versionKey: false,
    _id: false,
  }
);

const OrderDetails = mongoose.model("orderDetails", orderDetailsSchema);

module.exports = { OrderDetails };

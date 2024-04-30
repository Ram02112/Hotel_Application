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

const orderSchema = mongoose.Schema({
  _customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customers",
    required: true,
  },
  orderDetails: [
    {
      type: orderDetailsSchema,
    },
  ],
  orderDate: {
    type: Date,
    default: Date.now(),
  },
  totalAmount: {
    type: Number,
  },
  paymentId: {
    type: String,
  },
});

const Order = mongoose.model("orders", orderSchema);

const OrderDetails = mongoose.model("orderDetails", orderDetailsSchema);

module.exports = { OrderDetails, Order };

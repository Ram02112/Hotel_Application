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
    ref: "customers", // Reference to the customers collection
    required: true,
  },
  customerName: {
    type: String, // Store the customer name directly in the order document
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

orderSchema.pre("save", async function (next) {
  try {
    const customer = await mongoose
      .model("customers")
      .findById(this._customerId);
    if (customer) {
      this.customerName = customer.name;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Order = mongoose.model("orders", orderSchema);
const OrderDetails = mongoose.model("orderDetails", orderDetailsSchema);

module.exports = { OrderDetails, Order };

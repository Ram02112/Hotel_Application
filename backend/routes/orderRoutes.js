const express = require("express");
const router = express.Router();

const stripe = require("stripe")(process.env.STRIPE_S_KEY);
const { Customer } = require("../models/Customer");
const { Order } = require("../models/Order");

const { Cart } = require("../models/Cart");

const { auth } = require("../middlewares/auth");

const populate = {
  path: "orderDetails",
  populate: {
    path: "_product",
    model: "Product",
    populate: {
      path: "_category",
      model: "Category",
    },
  },
};

router.post("/checkout", auth, (req, res) => {
  Cart.findOne({
    _customerId: req.customerId,
  }).exec(async (err, data) => {
    if (err) return res.status(400).json({ success: false, err });
    const token = req.body.token;
    const totalAmount = req.body.total;
    const charge = await stripe.charges.create({
      amount: Math.round(totalAmount * 100),
      currency: "usd",
      description: "Payment for Order",
      source: token.id,
    });
    const orderData = {
      _customerId: data._customerId,
      orderDetails: data.cartDetails,
      paymentId: charge.id,
      orderDate: new Date(),
      totalAmount,
    };

    const newOrder = Order(orderData);
    newOrder.save(async (err, data) => {
      if (err) return res.status(400).json({ success: false, err });
      else {
        await Cart.deleteOne({
          _customerId: req.customerId,
        });
        return res.status(200).json({
          status: true,
          message: "Order placed successfully",
          data,
        });
      }
    });
  });
});

router.get("/orderHistory", auth, (req, res) => {
  Order.find({
    _customerId: req.customerId,
  })
    .sort({
      orderDetails: "desc",
    })
    .populate(populate)
    .exec((err, data) => {
      if (err)
        return res.status(400).json({
          status: false,
          err,
        });
      return res.status(200).json({
        status: true,
        message: "Order History found successfully",
        data,
      });
    });
});

router.get("/report", auth, (req, res) => {
  Order.find()
    .sort({ orderDate: "desc" })
    .populate(populate)
    .exec((err, data) => {
      if (err)
        return res.status(400).json({
          status: false,
          err,
        });
      return res.status(200).json({
        status: true,
        message: "Report data found successfully",
        data,
      });
    });
});

router.get("/allOrders", auth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderDate: "desc" }).exec();

    const ordersWithCustomerName = await Promise.all(
      orders.map(async (order) => {
        const customer = await Customer.findById(order._customerId);
        console.log(customer);
        const customerName = customer
          ? customer.firstName + customer.lastName
          : "N/A";
        console.log("Customer Name:", customerName);
        return {
          ...order.toObject(),
          customerName,
        };
      })
    );
    console.log(ordersWithCustomerName);
    res.status(200).json({
      status: true,
      message: "All orders retrieved successfully",
      data: ordersWithCustomerName,
    });
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res.status(500).json({
      status: false,
      message: "Error retrieving orders",
      error,
    });
  }
});

module.exports = router;

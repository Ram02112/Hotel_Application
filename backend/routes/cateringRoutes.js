const router = require("express").Router();
const Catering = require("../models/Catering");
const { Customer } = require("../models/Customer");

router.post("/create", async (req, res) => {
  const customerEmail = req.body.customerEmail;
  try {
    const customer = await Customer.findOne({ email: customerEmail });
    if (!customer) {
      return res
        .status(400)
        .json({ status: false, message: "Customer not found" });
    }

    const newCatering = new Catering({
      cateringName: req.body.cateringName,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
      numberOfPeople: req.body.numberOfPeople,
      date: req.body.date,
      time: req.body.time,
      customer: customer._id,
    });

    const savedCatering = await newCatering.save();
    res.status(200).json({
      status: true,
      message: "Booking successful!",
      savedCatering,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Booking failed!",
      error,
    });
    console.log(error);
  }
});

router.get("/", (req, res) => {
  Catering.find()
    .exec()
    .then((data) => {
      res
        .status(200)
        .json({ status: true, message: "Get Catering success", data });
    })
    .catch((err) => {
      res.status(400).json({ status: false, err });
    });
});

router.get("/customer/:customerEmail", async (req, res) => {
  try {
    const customerEmail = req.params.customerEmail;
    const customer = await Customer.findOne({ email: customerEmail });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    const caterings = await Catering.find({ customer: customer._id });
    res
      .status(200)
      .json({ status: true, message: "get catering successfull", caterings });
  } catch (err) {
    res.status(400).json({ status: false, message: "Error", err });
  }
});

router.delete("/cancelbooking/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Catering.findByIdAndDelete(id);
    res.status(200).json({ message: "Catering cancelled successfully" });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;

const router = require("express").Router();
const Catering = require("../models/Catering");
const { Customer } = require("../models/Customer");
const schedule = require("node-schedule");
const moment = require("moment");
const { auth } = require("../middlewares/auth");

const deleteBookingAtTime = async (bookingId, date, startTime) => {
  const currentDate = moment();
  const bookingTime = moment(date).set({ hour: startTime, minute: 2 });

  const delay = currentDate.isAfter(bookingTime)
    ? 0
    : bookingTime.diff(currentDate);

  const job = schedule.scheduleJob(bookingTime.toDate(), async () => {
    try {
      await Catering.findByIdAndDelete(bookingId);
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  });

  setTimeout(() => {
    job.cancel();
  }, delay);
};

router.post("/create", auth, async (req, res) => {
  const customerEmail = req.body.customerEmail;
  try {
    const customer = await Customer.findOne({ email: customerEmail });
    if (!customer) {
      return res
        .status(400)
        .json({ status: false, message: "Customer not found" });
    }
    const existingCatering = await Catering.findOne({
      date: req.body.date,
      time: req.body.time,
    });

    if (existingCatering) {
      return res.status(400).json({
        status: false,
        message:
          "Our staff is busy with other catering order, Please try tomorrow.",
      });
    }

    const { cateringName, address, phoneNumber, numberOfPeople, date, time } =
      req.body;
    if (!Array.isArray(time) || time.length === 0) {
      throw new Error("Invalid time format");
    }
    const firstTime = time[0];
    const [startTime] = firstTime.split("-")[0].split(":");

    const newCatering = new Catering({
      cateringName,
      address,
      phoneNumber,
      numberOfPeople,
      date,
      time: firstTime,
      customer: customer._id,
    });

    const savedCatering = await newCatering.save();

    deleteBookingAtTime(savedCatering._id, date, parseInt(startTime));

    res.status(200).json({
      status: true,
      message: "Booking successful!",
      savedCatering,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Booking failed!",
      error: error.message,
    });
    console.error(error);
  }
});

router.get("/", auth, (req, res) => {
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

router.get("/customer/:customerEmail", auth, async (req, res) => {
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

router.delete("/cancelbooking/:id", auth, async (req, res) => {
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

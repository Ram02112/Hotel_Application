const router = require("express").Router();
const Booking = require("../models/Booking");
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
      await Booking.findByIdAndDelete(bookingId);
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  });

  setTimeout(() => {
    job.cancel();
  }, delay);
};

router.post("/add", auth, async (req, res) => {
  try {
    const date = Date.parse(req.body.date);
    const timeSlots = req.body.time;
    const name = req.body.name;
    const numberOfPeople = Number(req.body.numberOfPeople);
    const customerEmail = req.body.customerEmail;

    const newBookings = [];

    for (const slot of timeSlots) {
      const existingBookingsCount = await Booking.countDocuments({
        date,
        time: slot,
      });
      if (existingBookingsCount >= 5) {
        return res.status(400).json({
          status: false,
          message:
            "Sorry!, there are no more tables for the selected time slot.",
        });
      }
    }

    const customer = await Customer.findOne({ email: customerEmail });
    if (!customer) {
      return res
        .status(404)
        .json({ status: false, message: "Customer not found" });
    }

    for (const slot of timeSlots) {
      const newBooking = new Booking({
        name,
        date,
        time: slot,
        numberOfPeople,
        customer: customer._id,
      });
      const savedBooking = await newBooking.save();
      newBookings.push(savedBooking);

      const [startTime] = slot.split("-")[0].split(":");
      deleteBookingAtTime(savedBooking._id, date, parseInt(startTime));
    }

    res.status(200).json({
      status: true,
      message: "Booking(s) added successfully!",
      data: newBookings,
    });
  } catch (err) {
    console.error("Error adding booking:", err);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
});

router.get("/customer/:customerEmail", auth, async (req, res) => {
  try {
    const customerEmail = req.params.customerEmail;
    const customer = await Customer.findOne({ email: customerEmail });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    const bookings = await Booking.find({ customer: customer._id });
    res
      .status(200)
      .json({ status: true, message: "get booking successfull", bookings });
  } catch (err) {
    res.status(400).json({ status: false, message: "Error", err });
  }
});

router.delete("/cancelbooking/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    await Booking.findByIdAndDelete(id);
    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
    if (!deletedBooking) {
      return res
        .status(404)
        .json({ status: false, message: "Booking not found" });
    }
    res
      .status(200)
      .json({ status: true, message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.put("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { name, date, time, numberOfPeople } = req.body;

  try {
    // Ensure time is a string
    const timeString = typeof time === "string" ? time : time[0];
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { name, date, time: timeString, numberOfPeople },
      { new: true } // To return the updated document
    );

    if (!updatedBooking) {
      return res
        .status(404)
        .json({ status: false, message: "Booking not found" });
    }

    // Handle deletion and rescheduling if necessary
    const [startTime] = timeString.split("-")[0].split(":");
    deleteBookingAtTime(updatedBooking._id, date, parseInt(startTime));

    res.status(200).json({
      status: true,
      message: "Booking updated successfully",
      updatedBooking,
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
});
module.exports = router;

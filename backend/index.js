const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const bodyParser = require("body-parser");

const cors = require("cors");
mongoURI = "mongodb://localhost:27017/burger-restaurant";
// mongodb+srv://komaliadapa1:komali@restaurant-management.7h3cqmo.mongodb.net/restaurant?retryWrites=true&w=majority&appName=restaurant-management
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("hello jwt");
});

app.use("/customers", require("./routes/customerRoutes"));
app.use("/categories", require("./routes/categoryRoutes"));
app.use("/products", require("./routes/productRoutes"));
app.use("/admin", require("./routes/adminRoutes"));
app.use("/cart", require("./routes/cartRoutes"));
app.use("/order", require("./routes/orderRoutes"));
app.use("/booking", require("./routes/bookingRoutes"));
app.use("/inventory", require("./routes/inventoryRoutes"));
app.use("/catering", require("./routes/cateringRoutes"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

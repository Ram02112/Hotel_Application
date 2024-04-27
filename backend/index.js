const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const bodyParser = require("body-parser");

const cors = require("cors");

mongoose.connect("mongodb://localhost:27017/burger-restaurant");

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

const PORT = process.env.PORT || 4000;
app.listen(PORT);

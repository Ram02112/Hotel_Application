const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  calories: {
    type: Number,
    default: 0,
    required: true,
  },
  _category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
    required: true,
  },
  outOfStock: Boolean,
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;

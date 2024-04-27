const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    description: String,
  },
});

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;

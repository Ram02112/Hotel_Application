// const express = require("express");
// const router = require("express").Router();
// const multer = require("multer");
// const upload = multer({ dest: "uploads/" });
// const Product = require("../models/Product");
// const path = require("path");

// router.use("/uploads", express.static("uploads"));
// router.get("/", async (req, res) => {
//   try {
//     const product = await Product.find().populate("_category");
//     const productwithimages = product.map((item) => ({
//       _id: item._id,
//       name: item.name,
//       description: item.description,
//       price: item.price,
//       image: item.image
//         ? `${req.protocol}://${req.get("host")}/uploads/${path.basename(
//             item.image
//           )}`
//         : null,
//       outOfStock: item.outOfStock,
//     }));

//     res.status(200).json(productwithimages);
//   } catch (error) {
//     console.error("Error fetching menu items:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// router.post("/create", upload.single("image"), async (req, res) => {
//   const { _id, name, price, description } = req.body;
//   try {
//     const product = new Product({
//       _id: _id,
//       name: name,
//       description: description,
//       price: price,
//       outOfStock: false,
//       image: req.file ? req.file.path : null,
//     });
//     const savedProduct = await product.save();
//     res.status(200).json({
//       status: true,
//       message: "Create Product success",
//       data: savedProduct,
//     });
//   } catch (error) {
//     res.status(400).json({ status: false, error: error.message });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("_category");
    const productsWithImages = products.map((product) => ({
      _id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      outOfStock: product.outOfStock,
    }));

    res.status(200).json(productsWithImages);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/create", async (req, res) => {
  const { _id, name, price, description, image } = req.body;
  try {
    const product = new Product({
      _id,
      name,
      description,
      price,
      outOfStock: false,
      image,
    });
    const savedProduct = await product.save();
    res.status(200).json({
      status: true,
      message: "Create Product success",
      data: savedProduct,
    });
  } catch (error) {
    res.status(400).json({ status: false, error: error.message });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItem = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedItem);
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

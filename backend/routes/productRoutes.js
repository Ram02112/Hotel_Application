const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Category = require("../models/Category");

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate({
      path: "_category",
      select: "name",
    });
    const productsWithImages = products.map((product) => ({
      _id: product._id,
      name: product.name,
      description: product.description,
      calories: product.calories,
      price: product.price,
      image: product.image,
      outOfStock: product.outOfStock,
      category: product._category ? product._category.name : "Uncategorized",
    }));

    res.status(200).json(productsWithImages);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/create", upload.single("imageFile"), async (req, res) => {
  const { _id, name, price, description, calories, category } = req.body;

  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ status: false, message: "Image file is required" });
    }

    const imageUrl = path.join("uploads", req.file.filename);

    const product = new Product({
      _id,
      name,
      description,
      calories,
      price,
      outOfStock: false,
      image: imageUrl,
      _category: category,
    });

    const savedProduct = await product.save();
    res.status(200).json({
      status: true,
      message: "Added Item to menu successfully",
      data: savedProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(400).json({ status: false, error: error.message });
  }
});

router.put("/update/:id", upload.single("imageFile"), async (req, res) => {
  try {
    const productId = req.params.id;
    const foundProduct = await Product.findById(productId);

    if (!foundProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedData = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      calories: req.body.calories,
      outOfStock:
        req.body.outOfStock === "true" || req.body.outOfStock === true,
    };

    if (req.file) {
      updatedData.image = path.join("uploads", req.file.filename);
    }

    if (req.body.category) {
      const categoryDoc = await Category.findOne({ name: req.body.category });
      if (!categoryDoc) {
        return res.status(400).json({ message: "Invalid category" });
      }
      updatedData._category = categoryDoc._id;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updatedData,
      { new: true, runValidators: true }
    ).populate("_category", "name");

    res.status(200).json(updatedProduct);
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

router.get("/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId).populate("_category");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

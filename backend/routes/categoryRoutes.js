const router = require("express").Router();
const Category = require("../models/Category");

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      status: true,
      message: "Get categories success",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
});

router.post("/create", async (req, res) => {
  try {
    const { name } = req.body;
    const category = new Category({ name });
    const savedCategory = await category.save();
    res.status(200).json({
      status: true,
      message: "Create category success",
      data: savedCategory,
    });
  } catch (error) {
    res.status(400).json({ status: false, error: error.message });
  }
});

router.put("/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name },
      { new: true }
    );
    if (!updatedCategory) {
      return res
        .status(404)
        .json({ status: false, message: "Category not found" });
    }
    res.status(200).json({
      status: true,
      message: "Update category success",
      data: updatedCategory,
    });
  } catch (error) {
    res.status(400).json({ status: false, error: error.message });
  }
});

router.delete("/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    if (!deletedCategory) {
      return res
        .status(404)
        .json({ status: false, message: "Category not found" });
    }
    res.status(200).json({
      status: true,
      message: "Delete category success",
      data: deletedCategory,
    });
  } catch (error) {
    res.status(400).json({ status: false, error: error.message });
  }
});

module.exports = router;

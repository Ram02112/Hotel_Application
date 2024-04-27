const router = require("express").Router();
const Category = require("../models/Category");
router.get("/", (req, res) => {
  Category.find()
    .exec()
    .then((data, err) => {
      if (err) return res.status(400).json({ status: false, err });
      return res
        .status(200)
        .json({ status: true, message: "Get category success", data });
    });
});

router.post("/create", async (req, res) => {
  try {
    const category = new Category(req.body);
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

module.exports = router;

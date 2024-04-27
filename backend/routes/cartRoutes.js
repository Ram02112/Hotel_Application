const router = require("express").Router();

const { Cart } = require("../models/Cart");

const { Product } = require("../models/Product");

const { auth } = require("../middlewares/auth");

const populate = {
  path: "cartDetails",
  populate: {
    path: "_product",
    model: "products",
    populate: {
      path: "_category",
      model: "categories",
    },
  },
};

router.post("/addToCart", auth, async (req, res) => {
  try {
    const customerCart = await Cart.findOne({ _customerId: req.customerId });
    const product = await Product.findOne({ _id: req.body._productId });

    const cartDetails = {
      _product: req.body._productId,
      quantity: req.body.quantity,
      price: product.price,
      amount: product.price * req.body.quantity,
    };

    if (customerCart) {
      const updatedCart = await Cart.findOneAndUpdate(
        {
          _customerId: req.customerId,
          "cartDetails._product": req.body._productId,
        },
        {
          $inc: {
            "cartDetails.$.quantity": req.body.quantity,
            "cartDetails.$.amount": product.price * req.body.quantity,
          },
        },
        { new: true }
      );

      if (updatedCart) {
        await updatedCart.populate(populate).execPopulate();
        return res
          .status(200)
          .json({ success: true, message: "Added to cart", data: updatedCart });
      } else {
        const newCart = await Cart.findOneAndUpdate(
          { _customerId: req.customerId },
          { $push: { cartDetails: cartDetails } },
          { new: true }
        );
        await newCart.populate(populate).execPopulate();
        return res
          .status(200)
          .json({ success: true, message: "Added to cart", data: newCart });
      }
    } else {
      const newCart = new Cart({
        _customerId: req.customerId,
        cartDetails: [cartDetails],
      });
      await newCart.save();
      await newCart.populate(populate).execPopulate();
      return res
        .status(200)
        .json({ success: true, message: "Added to cart", data: newCart });
    }
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
});

router.get("/", auth, (req, res) => {
  Cart.findOne({
    _customerId: req.customerId,
  })
    .populate(populate)
    .exec()
    .then((data, err) => {
      if (err) return res.json({ status: false, err });
      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    });
});

module.exports = router;

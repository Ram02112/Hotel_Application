const router = require("express").Router();
const { Cart } = require("../models/Cart");
const Product = require("../models/Product");
const { auth } = require("../middlewares/auth");

const populate = {
  path: "cartDetails",
  populate: {
    path: "_product",
    model: "Product",
    populate: {
      path: "_category",
      model: "Category",
    },
  },
};

router.post("/addToCart", auth, async (req, res) => {
  try {
    const customerCart = await Cart.findOne({ _customerId: req.customerId });
    const product = await Product.findById(req.body._productId);

    const cartDetails = {
      _product: req.body._productId,
      quantity: req.body.quantity,
      price: product.price,
      amount: product.price * req.body.quantity,
    };

    if (customerCart) {
      // Update existing cart
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
        {
          new: true,
        }
      ).populate(populate);

      if (updatedCart) {
        return res
          .status(200)
          .json({
            status: true,
            message: "added successfully",
            data: updatedCart,
          });
      } else {
        // Add new cart item
        const updatedCart = await Cart.findByIdAndUpdate(
          customerCart._id,
          {
            $push: {
              cartDetails: cartDetails,
            },
          },
          {
            new: true,
          }
        ).populate(populate);

        return res
          .status(200)
          .json({
            status: true,
            message: "added successfully",
            data: updatedCart,
          });
      }
    } else {
      // Create new cart
      const newCart = new Cart({
        _customerId: req.customerId,
        cartDetails: [cartDetails],
      });

      const savedCart = await newCart.save();
      const populatedCart = await savedCart.populate(populate).execPopulate();
      return res
        .status(200)
        .json({
          status: true,
          message: "added successfully",
          data: populatedCart,
        });
    }
  } catch (err) {
    return res
      .status(500)
      .json({
        status: false,
        message: "Internal server error",
        error: err.message,
      });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ _customerId: req.customerId }).populate(
      populate
    );
    return res
      .status(200)
      .json({ status: true, message: "Get Cart successful", data: cart });
  } catch (err) {
    return res
      .status(500)
      .json({
        status: false,
        message: "Internal server error",
        error: err.message,
      });
  }
});

module.exports = router;

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
      const existingCartItemIndex = customerCart.cartDetails.findIndex(
        (item) => item._product.toString() === req.body._productId
      );

      if (existingCartItemIndex !== -1) {
        customerCart.cartDetails[existingCartItemIndex].quantity +=
          req.body.quantity;
        customerCart.cartDetails[existingCartItemIndex].amount +=
          cartDetails.amount;

        const updatedCart = await Cart.findByIdAndUpdate(
          customerCart._id,
          customerCart,
          { new: true }
        ).populate(populate);
        return res.status(200).json({
          status: true,
          message: "Added successfully",
          data: updatedCart,
        });
      } else {
        customerCart.cartDetails.push(cartDetails);
        const updatedCart = await Cart.findByIdAndUpdate(
          customerCart._id,
          customerCart,
          { new: true }
        ).populate(populate);

        return res.status(200).json({
          status: true,
          message: "Added successfully",
          data: updatedCart,
        });
      }
    } else {
      const newCart = new Cart({
        _customerId: req.customerId,
        cartDetails: [cartDetails],
      });
      const savedCart = await newCart.save();
      const populatedCart = await savedCart.populate(populate);
      return res.status(200).json({
        status: true,
        message: "Added successfully",
        data: populatedCart,
      });
    }
  } catch (err) {
    console.error("Error adding to cart:", err);
    return res.status(500).json({
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
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: err.message,
    });
  }
});

router.put("/updateCartItems", auth, async (req, res) => {
  const _productId = req.body._productId;
  const quantity = req.body.quantity;

  try {
    const product = await Product.findById(_productId);

    if (!product) {
      return res
        .status(404)
        .json({ status: false, message: "Product not found." });
    }

    const updatedCart = await Cart.findOneAndUpdate(
      {
        _customerId: req.customerId,
        "cartDetails._product": _productId,
      },
      {
        $set: {
          "cartDetails.$.quantity": quantity,
          "cartDetails.$.amount": quantity * product.price,
        },
      },
      { new: true }
    ).populate(populate);

    if (!updatedCart) {
      return res
        .status(404)
        .json({ status: false, message: "Cart item not found." });
    }

    return res.status(200).json({
      status: true,
      message: "Updated successfully!",
      data: updatedCart,
    });
  } catch (err) {
    console.error("Error updating cart item:", err);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error." });
  }
});

router.put("/removeCartItem/:id", auth, async (req, res) => {
  const _productId = req.params.id;
  Cart.findOneAndUpdate(
    {
      _customerId: req.customerId,
    },
    {
      $pull: {
        cartDetails: {
          _product: _productId,
        },
      },
    },
    {
      new: true,
    }
  )
    .populate(populate)
    .exec((err, data) => {
      if (err)
        return res.status(400).json({
          status: false,
          err,
        });
      return res.status(200).json({
        status: true,
        message: "Item removed from cart successfully",
        data,
      });
    });
});

module.exports = router;

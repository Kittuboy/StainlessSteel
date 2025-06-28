// routes/cart.js
const express = require("express");
const router = express.Router();
const Cart = require("../Model/Cart.js");
const verifyUser = require("../middleware/verifyuser.js");

// Add to cart
router.post("/add", verifyUser, async (req, res) => {
    const { productId } = req.body;

    try {
        let cart = await Cart.findOne({ userId: req.user.id }); // ✅ Fix here

        if (!cart) {
            cart = new Cart({ userId: req.user.id, products: [] });
        }
        console.log("User from token:", req.user);

        const existing = cart.products.find(p => p.productId == productId);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.products.push({ productId });
        }

        await cart.save();
        res.status(200).json({ message: "Product added to cart" });
    } catch (err) {
        console.error("Cart Add Error:", err); // 🔍 Log actual error
        res.status(500).json({ error: "Server error" });
    }
});


// Get Cart Items for logged in user
router.get("/", verifyUser, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate("products.productId");

    if (!cart) return res.status(200).json([]);

    res.status(200).json(cart.products);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


// ✅ REMOVE PRODUCT FROM CART
router.delete("/remove/:productId", verifyUser, async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // ❌ Remove the product from cart
    cart.products = cart.products.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();

    res.status(200).json({ message: "Product removed from cart" });
  } catch (err) {
    console.error("Remove from cart error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/my-cart", verifyUser, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate("products.productId");
    if (!cart) return res.status(200).json([]);
    res.status(200).json(cart.products);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update Quantity (increase or decrease)
router.put("/update", verifyUser, async (req, res) => {
  const { productId, type } = req.body;

  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const product = cart.products.find(p => p.productId.toString() === productId);
    if (!product) return res.status(404).json({ error: "Product not in cart" });

    if (type === "inc") {
      product.quantity += 1;
    } else if (type === "dec") {
      product.quantity = Math.max(product.quantity - 1, 1);
    }

    await cart.save();
    res.status(200).json({ message: "Quantity updated" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;

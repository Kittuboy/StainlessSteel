const express = require("express");
const router = express.Router();
const Product = require("../Model/Product.js");

// 🟢 PUBLIC Route: Submit rating
router.post("/:id/rate", async (req, res) => {
  const { rating } = req.body;

  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Optional: Allow anonymous users, push rating directly
    product.ratings.push({ value: rating });

    // Calculate average rating
    const total = product.ratings.reduce((sum, r) => sum + r.value, 0);
    product.rating = (total / product.ratings.length).toFixed(1);

    await product.save();
    res.json({ message: "Rating updated", rating: product.rating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

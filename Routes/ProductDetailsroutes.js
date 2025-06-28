const express = require("express");
const router = express.Router();
const Product = require("../Model/Product.js");

// ✅ PUBLIC ROUTE: Get single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to get product" });
  }
});

module.exports = router;

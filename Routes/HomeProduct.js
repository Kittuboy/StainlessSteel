const express = require("express");
const router = express.Router();
const Product = require("../Model/Product.js");

// ✅ Public Route: No verifyUser middleware
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }); // Latest first
    res.json(products);
  } catch (err) {
    console.error("Product fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

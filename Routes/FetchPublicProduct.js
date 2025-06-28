const express = require("express");
const router = express.Router();
const Product = require("../Model/Product.js");



router.get("/",  async (req, res) => {
  try {
    const { type } = req.query;

    const filter = type ? { type: new RegExp("^" + type + "$", "i") } : {};

    console.log("Filter:", filter); // ✅ DEBUG
    const products = await Product.find(filter);

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});




module.exports = router;

// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const Product = require("../Model/Product.js");
const verifyUser = require("../middleware/verifyuser.js");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const cloudinary = require("../config/cloudinary.js");
const streamifier = require("streamifier");



router.get("/", async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// DELETE product (only for admin)
router.delete("/:id", verifyUser, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting product" });
    }
});




// UPDATE product with all fields
router.put("/:id", verifyUser, upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      type,
      rating,
      specs_material,
      specs_grade,
      specs_thickness,
      specs_finish
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Update fields
    product.title = title;
    product.description = description;
    product.price = price;
    product.type = type;
    product.rating = rating;
    product.specs = {
      material: specs_material,
      grade: specs_grade,
      thickness: specs_thickness,
      finish: specs_finish
    };

    if (req.file) {
      // Upload new image
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "image", folder: "steel_products" },
        async (error, result) => {
          if (error) return res.status(500).json({ error: error.message });
          product.imageUrl = result.secure_url;
          await product.save();
          res.json({ message: "Product updated with new image", product });
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    } else {
      await product.save();
      res.json({ message: "Product updated", product });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
});

module.exports = router;

const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const Product = require("../Model/Product.js");
const fs = require("fs");

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary API KEY:", process.env.CLOUDINARY_API_KEY);

// POST /api/products
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description, price, type, rating, offer } = req.body;
    const file = req.file;

    const specs = {
      material: req.body.specs_material,
      grade: req.body.specs_grade,
      thickness: req.body.specs_thickness,
      finish: req.body.specs_finish,
    };


    if (!file) return res.status(400).json({ error: "Image is required" });

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "steel_products",
    });

    // Remove local temp file
    fs.unlinkSync(file.path);

    const newProduct = new Product({
      title,
      description,
      price,
      imageUrl: result.secure_url,
      type,
      rating,
      specs,
      offer,
    });

    await newProduct.save();

    res.status(201).json({ message: "Product uploaded successfully", product: newProduct });
  } catch (err) {
    console.error("Error uploading product:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

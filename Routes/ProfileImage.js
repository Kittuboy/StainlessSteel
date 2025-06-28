const express = require("express");
const multer = require("multer");
const router = express.Router();
const cloudinary = require("../config/cloudinary.js");
const verifyuser = require("../middleware/verifyuser.js");
const User = require("../Model/Users.js");


const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/profile-image", verifyuser, upload.single("image"), async (req, res) => {
  try {
    cloudinary.uploader.upload_stream(
      { folder: "profiles" },
      async (error, result) => {
        if (error) return res.status(500).json({ error: "Upload failed" });

        // ✅ Update user's profileImage in DB
        const userId = req.user.id; // from verifyuser middleware
        await User.findByIdAndUpdate(userId, { profileImage: result.secure_url });

        res.json({ imageUrl: result.secure_url });
      }
    ).end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ error: "Upload error" });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const User = require('../Model/Users.js');
const jwt = require('jsonwebtoken');
const Product = require('../Model/Product.js');
const verifyUser = require('../middleware/verifyuser.js');

// Secure admin check
router.get("/check-admin", async (req, res) => {
    const bearer = req.headers.authorization;
    const token = bearer && bearer.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.secret_keys);
        const user = await User.findById(decoded.id);

        if (user) {
            res.json({ isAdmin: user.isAdmin });
        } else {
            res.status(404).json({ message: "User not found", isAdmin: false });
        }
    } catch (error) {
        res.status(401).json({ message: "Invalid token", isAdmin: false });
    }
});



// ✅ Only for Admin: Get Total Users
router.get("/total-users", verifyUser, async (req, res) => {
  try {
    const userCount = await User.countDocuments({ isAdmin: false }); // only normal users
    res.status(200).json({ totalUsers: userCount });
  } catch (err) {
    res.status(500).json({ message: "Error fetching users count" });
  }
});


// ✅ New: Total Products endpoint
router.get("/total-products", verifyUser, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    res.json({ totalProducts });
  } catch (err) {
    res.status(500).json({ message: "Error fetching products count" });
  }
});

module.exports = router;

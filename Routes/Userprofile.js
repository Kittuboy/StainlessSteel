const express = require("express");
const router = express.Router();
const User = require("../Model/Users.js");
const verifyuser = require("../middleware/verifyuser");

// ✅ GET user profile (with name, image, followers, following)
router.get("/profile", verifyuser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name profileImage following followers ");
    res.json({
      name: user.name,
      profileImage: user.profileImage,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      followers: user.followers,
      following: user.following,
    });
  } catch (err) {
    res.status(500).json({ error: "Cannot fetch user profile" });
  }
});

module.exports = router;

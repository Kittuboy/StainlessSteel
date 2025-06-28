// routes/user.js
const express = require("express");
const router = express.Router();
const verifyUser = require("../middleware/verifyuser");
const User = require("../Model/Users.js");

router.get("/profile", verifyUser, async (req, res) => {
  const user = await User.findById(req.user.id).select("name email profileImage followers following");
  res.json(user);
});

module.exports = router;

// Routes/AdminRoutes.js or wherever you're managing users
const express = require("express");
const router = express.Router();
const User = require("../Model/Users.js");
const verifyUser = require("../middleware/verifyuser");

const OWNER_ID = process.env.OWNER_ID;

// 👉 Get all registered users (non-admins)
router.get("/users", verifyUser, async (req, res) => {
    try {
        const users = await User.find({}); // Or { isAdmin: false } if you only want non-admins
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// 👉 Make a user an admin
// ✅ Make admin
router.put("/make-admin/:id", verifyUser, async (req, res) => {
    const targetId = req.params.id;
    const currentUserId = req.user.id;

    if (currentUserId !== OWNER_ID && !req.user.isAdmin) {
        return res.status(403).json({ error: "Only owner or admin can make admins" });
    }
    console.log("🔐 Current User ID:", currentUserId);
    console.log("🧑‍🎯 Target User ID:", targetId);
    console.log("🔓 isAdmin:", req.user.isAdmin);

    try {
        const user = await User.findById(targetId);
        if (!user) return res.status(404).json({ error: "User not found" });

        user.isAdmin = true;
        await user.save();
        res.json({ message: "User promoted to admin" });
    } catch (err) {
        res.status(500).json({ error: "Error making admin" });
    }
});


// ✅ Remove admin
router.put("/remove-admin/:id", verifyUser, async (req, res) => {
    const targetId = req.params.id;
    const currentUserId = req.user.id;

    if (!req.user.isAdmin && currentUserId !== OWNER_ID) {
        return res.status(403).json({ error: "Only owner or admin can remove admins" });
    }

    // ❌ Prevent removing owner
    if (targetId === OWNER_ID) {
        return res.status(403).json({ error: "Owner cannot be demoted" });
    }

    try {
        const user = await User.findById(targetId);
        if (!user) return res.status(404).json({ error: "User not found" });

        user.isAdmin = false;
        await user.save();
        res.json({ message: "Admin demoted to user" });
    } catch (err) {
        res.status(500).json({ error: "Error removing admin" });
    }
});


module.exports = router;

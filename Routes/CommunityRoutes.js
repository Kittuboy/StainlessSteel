const express = require("express");
const router = express.Router();
const multer = require("multer");
const streamifier = require("streamifier");
const Community = require("../Model/Community.js");
const verifyUser = require("../middleware/verifyuser.js");
const cloudinary = require("../config/cloudinary.js");
const User = require("../Model/Users.js");

const upload = multer({ storage: multer.memoryStorage() });

// ✅ Create Community
router.post("/submit", verifyUser, upload.single("image"), async (req, res) => {
  try {
    const { title, description } = req.body;
    let imageUrl = "";

    if (req.file) {
      const streamUpload = (req) => new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: "communities" },
          (error, result) => result ? resolve(result) : reject(error));
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      const result = await streamUpload(req);
      imageUrl = result.secure_url;
    }

    const community = new Community({
      title, description, imageUrl, createdBy: req.user.id
    });

    await community.save();
    res.status(201).json({ message: "Community created", community });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ GET all public communities
router.get("/public", async (req, res) => {
  try {
    const communities = await Community.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "name profileImage");

    res.json(communities);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch communities" });
  }
});

// ✅ FOLLOW / UNFOLLOW Community Author
router.post("/follow/:communityId", verifyUser, async (req, res) => {
  try {
    const community = await Community.findById(req.params.communityId).populate("createdBy");
    if (!community) return res.status(404).json({ error: "Community not found" });

    const authorId = community.createdBy._id.toString();
    const currentUserId = req.user.id;

    const author = await User.findById(authorId);
    const currentUser = await User.findById(currentUserId);

    const alreadyFollowing = currentUser.following.includes(authorId);

    if (alreadyFollowing) {
      // ❎ UNFOLLOW
      currentUser.following = currentUser.following.filter(id => id.toString() !== authorId);
      author.followers = author.followers.filter(id => id.toString() !== currentUserId);
      community.followers = community.followers.filter(id => id.toString() !== currentUserId);
    } else {
      // ✅ FOLLOW
      currentUser.following.push(authorId);
      author.followers.push(currentUserId);
      community.followers.push(currentUserId);
    }

    await currentUser.save();
    await author.save();
    await community.save();

    res.json({ following: !alreadyFollowing, authorId });
  } catch (err) {
    console.error("Follow Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ❤️ Like/Unlike a community
router.post("/like/:communityId", verifyUser, async (req, res) => {
  try {
    const communityId = req.params.communityId;
    const userId = req.user.id;

    const community = await Community.findById(communityId);
    if (!community) return res.status(404).json({ error: "Community not found" });

    const alreadyLiked = community.likes.includes(userId);

    if (alreadyLiked) {
      community.likes = community.likes.filter(id => id.toString() !== userId);
    } else {
      community.likes.push(userId);
    }

    await community.save();

    res.json({ liked: !alreadyLiked });
  } catch (err) {
    console.error("Like error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
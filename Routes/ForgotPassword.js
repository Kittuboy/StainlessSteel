const express = require('express');
const router = express.Router();
const User = require('../Model/Users.js');


router.post('/forgot-password/verify-email', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: 'Email not found' });
  }

  res.json({ userId: user._id });
});


router.put('/forgot-password/reset', async (req, res) => {
  const { userId, newPassword } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: newPassword }, // 🔓 plain password (not recommended for production)
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({ error: 'Server error while updating password' });
  }
});


module.exports = router;

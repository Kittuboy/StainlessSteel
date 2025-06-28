const express = require('express');
const router = express.Router();
const User = require('../Model/Users.js');
const jwt = require('jsonwebtoken');

// POST /signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ✅ Check for existing email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }


    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: 'Signup successful' });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


//POST / login

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: 'User not found' });

    if (user.password !== password)
      return res.status(401).json({ message: 'Invalid password' });

    // Create JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.secret_keys, {
      expiresIn: '10d'
    });

    console.log(token);

    res.status(200).json({
      message: 'Login successful', user, token, user: {
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        userId: user._id,
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;

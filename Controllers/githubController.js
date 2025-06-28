const axios = require('axios');
const User = require('../Model/Users.js'); // ✅ Import user model

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL;

exports.githubLogin = (req, res) => {
  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=user`;
  res.redirect(redirectUrl);
};

exports.githubCallback = async (req, res) => {
  const code = req.query.code;

  try {
    const tokenRes = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
      },
      {
        headers: { accept: 'application/json' },
      }
    );

    const accessToken = tokenRes.data.access_token;

    const userRes = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const githubUser = userRes.data;

    // ✅ Save or Update user in MongoDB
    const user = await User.findOneAndUpdate(
      { githubId: githubUser.id },
      {
        githubId: githubUser.id,
        username: githubUser.login,
        avatar: githubUser.avatar_url,
        email: githubUser.email || "", // Sometimes null
      },
      { upsert: true, new: true }
    );

    console.log("✅ User saved to MongoDB:", user.username);

    // ✅ Redirect with frontend with username/avatar
    res.redirect(`${FRONTEND_URL}/github-success?username=${user.username}&avatar=${user.avatar}`);
  } catch (err) {
    console.error("❌ GitHub callback error:", err.message);
    res.status(500).send('GitHub Auth Failed');
  }
};

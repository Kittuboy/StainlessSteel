const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../Model/Users.js');
require('dotenv').config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALL_BACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const fetch = await import('node-fetch');
        const res = await fetch.default("https://api.github.com/user/emails", {
          headers: {
            Authorization: `token ${accessToken}`,
            "User-Agent": "Node.js"
          }
        });

        const emails = await res.json();
        const primaryEmail = emails.find(e => e.primary && e.verified)?.email;

        if (!primaryEmail) {
          return done(new Error("Email not available from GitHub. Please make it public."), null);
        }

        let user = await User.findOne({ githubId: profile.id });

        // Check by email also (in case already registered)
        if (!user) {
          user = await User.findOne({ email: primaryEmail });
        }

        if (user) return done(null, user);

        // Create new user
        const newUser = new User({
          githubId: profile.id,
          name: profile.displayName || profile.username,
          email: primaryEmail,
          password: 'github_oauth_user', // ✅ Dummy password
          profileImage: profile.photos?.[0]?.value || '',
          isAdmin: false
        });
        const savedUser = await newUser.save();
        done(null, savedUser);

      } catch (err) {
        done(err, null);
      }
    }
  )
);

module.exports = passport;

const router = require('express').Router();
const passport = require('passport');
const jwt = require("jsonwebtoken");

router.get(
    '/github',
    passport.authenticate('github', { scope: ['user:email'] }) // ✅ EMAIL SCOPE IS IMPORTANT
);


router.get(
    '/github/callback',
    passport.authenticate('github', { session: false, failureRedirect: '/support/api/auth/login' }),
    async (req, res) => {
        try {
            const user = req.user;

            const token = jwt.sign(
                {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    isAdmin: user.isAdmin,
                    profileImage:user.profileImage
                },
                process.env.secret_keys, // ✅ use a secure .env key
                { expiresIn: '10d' }
            );

            res.redirect(`http://localhost:5173/github-success?token=${token}`);
        } catch (err) {
            res.redirect(`http://localhost:5173/support/api/auth/login?error=github`);
        }
    }
);



// GitHub OAuth Callback
router.get(
    '/github/callback',
    passport.authenticate('github', { failureRedirect: '/support/api/auth/signup' }),
    (req, res) => {
        // Frontend me localStorage me token save karne ke liye redirect kare
        res.redirect('http://localhost:5173'); // ✅ frontend home page
    }
);

module.exports = router;

const jwt = require("jsonwebtoken");

const verifyUser = (req, res, next) => {
  const bearerHeader = req.headers.authorization;

  if (!bearerHeader) {
    return res.status(401).json({ message: "Access Denied! Token Missing" });
  }

  const token = bearerHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.secret_keys); // use your .env secret key
    req.user = decoded; // ✅ decoded = { id: user._id, isAdmin: true/false }
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or Expired Token" });
  }
};

module.exports = verifyUser;

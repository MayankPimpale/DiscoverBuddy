const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT Error:", err.message);
      return res.status(403).json({ message: "Invalid or expired token." });
    }
    req.user = user; // Attach the decoded user data to the request
    next(); // Pass control to the next middleware or route handler
  });
};

module.exports = authenticateToken;

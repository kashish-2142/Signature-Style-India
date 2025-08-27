// Middleware to verify JWT tokens and protect routes
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to check if user is authenticated
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No token, access denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Token is not valid" });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Middleware to check if user is admin
const adminAuth = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Access denied. Admin privileges required." });
  }
};

module.exports = { auth, adminAuth };

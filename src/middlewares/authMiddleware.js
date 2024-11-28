const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// Assuming you have a User model
const User = mongoose.model("User");

const authMiddleware = async (req, res, next) => {
  try {
    // Check for Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "No authorization token provided",
      });
    }

    // Extract token (expecting "Bearer TOKEN")
    const parts = authHeader.split(" ");

    if (parts.length !== 2) {
      return res.status(401).json({
        message: "Token error",
      });
    }

    const [scheme, token] = parts;

    // Validate token format
    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({
        message: "Token malformatted",
      });
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Token expired",
        });
      }
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    // Find user by ID from token
    const user = await User.findById(decoded.id)
      .select("-password") // Exclude password field
      .lean(); // Convert to plain JavaScript object

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // Attach user to request object
    req.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      language: user.language,
    };

    // Continue to next middleware/route handler
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({
      message: "Internal server authentication error",
      error: error.message,
    });
  }
};

module.exports = authMiddleware;

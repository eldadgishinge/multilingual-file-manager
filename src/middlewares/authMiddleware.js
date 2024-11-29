const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      console.error("No authorization token provided");
      return res.status(401).json({
        message: "No authorization token provided",
      });
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2) {
      console.error("Token error");
      return res.status(401).json({
        message: "Token error",
      });
    }

    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) {
      console.error("Token malformatted");
      return res.status(401).json({
        message: "Token malformatted",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        console.error("Token expired");
        return res.status(401).json({
          message: "Token expired",
        });
      }
      console.error("Invalid token");
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    const user = await User.findById(decoded.id).select("-password").lean();
    if (!user) {
      console.error("User not found");
      return res.status(401).json({
        message: "User not found",
      });
    }

    console.log("Authenticated user:", user);

    req.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      language: user.language,
    };

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

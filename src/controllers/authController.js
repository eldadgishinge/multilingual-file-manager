const User = require("../models/User");
class AuthController {
  // user registration
  static async register(req, res) {
    try {
      const { username, email, password, language } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });

      if (existingUser) {
        return res.status(400).json({
          message: "User already exists",
        });
      }

      // Create new user
      const user = new User({
        username,
        email,
        password,
        language,
      });

      // Save user to database
      await user.save();

      // Generate authentication token
      const token = user.generateAuthToken();

      res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          language: user.language,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error during registration",
        error: error.message,
      });
    }
  }

  // user login
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      // Find user by email
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({
          message: "Invalid credentials",
        });
      }

      // Check password
      const isMatch = await user.isValidPassword(password);

      if (!isMatch) {
        return res.status(401).json({
          message: "Invalid credentials",
        });
      }

      // Generate token
      const token = user.generateAuthToken();

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          username: user.username,
          language: user.language,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error during login",
        error: error.message,
      });
    }
  }
}

module.exports = AuthController;

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const i18n = require('i18next');
const middleware = require('i18next-express-middleware');

// Use i18next middleware
router.use(middleware.handle(i18n));

// Define auth routes
router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;

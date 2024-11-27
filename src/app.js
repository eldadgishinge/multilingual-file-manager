// app.js
const express = require("express");
const cors = require("cors");
const i18n = require("./config/i18n");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

require("dotenv").config();

const app = express();
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Middleware
// app.use(cors());
app.use(express.json());
// app.use(i18n);

// Routes
app.use("/api/auth", authRoutes);

// Database connection
connectDB();

module.exports = app;

// app.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const i18n = require("./config/i18n");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const fileRoutes = require("./routes/fileRoutes");

const app = express();
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Middleware
app.use(express.json());
// app.use(cors());
// app.use(i18n);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);

// Database connection
connectDB();


module.exports = app;

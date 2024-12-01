// app.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const i18next = require("./config/i18n");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const fileRoutes = require("./routes/fileRoutes");
const i18nextMiddleware = require("i18next-http-middleware");

const app = express();
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Middleware
app.use(express.json());
app.use(i18nextMiddleware.handle(i18next));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);

// Database connection
connectDB();


module.exports = app;

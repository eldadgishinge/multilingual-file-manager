const express = require("express");
const router = express.Router();
const { upload } = require("../models/File");
const FileController = require("../controllers/fileController");

// File upload route
router.post("/upload", FileController.uploadFile);

module.exports = router;

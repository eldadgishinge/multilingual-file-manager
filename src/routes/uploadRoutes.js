const express = require("express");
const router = express.Router();
const FileController = require("../controllers/fileController");

// File upload route
router.post("/upload", FileController.uploadFile);

// Get user files route
router.get("/files", FileController.getUserFiles);

// Update file route
router.put("/files/:id", FileController.updateFile);

// Delete file route
router.delete("/files/:id", FileController.deleteFile);

module.exports = router;

const express = require("express");
const router = express.Router();
const FileController = require("../controllers/fileController");
const authMiddleware = require("../middleware/authMiddleware");

// File upload route
router.post("/upload", authMiddleware, FileController.uploadFile);

// Get user files route
router.get("/files", authMiddleware, FileController.getUserFiles);

// Update file route
router.put("/files/:id", authMiddleware, FileController.updateFile);

// Delete file route with correct path
router.delete("/files/files/:id", authMiddleware, FileController.deleteFile);

module.exports = router;

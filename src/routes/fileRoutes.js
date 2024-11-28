const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/upload", authMiddleware, fileController.uploadFile);  // Ensure you're hitting this route
router.get("/files", authMiddleware, fileController.getUserFiles);  // Use authMiddleware to ensure only authenticated users can get files
router.delete("/files/:id", authMiddleware, fileController.deleteFile);  // Use authMiddleware to ensure only authenticated users can delete files

module.exports = router;

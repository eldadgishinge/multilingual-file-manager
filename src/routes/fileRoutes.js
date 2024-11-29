const express = require("express");
const router = express.Router();
const FileController = require("../controllers/fileController");
const i18n = require('i18next');
const middleware = require('i18next-express-middleware');

// Use i18next middleware
router.use(middleware.handle(i18n));

// Define file routes
router.post("/upload", FileController.uploadFile);
router.get("/files", FileController.getUserFiles);
router.put("/files/:id", FileController.updateFile);
router.delete("/files/files/:id", FileController.deleteFile);  // Adjusted path

module.exports = router;

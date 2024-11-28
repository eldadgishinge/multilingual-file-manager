const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/upload", authMiddleware, fileController.uploadFile);
router.get("/files", fileController.getUserFiles);
router.delete("/files/:id", fileController.deleteFile);

module.exports = router;

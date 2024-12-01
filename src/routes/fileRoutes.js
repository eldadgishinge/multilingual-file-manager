const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/upload", authMiddleware, fileController.uploadFile);
router.get("/get", authMiddleware, fileController.getUserFiles);
router.delete("/:id", authMiddleware, fileController.deleteFile);
router.put("/:id", authMiddleware, fileController.updateFile);

module.exports = router;

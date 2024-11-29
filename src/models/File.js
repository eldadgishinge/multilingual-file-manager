const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

// File Schema
const FileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  mimetype: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, // Optional if user info isn't always available
  },
  path: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    // Upload to a common directory regardless of user ID
    const uploadDir = path.join(__dirname, "../uploads");

    // Ensure the directory exists
    try {
      const fs = require("fs").promises;
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (err) {
      cb(err, null);
    }
  },
  filename: function (req, file, cb) {
    // Generate unique filename using uuid
    const uniqueSuffix = uuidv4();
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// Multer Middleware
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
  },
  fileFilter: (req, file, cb) => {
    // Allowed file types for upload
    const allowedMimetypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "text/plain",
    ];

    if (allowedMimetypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
});

const File = mongoose.model("File", FileSchema);

module.exports = { File, upload };

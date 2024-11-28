const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs").promises;
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

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
    required: true,
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

// File upload configuration
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    // Get the user-specific directory path
    const uploadDir = path.join(__dirname, "../uploads", req.user._id.toString());

    try {
      // Create the user-specific folder if it doesn't exist
      await fs.mkdir(uploadDir, { recursive: true });

      // Provide the path to the destination folder
      cb(null, uploadDir);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: function (req, file, cb) {
    // Generate a unique filename using uuid
    const uniqueSuffix = uuidv4();
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// File upload middleware configuration
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

    // Check if the file mimetype is allowed
    if (allowedMimetypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false); // Reject file if invalid mimetype
    }
  },
});

// Create the File model for MongoDB
const File = mongoose.model("File", FileSchema);

module.exports = { File, upload };

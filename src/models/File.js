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

// file upload configuration
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    // create user-specific folder
    const uploadDir = path.join(__dirname, "../uploads", req.user.id);

    // create directory if it doesn't exist
    try {
      fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = uuidv4();
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// file upload middleware
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
  },
  fileFilter: (req, file, cb) => {
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

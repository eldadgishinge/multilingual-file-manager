const { upload } = require("../models/File");

class FileController {
  // File upload
  static async uploadFile(req, res) {
    console.log("requesttt-->", req.user, req.file);
    try {
      upload.single("file")(req, res, async (err) => {
        if (err) {
          return res.status(400).json({
            message: "File upload error",
            error: err.message,
          });
        }
      });

      if (!req.file) {
        return res.status(400).json({
          message: "No file uploaded",
        });
      }

      // Save file details to database
      const file = new File({
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        user: req.user.id,
      });

      await file.save();

      res.status(201).json({
        message: "File uploaded successfully",
        file: {
          id: file._id,
          filename: file.filename,
          originalName: file.originalName,
          mimetype: file.mimetype,
          size: file.size,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error during file upload",
        error: error.message,
      });
    }
  }

  // Get user files
  static async getUserFiles(req, res) {
    try {
      const files = await File.find({ user: req.user.id });

      res.status(200).json({
        message: "Files retrieved successfully",
        files,
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error while fetching files",
        error: error.message,
      });
    }
  }

  // Delete file
  static async deleteFile(req, res) {
    try {
      const file = await File.findOne({ _id: req.params.id });

      if (!file) {
        return res.status(404).json({
          message: "File not found",
        });
      }

      // Check if file belongs to user
      if (file.user.toString() !== req.user.id) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      // Delete file from database
      await file.remove();

      // Delete file from disk
      fs.unlink(file.path);

      res.status(200).json({
        message: "File deleted successfully",
        file: {
          id: file._id,
          filename: file.filename,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error while deleting file",
        error: error.message,
      });
    }
  }
}

module.exports = FileController;

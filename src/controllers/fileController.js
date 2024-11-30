const { upload } = require("../models/File");
const fs = require("fs").promises;
const { File } = require("../models/File");
const fileQueue = require("../queue");

class FileController {
  // File upload
  static async uploadFile(req, res) {
    // Use the Multer upload middleware
    upload.single("file")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          message: "File upload error",
          error: err.message,
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message: "No file uploaded",
        });
      }

      try {
        const fileDetails = {
          filename: req.file.filename,
          originalName: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          user: req.user.id,
          path: req.file.path,
        };

        // Add the file upload task to the queue
        await fileQueue.add({
          task: "upload",
          fileDetails,
        });

        res.status(201).json({
          message: "File upload task queued successfully",
          fileDetails,
        });
      } catch (error) {
        res.status(500).json({
          message: "Server error during file upload",
          error: error.message,
        });
      }
    });
  }

  // Get user files
  static async getUserFiles(req, res) {
    try {
      // add getUserFiles to queue
      const job = await fileQueue.add({
        task: "get",
        userId: req.user.id,
      });

      try {
        const files = await job.finished();
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
    } catch (error) {
      res.status(500).json({
        message: "Server error while fetching files",
        error: error.message,
      });
    }
  }

  // Update file details
  static async updateFile(req, res) {
    try {
      const file = await File.findOne({ _id: req.params.id });

      if (!file) {
        return res.status(404).json({
          message: "File not found",
        });
      }

      // Update file details
      file.filename = req.body.filename || file.filename;
      file.originalName = req.body.originalName || file.originalName;
      file.mimetype = req.body.mimetype || file.mimetype;
      file.size = req.body.size || file.size;

      await file.save();

      res.status(200).json({
        message: "File updated successfully",
        file,
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error while updating file",
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
      if (file.user && !file.user.equals(req.user.id)) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      // add delete to queue
      await fileQueue.add({
        task: "delete",
        file,
      });

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

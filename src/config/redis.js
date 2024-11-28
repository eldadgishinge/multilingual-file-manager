const Queue = require("bull");
const FileController = require("../controllers/fileController");

const setupRedis = () => {
  // file upload queue using Redis

  const fileUploadQueue = new Queue("file-upload-queue", {
    redis: {
      host: process.env.REDIS_HOST || "localhost",
      port: process.env.REDIS_PORT || 6379,
    },
  });

  fileUploadQueue.process(async (job) => {
    const { file, user } = job.data;

    try {
      // Perform file upload processing
      const uploadedFile = await FileController.uploadFile({
        file,
        user: { id: user.Id },
      });

      return uploadedFile;
    } catch (error) {
      throw new Error(`File upload failed: ${error.message}`);
    }
  });

  //   queue event listeners
  fileUploadQueue.on("completed", (job, result) => {
    console.log(`File upload job completed: ${result}`);
  });

  fileUploadQueue.on("failed", (job, error) => {
    console.log(`File upload job failed: ${error.message}`);
  });

  return fileUploadQueue;
};

module.exports = setupRedis;
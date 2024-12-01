const Queue = require("bull");
const { File } = require("./models/File");
const fs = require("fs").promises;

// Initialize a Redis queue
const fileQueue = new Queue("fileQueue", {
  redis: {
    host: "127.0.0.1",
    port: 6379,
  },
});

// Define a job processor for the queue
fileQueue.process(async (job) => {
  const { task, fileDetails, userId } = job.data;

  const file = new File(fileDetails);
  switch (task) {
    case "upload":
      // Handle file upload logic
      console.log(`Uploading file: ${file.originalName}`);
      await file.save();
      return Promise.resolve();

    case "delete":
      // Handle file delete logic
      console.log(`Deleting file: ${file.filename}`);
      await File.deleteOne({ _id: file._id });
      if (file.path) {
        await fs.unlink(file.path);
      }
      break;

    case "get":
      // Handle get user files logic
      console.log(`Getting user files for user: ${userId}`);
      const files = await File.find({ user: userId });
      return Promise.resolve(files);


    case "update":
      // Handle update file logic
      console.log(`Updating file: ${fileDetails.filename}`);
      await file.save();
      return Promise.resolve();

    default:
      console.log(`Unknown task: ${task}`);
      break;
  }
});

module.exports = fileQueue;

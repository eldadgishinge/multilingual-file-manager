const { fileQueue } = require('../config/redis');
const File = require('../models/File');
const fs = require('fs').promises;

fileQueue.process(async (job, done) => {
  try {
    const { fileData } = job.data;

    // Simulate file processing (e.g., saving to database)
    const file = new File(fileData);
    await file.save();

    // Optionally, you can move the file or perform additional tasks here
    await fs.rename(fileData.tempPath, fileData.finalPath);

    done();
  } catch (error) {
    console.error('File processing error:', error);
    done(error);
  }
});

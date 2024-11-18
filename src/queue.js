const Queue = require('bull');
const redis = require('./config/redis');

const fileQueue = new Queue('file-tasks', { redis: { port: redis.options.port, host: redis.options.host } });

fileQueue.process(async (job) => {
    console.log('Processing job:', job.id);
    // Simulate file processing
    return Promise.resolve();
});

module.exports = fileQueue;

const Redis = require('ioredis');
const Bull = require('bull');

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

const fileQueue = new Bull('fileQueue', {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

module.exports = {
  redisClient,
  fileQueue,
};

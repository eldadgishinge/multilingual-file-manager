require("dotenv").config();
const app = require("./app");
const fileQueue = require("./queue");

const PORT = 8000;

fileQueue.on("completed", (jobId, result) => {
  console.log(`Job ${jobId} completed with result: ${result}`);
});

fileQueue.on("failed", (jobId, err) => {
  console.log(`Job ${jobId} failed with error: ${err}`);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

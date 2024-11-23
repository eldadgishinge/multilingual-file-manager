// Entry Point: app.js
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const session = require("express-session");
const RedisStore = require("connect-redis")(session);
const i18next = require("i18next");
const i18nextMiddleware = require("i18next-http-middleware");
const Backend = require("i18next-fs-backend");
const redis = require("redis");
const routes = require("./routes");
const app = express();

// Load environment variables
dotenv.config();

// Database connection
(async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
})();

// Redis client setup
const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
  },
});
redisClient.connect().catch(console.error);

// Internationalization setup
i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    backend: {
      loadPath: "./locales/{{lng}}/translation.json",
    },
    fallbackLng: "en",
    preload: ["en", "es", "fr"], // Example languages
  });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(i18nextMiddleware.handle(i18next));

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Routes
app.use("/api", routes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: "Internal Server Error" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

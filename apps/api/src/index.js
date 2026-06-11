import app from "./config/app.js";
import env from "./config/env.js";
import db from "./config/db.js";
import redisClient from "./config/redis.js";

const server = app.listen(env.PORT, () => {
  console.info(
    `🚀 Server running in ${(env.NODE_ENV, env.DATABASE_URL)} mode on port ${env.PORT}`,
  );
  console.info(`👉 API Health endpoint: ${env.APP_URL}/health`);
});

const shutdown = (signal) => {
  console.info(`\nReceived ${signal}. Starting graceful shutdown...`);
  server.close(async () => {
    console.info("HTTP server closed.");

    try {
      if (redisClient && redisClient.isOpen) {
        await redisClient.quit();
        console.info("⚡ Redis connection disconnected gracefully.");
      }
    } catch (err) {
      console.error("Error disconnecting Redis:", err);
    }

    try {
      if (db && db.pool) {
        await db.pool.end();
        console.info("🐘 PostgreSQL pool closed gracefully.");
      }
    } catch (err) {
      console.error("Error closing PostgreSQL pool:", err);
    }

    console.info("Graceful shutdown completed. Exiting process.");
    process.exit(0);
  });

  setTimeout(() => {
    console.warn("Force shutting down after 10 seconds timeout.");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

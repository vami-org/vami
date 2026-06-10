import app from "./config/app.js";
import env from "./config/env.js";

const server = app.listen(env.PORT, () => {
  console.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
  console.info(`👉 API Health endpoint: ${env.APP_URL}/health`);
});

const shutdown = (signal) => {
  console.info(`\nReceived ${signal}. Starting graceful shutdown...`);
  server.close(() => {
    console.info("HTTP server closed. Exiting process.");
    process.exit(0);
  });

  setTimeout(() => {
    console.warn("Force shutting down after 10 seconds timeout.");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

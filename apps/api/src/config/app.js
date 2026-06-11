import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import env from "./env.js";
import db from "./db.js";
import redisClient from "./redis.js";

// Middlewares
import requestId from "../middlewares/requestId.js";
import requestLogger from "../middlewares/requestLogger.js";
import errorHandler from "../middlewares/errorHandler.js";

// Routes
import authRoutes from "../routes/authRoutes.js";
import userRoutes from "../routes/userRoutes.js";
import articleRoutes from "../routes/articleRoutes.js";
import commentRoutes from "../routes/commentRoutes.js";
import subscriptionRoutes from "../routes/subscriptionRoutes.js";
import notificationRoutes from "../routes/notificationRoutes.js";

const app = express();

// 1. Mount request trackers at the absolute top of the stack
app.use(requestId);
app.use(requestLogger);

// 2. Load core security and parsing libraries
app.use(helmet());
app.use(
  cors({
    origin: env.WEB_URL,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Mount Routes
app.use("/auth", authRoutes);
app.use("/v1", userRoutes);
app.use("/v1/articles", articleRoutes);
app.use("/v1/comments", commentRoutes);
app.use("/v1/subscriptions", subscriptionRoutes);
app.use("/v1/notifications", notificationRoutes);

// 4. FAANG-grade Health check endpoint
app.get("/health", async (req, res) => {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  // PostgreSQL Connection Health Probe
  let dbStatus = "DOWN";
  let dbLatency = null;
  try {
    const dbStart = Date.now();
    await db.query("SELECT 1");
    dbLatency = `${Date.now() - dbStart}ms`;
    dbStatus = "UP";
  } catch (err) {
    dbStatus = "DOWN";
  }

  // Redis Connection Health Probe
  let redisStatus = "DOWN";
  let redisLatency = null;
  try {
    const redisStart = Date.now();
    if (redisClient && redisClient.isOpen) {
      await redisClient.ping();
      redisLatency = `${Date.now() - redisStart}ms`;
      redisStatus = "UP";
    }
  } catch (err) {
    redisStatus = "DOWN";
  }

  const isHealthy = dbStatus === "UP" && redisStatus === "UP";
  const status = isHealthy ? "UP" : "DEGRADED";

  const uptime = process.uptime();
  const formatUptime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}h ${m}m ${s}s`;
  };

  const memUsage = process.memoryUsage();
  const formatMB = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

  res.status(isHealthy ? 200 : 503).json({
    status,
    timestamp,
    duration: `${Date.now() - startTime}ms`,
    services: {
      database: {
        status: dbStatus,
        latency: dbLatency,
        pool: {
          totalConnections: db.pool?.totalCount || 0,
          idleConnections: db.pool?.idleCount || 0,
          waitingRequests: db.pool?.waitingCount || 0,
        },
      },
      redis: {
        status: redisStatus,
        latency: redisLatency,
        isOpen: redisClient ? redisClient.isOpen : false,
      },
    },
    system: {
      uptime: formatUptime(uptime),
      uptimeSecs: uptime,
      memory: {
        rss: formatMB(memUsage.rss),
        heapTotal: formatMB(memUsage.heapTotal),
        heapUsed: formatMB(memUsage.heapUsed),
        external: formatMB(memUsage.external),
      },
      cpu: process.cpuUsage(),
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      pid: process.pid,
    },
  });
});

// 5. Mount global error handler at the absolute bottom of the stack
app.use(errorHandler);

export default app;

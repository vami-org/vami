import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import env from "./env.js";
import authRoutes from "../routes/authRoutes.js";
import userRoutes from "../routes/userRoutes.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.WEB_URL,
    credentials: true,
  }),
);
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routes
app.use("/auth", authRoutes);
app.use("/v1", userRoutes);

// Basic health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

export default app;

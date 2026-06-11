import { createClient } from "redis";
import env from "./env.js";

const redisClient = createClient({
  url: env.REDIS_URL,
});

redisClient.on("error", (err) => console.error("❌ Redis Client Error", err));

// Connect to Redis
try {
  await redisClient.connect();
  console.info("⚡ Connected to Redis successfully");
} catch (error) {
  console.error("❌ Failed to connect to Redis:", error);
}

export default redisClient;

import redisClient from "../config/redis.js";

// In-memory fallback map in case Redis is down
const memoryFallback = new Map();

// Helper to clean up in-memory rate limiting map periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of memoryFallback.entries()) {
    if (now > value.resetTime) {
      memoryFallback.delete(key);
    }
  }
}, 60000); // every minute

export default function createRateLimiter({
  limit = 5,
  windowSecs = 3600,
  message = "Too many requests. Please try again later.",
} = {}) {
  return async function rateLimiter(req, res, next) {
    if (process.env.NODE_ENV === "test") {
      return next();
    }
    const ip = req.ip || req.headers["x-forwarded-for"] || "unknown-ip";
    const key = `rate_limit:${req.path}:${ip}`;

    // 1. Try using Redis rate limiting
    if (redisClient.isOpen) {
      try {
        const currentCount = await redisClient.incr(key);

        if (currentCount === 1) {
          await redisClient.expire(key, windowSecs);
        }

        if (currentCount > limit) {
          return res.status(429).json({
            success: false,
            error: message,
          });
        }
        return next();
      } catch (err) {
        console.warn(
          "⚠️ Rate limiter fallback: Redis operation failed, using memory fallback.",
          err.message,
        );
      }
    }

    // 2. Memory fallback rate limiter
    const now = Date.now();
    let record = memoryFallback.get(key);

    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowSecs * 1000,
      };
      memoryFallback.set(key, record);
      return next();
    }

    record.count++;
    if (record.count > limit) {
      return res.status(429).json({
        success: false,
        error: message,
      });
    }

    return next();
  };
}

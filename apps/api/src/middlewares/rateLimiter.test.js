import { jest } from "@jest/globals";
import createRateLimiter from "./rateLimiter.js";

describe("rateLimiter Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { ip: "127.0.0.1", path: "/test", headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should bypass rate limiter in test mode", async () => {
    const limiter = createRateLimiter({ limit: 1 });
    await limiter(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("should enforce limits using memory fallback when not in test mode", async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    try {
      const limiter = createRateLimiter({
        limit: 2,
        windowSecs: 10,
        message: "Too many requests",
      });

      // Request 1
      await limiter(req, res, next);
      expect(next).toHaveBeenCalledTimes(1);

      // Request 2
      await limiter(req, res, next);
      expect(next).toHaveBeenCalledTimes(2);

      // Request 3 (exceeds limit)
      await limiter(req, res, next);
      expect(next).toHaveBeenCalledTimes(3);
      const errorPassed = next.mock.calls[2][0];
      expect(errorPassed).toBeDefined();
      expect(errorPassed.statusCode).toBe(429);
      expect(errorPassed.message).toBe("Too many requests");
    } finally {
      process.env.NODE_ENV = originalEnv;
    }
  });
});

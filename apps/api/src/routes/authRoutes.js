import { Router } from "express";
import * as authController from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import createRateLimiter from "../middlewares/rateLimiter.js";
import validate from "../middlewares/validate.js";
import { z } from "zod";

const router = Router();

// Apply strict rate limiting on magic link requests (5 per hour per IP)
const magicLinkRateLimiter = createRateLimiter({
  limit: 5,
  windowSecs: 3600,
  message: "Too many login requests. Please try again in an hour.",
});

// Authentication endpoints
router.post(
  "/magic-link",
  magicLinkRateLimiter,
  validate(
    z.object({
      body: z.object({
        email: z.string().email("Invalid email address"),
      }),
    }),
  ),
  authController.magicLink,
);

router.post(
  "/verify-magic-link",
  validate(
    z.object({
      body: z.object({
        token: z.string().min(1, "Token is required"),
      }),
    }),
  ),
  authController.verifyMagicLink,
);

router.post("/refresh", authController.refresh);
router.delete("/logout", authController.logout);

router.post(
  "/oauth",
  validate(
    z.object({
      body: z.object({
        provider: z.enum(["google", "github"]),
        code: z.string().min(1, "OAuth code is required"),
      }),
    }),
  ),
  authController.oauth,
);

// Protected endpoint
router.get("/me", authMiddleware, authController.me);

export default router;

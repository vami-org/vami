import { Router } from "express";
import * as authController from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import createRateLimiter from "../middlewares/rateLimiter.js";

const router = Router();

// Apply strict rate limiting on magic link requests (5 per hour per IP)
const magicLinkRateLimiter = createRateLimiter({
  limit: 5,
  windowSecs: 3600,
  message: "Too many login requests. Please try again in an hour.",
});

// Authentication endpoints
router.post("/magic-link", magicLinkRateLimiter, authController.magicLink);
router.post("/verify-magic-link", authController.verifyMagicLink);
router.post("/refresh", authController.refresh);
router.delete("/logout", authController.logout);
router.post("/oauth", authController.oauth);

// Protected endpoint
router.get("/me", authMiddleware, authController.me);

export default router;

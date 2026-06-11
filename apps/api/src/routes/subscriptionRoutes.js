import { Router } from "express";

const router = Router();

// Placeholder route for future Stripe and billing developments
router.get("/", (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "Subscriptions router placeholder" });
});

export default router;

import { Router } from "express";

const router = Router();

// Placeholder route for future user notifications developments
router.get("/", (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "Notifications router placeholder" });
});

export default router;

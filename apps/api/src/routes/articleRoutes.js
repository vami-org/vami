import { Router } from "express";

const router = Router();

// Placeholder route for future article developments
router.get("/", (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "Articles router placeholder" });
});

export default router;

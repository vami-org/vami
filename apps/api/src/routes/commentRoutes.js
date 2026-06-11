import { Router } from "express";

const router = Router();

// Placeholder route for future comment and reaction developments
router.get("/", (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "Comments router placeholder" });
});

export default router;

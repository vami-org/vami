import express from "express";
import strictAuth from "../middlewares/authMiddleware.js";
import { optionalAuthMiddleware } from "../middlewares/authMiddleware.js";
import * as userController from "../controllers/userController.js";
import * as mediaController from "../controllers/mediaController.js";

const router = express.Router();

// User Profiles
router.patch("/users/me", strictAuth, userController.updateMe);
router.get(
  "/users/:username",
  optionalAuthMiddleware,
  userController.getProfile,
);

// Follow Graph Actions
router.post("/follows/:userId", strictAuth, userController.follow);
router.delete("/follows/:userId", strictAuth, userController.unfollow);
router.get("/follows/following", strictAuth, userController.getFollowingList);
router.get("/follows/followers", strictAuth, userController.getFollowersList);

// Follow Request Controls
router.get("/follows/requests", strictAuth, userController.getFollowRequests);
router.put(
  "/follows/requests/:followerId/accept",
  strictAuth,
  userController.acceptRequest,
);
router.delete(
  "/follows/requests/:followerId/reject",
  strictAuth,
  userController.rejectRequest,
);

// Media Uploads
router.post("/media/upload-url", strictAuth, mediaController.generateUploadUrl);
router.post("/media/mock-upload", mediaController.mockUpload); // Mock endpoint is public for client form dispatch

export default router;

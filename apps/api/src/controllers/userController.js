import { z } from "zod";
import * as userService from "../services/userService.js";

const updateMeSchema = z.object({
  displayName: z.string().max(100).optional(),
  bio: z.string().max(1000).optional(),
  avatarUrl: z.string().url().or(z.literal("")).optional(),
  websiteUrl: z.string().url().or(z.literal("")).optional(),
  isPrivate: z.boolean().optional(),
});

export async function updateMe(req, res) {
  try {
    const data = updateMeSchema.parse(req.body);
    const userId = req.user.id;
    const user = await userService.updateProfile(userId, data);
    return res.status(200).json({ success: true, user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ success: false, error: error.errors[0].message });
    }
    console.error("Error in updateMe controller:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to update profile" });
  }
}

export async function getProfile(req, res) {
  try {
    const username = req.params.username;
    // req.user might be populated if Authorization header was optionally provided/decoded
    const currentUserId = req.user ? req.user.id : null;
    const profile = await userService.getPublicProfile(username, currentUserId);
    return res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error("Error in getProfile controller:", error.message);
    const status = error.message === "User not found" ? 404 : 500;
    return res.status(status).json({ success: false, error: error.message });
  }
}

export async function follow(req, res) {
  try {
    const followerId = req.user.id;
    const followingId = req.params.userId;
    const { status } = await userService.followUser(followerId, followingId);
    return res.status(200).json({ success: true, status });
  } catch (error) {
    console.error("Error in follow controller:", error.message);
    return res.status(400).json({ success: false, error: error.message });
  }
}

export async function unfollow(req, res) {
  try {
    const followerId = req.user.id;
    const followingId = req.params.userId;
    await userService.unfollowUser(followerId, followingId);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in unfollow controller:", error.message);
    return res.status(400).json({ success: false, error: error.message });
  }
}

export async function getFollowingList(req, res) {
  try {
    const userId = req.user.id;
    const following = await userService.getFollowingList(userId);
    return res.status(200).json({ success: true, following });
  } catch (error) {
    console.error("Error in getFollowingList controller:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to load list" });
  }
}

export async function getFollowersList(req, res) {
  try {
    const userId = req.user.id;
    const followers = await userService.getFollowersList(userId);
    return res.status(200).json({ success: true, followers });
  } catch (error) {
    console.error("Error in getFollowersList controller:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to load list" });
  }
}

export async function getFollowRequests(req, res) {
  try {
    const userId = req.user.id;
    const requests = await userService.getPendingRequests(userId);
    return res.status(200).json({ success: true, requests });
  } catch (error) {
    console.error("Error in getFollowRequests controller:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to load requests" });
  }
}

export async function acceptRequest(req, res) {
  try {
    const followerId = req.params.followerId;
    const followingId = req.user.id;
    await userService.acceptFollowRequest(followerId, followingId);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in acceptRequest controller:", error.message);
    return res.status(400).json({ success: false, error: error.message });
  }
}

export async function rejectRequest(req, res) {
  try {
    const followerId = req.params.followerId;
    const followingId = req.user.id;
    await userService.rejectFollowRequest(followerId, followingId);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in rejectRequest controller:", error.message);
    return res.status(400).json({ success: false, error: error.message });
  }
}

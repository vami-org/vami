import * as userRepository from "./userRepository.js";
import * as followRepository from "./followRepository.js";

export async function updateProfile(userId, updateData) {
  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw new Error("User profile not found");
  }
  return await userRepository.updateUserProfile(userId, updateData);
}

export async function getPublicProfile(username, currentUserId = null) {
  const targetUser = await userRepository.findUserByUsername(username);
  if (!targetUser) {
    throw new Error("User not found");
  }

  const followersCount = await followRepository.getFollowersCount(
    targetUser.id,
  );
  const followingCount = await followRepository.getFollowingCount(
    targetUser.id,
  );

  let followStatus = null;
  let isContentHidden = false;

  if (currentUserId) {
    if (currentUserId === targetUser.id) {
      isContentHidden = false;
    } else {
      const relation = await followRepository.getFollowRelationship(
        currentUserId,
        targetUser.id,
      );
      followStatus = relation ? relation.status : null;

      // Hidden content if private and not accepted follower
      if (targetUser.is_private && followStatus !== "accepted") {
        isContentHidden = true;
      }
    }
  } else if (targetUser.is_private) {
    isContentHidden = true;
  }

  return {
    id: targetUser.id,
    username: targetUser.username,
    display_name: targetUser.display_name,
    bio: targetUser.bio,
    avatar_url: targetUser.avatar_url,
    website_url: targetUser.website_url,
    quality_score: parseFloat(targetUser.quality_score) || 1.0,
    is_creator: targetUser.is_creator,
    creator_tier: targetUser.creator_tier,
    is_private: targetUser.is_private,
    followers_count: followersCount,
    following_count: followingCount,
    follow_status: followStatus,
    is_content_hidden: isContentHidden,
  };
}

export async function followUser(followerId, followingId) {
  if (followerId === followingId) {
    throw new Error("You cannot follow yourself");
  }

  const targetUser = await userRepository.findUserById(followingId);
  if (!targetUser) {
    throw new Error("Target user not found");
  }

  const existingRelation = await followRepository.getFollowRelationship(
    followerId,
    followingId,
  );
  if (existingRelation && existingRelation.status === "accepted") {
    throw new Error("You are already following this user");
  }

  const status = targetUser.is_private ? "pending" : "accepted";
  const relation = await followRepository.createFollowRequest(
    followerId,
    followingId,
    status,
  );
  return { status: relation.status };
}

export async function unfollowUser(followerId, followingId) {
  const relation = await followRepository.deleteFollow(followerId, followingId);
  if (!relation) {
    throw new Error("You are not following this user");
  }
  return { success: true };
}

export async function acceptFollowRequest(followerId, followingId) {
  const relation = await followRepository.getFollowRelationship(
    followerId,
    followingId,
  );
  if (!relation || relation.status !== "pending") {
    throw new Error("Pending follow request not found");
  }

  await followRepository.updateFollowStatus(
    followerId,
    followingId,
    "accepted",
  );
  return { success: true };
}

export async function rejectFollowRequest(followerId, followingId) {
  const relation = await followRepository.getFollowRelationship(
    followerId,
    followingId,
  );
  if (!relation || relation.status !== "pending") {
    throw new Error("Pending follow request not found");
  }

  await followRepository.deleteFollow(followerId, followingId);
  return { success: true };
}

export async function getFollowersList(userId) {
  return await followRepository.getFollowers(userId);
}

export async function getFollowingList(userId) {
  return await followRepository.getFollowing(userId);
}

export async function getPendingRequests(userId) {
  return await followRepository.getPendingFollowRequests(userId);
}

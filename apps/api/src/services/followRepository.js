import db from "../config/db.js";

export async function createFollowRequest(
  followerId,
  followingId,
  status = "accepted",
) {
  const res = await db.query(
    `INSERT INTO follow_relationships (follower_id, following_id, status)
     VALUES ($1, $2, $3)
     ON CONFLICT (follower_id, following_id) 
     DO UPDATE SET status = EXCLUDED.status
     RETURNING *`,
    [followerId, followingId, status],
  );
  return res.rows[0];
}

export async function deleteFollow(followerId, followingId) {
  const res = await db.query(
    "DELETE FROM follow_relationships WHERE follower_id = $1 AND following_id = $2 RETURNING *",
    [followerId, followingId],
  );
  return res.rows[0] || null;
}

export async function updateFollowStatus(followerId, followingId, status) {
  const res = await db.query(
    `UPDATE follow_relationships 
     SET status = $3 
     WHERE follower_id = $1 AND following_id = $2 
     RETURNING *`,
    [followerId, followingId, status],
  );
  return res.rows[0] || null;
}

export async function getFollowRelationship(followerId, followingId) {
  const res = await db.query(
    "SELECT * FROM follow_relationships WHERE follower_id = $1 AND following_id = $2",
    [followerId, followingId],
  );
  return res.rows[0] || null;
}

export async function getFollowersCount(userId) {
  const res = await db.query(
    "SELECT COUNT(*)::integer FROM follow_relationships WHERE following_id = $1 AND status = 'accepted'",
    [userId],
  );
  return res.rows[0].count;
}

export async function getFollowingCount(userId) {
  const res = await db.query(
    "SELECT COUNT(*)::integer FROM follow_relationships WHERE follower_id = $1 AND status = 'accepted'",
    [userId],
  );
  return res.rows[0].count;
}

export async function getFollowers(userId) {
  const res = await db.query(
    `SELECT u.id, u.username, u.display_name, u.avatar_url, u.bio
     FROM users u
     JOIN follow_relationships f ON u.id = f.follower_id
     WHERE f.following_id = $1 AND f.status = 'accepted'
     ORDER BY f.created_at DESC`,
    [userId],
  );
  return res.rows;
}

export async function getFollowing(userId) {
  const res = await db.query(
    `SELECT u.id, u.username, u.display_name, u.avatar_url, u.bio
     FROM users u
     JOIN follow_relationships f ON u.id = f.following_id
     WHERE f.follower_id = $1 AND f.status = 'accepted'
     ORDER BY f.created_at DESC`,
    [userId],
  );
  return res.rows;
}

export async function getPendingFollowRequests(userId) {
  const res = await db.query(
    `SELECT u.id, u.username, u.display_name, u.avatar_url, u.bio, f.created_at
     FROM users u
     JOIN follow_relationships f ON u.id = f.follower_id
     WHERE f.following_id = $1 AND f.status = 'pending'
     ORDER BY f.created_at ASC`,
    [userId],
  );
  return res.rows;
}

import db from "../config/db.js";

export async function findUserById(id) {
  const res = await db.query(
    "SELECT id, email, username, display_name, bio, avatar_url, website_url, quality_score, is_creator, creator_tier, is_private, created_at, updated_at FROM users WHERE id = $1",
    [id],
  );
  return res.rows[0] || null;
}

export async function findUserByUsername(username) {
  const res = await db.query(
    "SELECT id, email, username, display_name, bio, avatar_url, website_url, quality_score, is_creator, creator_tier, is_private, created_at, updated_at FROM users WHERE username = $1",
    [username],
  );
  return res.rows[0] || null;
}

export async function updateUserProfile(
  id,
  { displayName, bio, avatarUrl, websiteUrl, isPrivate },
) {
  const res = await db.query(
    `UPDATE users 
     SET display_name = COALESCE($2, display_name), 
         bio = COALESCE($3, bio), 
         avatar_url = COALESCE($4, avatar_url), 
         website_url = COALESCE($5, website_url), 
         is_private = COALESCE($6, is_private),
         updated_at = NOW() 
     WHERE id = $1 
     RETURNING id, email, username, display_name, bio, avatar_url, website_url, quality_score, is_creator, creator_tier, is_private, created_at, updated_at`,
    [
      id,
      displayName !== undefined ? displayName : null,
      bio !== undefined ? bio : null,
      avatarUrl !== undefined ? avatarUrl : null,
      websiteUrl !== undefined ? websiteUrl : null,
      isPrivate !== undefined ? isPrivate : null,
    ],
  );
  return res.rows[0];
}

export async function deleteUserAccount(id) {
  await db.query("DELETE FROM users WHERE id = $1", [id]);
}

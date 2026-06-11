import db from "../config/db.js";

export async function findUserByEmail(email) {
  const res = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  return res.rows[0] || null;
}

export async function findUserById(id) {
  const res = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  return res.rows[0] || null;
}

export async function createUser(email, username, displayName, avatarUrl) {
  const res = await db.query(
    `INSERT INTO users (email, username, display_name, avatar_url)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [email, username, displayName || null, avatarUrl || null],
  );
  return res.rows[0];
}

export async function isUsernameTaken(username) {
  const res = await db.query("SELECT 1 FROM users WHERE username = $1", [
    username,
  ]);
  return res.rows.length > 0;
}

export async function createSession(
  userId,
  tokenHash,
  userAgent,
  ipAddress,
  expiresAt,
) {
  const res = await db.query(
    `INSERT INTO user_sessions (user_id, refresh_token_hash, user_agent, ip_address, expires_at)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [userId, tokenHash, userAgent || null, ipAddress || null, expiresAt],
  );
  return res.rows[0];
}

export async function findSessionByHash(tokenHash) {
  const res = await db.query(
    `SELECT * FROM user_sessions WHERE refresh_token_hash = $1 AND is_revoked = false`,
    [tokenHash],
  );
  return res.rows[0] || null;
}

export async function revokeSessionByHash(tokenHash) {
  await db.query(
    `UPDATE user_sessions SET is_revoked = true WHERE refresh_token_hash = $1`,
    [tokenHash],
  );
}

export async function createEmailVerification(email, tokenHash, expiresAt) {
  const res = await db.query(
    `INSERT INTO email_verifications (email, token_hash, expires_at)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [email, tokenHash, expiresAt],
  );
  return res.rows[0];
}

export async function findEmailVerificationByHash(tokenHash) {
  const res = await db.query(
    `SELECT * FROM email_verifications WHERE token_hash = $1`,
    [tokenHash],
  );
  return res.rows[0] || null;
}

export async function deleteEmailVerification(id) {
  await db.query("DELETE FROM email_verifications WHERE id = $1", [id]);
}

export async function findOauthProvider(providerName, providerUserId) {
  const res = await db.query(
    `SELECT * FROM oauth_providers WHERE provider_name = $1 AND provider_user_id = $2`,
    [providerName, providerUserId],
  );
  return res.rows[0] || null;
}

export async function createOauthProvider(
  userId,
  providerName,
  providerUserId,
) {
  const res = await db.query(
    `INSERT INTO oauth_providers (user_id, provider_name, provider_user_id)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, providerName, providerUserId],
  );
  return res.rows[0];
}

import crypto from "crypto";
import jwt from "jsonwebtoken";
import env from "../config/env.js";
import * as authRepo from "./authRepository.js";

// Helper: SHA-256 Hasher
function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// Helper: Generate unique username from email
async function generateUniqueUsername(email) {
  const prefix = email
    .split("@")[0]
    .replace(/[^a-zA-Z0-9]/g, "_")
    .toLowerCase()
    .slice(0, 40);
  let baseUsername = prefix || "user";
  let username = baseUsername;
  let attempts = 0;

  while (await authRepo.isUsernameTaken(username)) {
    attempts++;
    const suffix = crypto.randomBytes(3).toString("hex"); // 6 chars
    username = `${baseUsername.slice(0, 30)}_${suffix}`;
    if (attempts > 10) {
      username = `user_${crypto.randomBytes(8).toString("hex")}`;
      break;
    }
  }
  return username;
}

export async function generateMagicLinkToken(email) {
  const token = crypto.randomBytes(32).toString("hex");
  const hashed = hashToken(token);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  await authRepo.createEmailVerification(email, hashed, expiresAt);
  return token;
}

export async function verifyMagicLinkToken(token) {
  const hashed = hashToken(token);
  const verification = await authRepo.findEmailVerificationByHash(hashed);

  if (!verification) {
    throw new Error("Invalid or expired verification token");
  }

  if (new Date() > new Date(verification.expires_at)) {
    await authRepo.deleteEmailVerification(verification.id);
    throw new Error("Verification token has expired");
  }

  let user = await authRepo.findUserByEmail(verification.email);
  if (!user) {
    const username = await generateUniqueUsername(verification.email);
    user = await authRepo.createUser(verification.email, username, null, null);
  }

  await authRepo.deleteEmailVerification(verification.id);
  return user;
}

export async function issueTokenPair(user, userAgent, ipAddress) {
  const accessToken = jwt.sign(
    { sub: user.id, email: user.email },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN },
  );

  const refreshTokenValue = crypto.randomBytes(64).toString("hex");
  const refreshToken = jwt.sign(
    { jti: refreshTokenValue },
    env.REFRESH_TOKEN_SECRET,
    { expiresIn: env.REFRESH_TOKEN_EXPIRES_IN },
  );

  const hashed = hashToken(refreshTokenValue);

  // Calculate expiration date for session (default 90 days from now if configuration fails to parse)
  let expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
  try {
    const decoded = jwt.decode(refreshToken);
    if (decoded && decoded.exp) {
      expiresAt = new Date(decoded.exp * 1000);
    }
  } catch (err) {
    // Fallback to default
  }

  await authRepo.createSession(
    user.id,
    hashed,
    userAgent,
    ipAddress,
    expiresAt,
  );

  return { accessToken, refreshToken };
}

export async function refreshAccessToken(refreshToken, userAgent, ipAddress) {
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    throw new Error("Invalid refresh token signature");
  }

  if (!decoded || !decoded.jti) {
    throw new Error("Invalid refresh token payload");
  }

  const hashed = hashToken(decoded.jti);
  const session = await authRepo.findSessionByHash(hashed);

  if (!session) {
    throw new Error("Session not found or revoked");
  }

  if (new Date() > new Date(session.expires_at)) {
    throw new Error("Session has expired");
  }

  // Revoke the old session immediately (Token Rotation)
  await authRepo.revokeSessionByHash(hashed);

  const user = await authRepo.findUserById(session.user_id);
  if (!user) {
    throw new Error("User associated with this session no longer exists");
  }

  // Issue new rotated pair
  return issueTokenPair(user, userAgent, ipAddress);
}

export async function revokeSession(refreshToken) {
  try {
    const decoded = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET);
    if (decoded && decoded.jti) {
      const hashed = hashToken(decoded.jti);
      await authRepo.revokeSessionByHash(hashed);
    }
  } catch (err) {
    // Ignore verification errors on logout (always revoke if possible)
    try {
      const decoded = jwt.decode(refreshToken);
      if (decoded && decoded.jti) {
        const hashed = hashToken(decoded.jti);
        await authRepo.revokeSessionByHash(hashed);
      }
    } catch (e) {
      // Ignore
    }
  }
}

export async function oauthLogin(
  providerName,
  providerUserId,
  email,
  displayName,
  avatarUrl,
) {
  const provider = await authRepo.findOauthProvider(
    providerName,
    providerUserId,
  );

  if (provider) {
    const user = await authRepo.findUserById(provider.user_id);
    if (!user) {
      throw new Error("User associated with OAuth provider not found");
    }
    return user;
  }

  // Provider not linked yet.
  let user = await authRepo.findUserByEmail(email);
  if (!user) {
    const username = await generateUniqueUsername(email);
    user = await authRepo.createUser(email, username, displayName, avatarUrl);
  }

  await authRepo.createOauthProvider(user.id, providerName, providerUserId);
  return user;
}

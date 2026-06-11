import jwt from "jsonwebtoken";
import env from "../config/env.js";
import * as authRepo from "../services/authRepository.js";

export default async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Access token is missing or malformed",
      });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          error: "Access token has expired",
        });
      }
      return res.status(401).json({
        success: false,
        error: "Invalid access token",
      });
    }

    if (!decoded || !decoded.sub) {
      return res.status(401).json({
        success: false,
        error: "Access token contains an invalid payload",
      });
    }

    const user = await authRepo.findUserById(decoded.sub);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "User associated with this token was not found",
      });
    }

    // Attach user payload to request
    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      display_name: user.display_name,
      is_creator: user.is_creator,
      creator_tier: user.creator_tier,
    };

    return next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error during authentication",
    });
  }
}

export async function optionalAuthMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      let decoded;
      try {
        decoded = jwt.verify(token, env.JWT_SECRET);
        if (decoded && decoded.sub) {
          const user = await authRepo.findUserById(decoded.sub);
          if (user) {
            req.user = {
              id: user.id,
              email: user.email,
              username: user.username,
              display_name: user.display_name,
              is_creator: user.is_creator,
              creator_tier: user.creator_tier,
            };
          }
        }
      } catch (err) {
        // Fail silently for optional auth
      }
    }
    return next();
  } catch (error) {
    // Fail silently and proceed
    return next();
  }
}

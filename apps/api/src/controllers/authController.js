import crypto from "crypto";
import { z } from "zod";
import env from "../config/env.js";
import * as authService from "../services/authService.js";
import { sendMagicLinkEmail } from "../services/emailService.js";

// Zod Input Schemas
const emailSchema = z.string().email("Invalid email address");
const tokenSchema = z.string().min(1, "Token is required");
const oauthSchema = z.object({
  provider: z.enum(["google", "github"]),
  code: z.string().min(1, "OAuth code is required"),
});

// Cookie Configuration Helpers
const COOKIE_NAME = "refresh_token";
const getCookieOptions = () => ({
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
  path: "/",
});

export async function magicLink(req, res) {
  try {
    const email = emailSchema.parse(req.body.email);
    const token = await authService.generateMagicLinkToken(email);

    // Build URL pointing to Vite frontend auth verify route
    const magicLinkUrl = `${env.WEB_URL}/auth/verify?token=${token}`;

    await sendMagicLinkEmail(email, magicLinkUrl);

    return res.status(200).json({
      success: true,
      message: "Magic link sent successfully. Please check your inbox.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ success: false, error: error.errors[0].message });
    }
    console.error("Error in magicLink controller:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to process magic link request" });
  }
}

export async function verifyMagicLink(req, res) {
  try {
    const token = tokenSchema.parse(req.body.token);
    const userAgent = req.headers["user-agent"] || null;
    const ipAddress = req.ip || null;

    const user = await authService.verifyMagicLinkToken(token);
    const { accessToken, refreshToken } = await authService.issueTokenPair(
      user,
      userAgent,
      ipAddress,
    );

    // Set refresh token in HTTP-only cookie
    res.cookie(COOKIE_NAME, refreshToken, getCookieOptions());

    return res.status(200).json({
      success: true,
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        display_name: user.display_name,
        is_creator: user.is_creator,
        creator_tier: user.creator_tier,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ success: false, error: error.errors[0].message });
    }
    console.error("Error in verifyMagicLink controller:", error.message);
    return res.status(401).json({
      success: false,
      error: error.message || "Invalid or expired token",
    });
  }
}

export async function refresh(req, res) {
  try {
    const refreshToken = req.cookies[COOKIE_NAME];
    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, error: "Refresh token is missing" });
    }

    const userAgent = req.headers["user-agent"] || null;
    const ipAddress = req.ip || null;

    const { accessToken, refreshToken: newRefreshToken } =
      await authService.refreshAccessToken(refreshToken, userAgent, ipAddress);

    // Set new refresh token in cookie
    res.cookie(COOKIE_NAME, newRefreshToken, getCookieOptions());

    return res.status(200).json({
      success: true,
      accessToken,
    });
  } catch (error) {
    console.error("Error in refresh controller:", error.message);
    // Clear cookie on verification failure
    res.clearCookie(COOKIE_NAME, { path: "/" });
    return res
      .status(401)
      .json({ success: false, error: error.message || "Invalid session" });
  }
}

export async function logout(req, res) {
  try {
    const refreshToken = req.cookies[COOKIE_NAME];
    if (refreshToken) {
      await authService.revokeSession(refreshToken);
    }
    res.clearCookie(COOKIE_NAME, { path: "/" });
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to logout session" });
  }
}

export async function me(req, res) {
  // Attached by authMiddleware
  return res.status(200).json({
    success: true,
    user: req.user,
  });
}

export async function oauth(req, res) {
  try {
    const { provider, code } = oauthSchema.parse(req.body);
    const userAgent = req.headers["user-agent"] || null;
    const ipAddress = req.ip || null;

    let oauthUser = null;

    // Handle Mock credentials in development/tests
    if (
      code.startsWith("mock_") ||
      env.NODE_ENV === "development" ||
      env.NODE_ENV === "staging"
    ) {
      if (code === "mock_invalid_code") {
        return res
          .status(400)
          .json({ success: false, error: "OAuth code exchange failed" });
      }
      // Return a simulated OAuth profile response
      oauthUser = {
        id: `mock_${provider}_id_${crypto.randomBytes(4).toString("hex")}`,
        email: `${provider}_user_${crypto.randomBytes(3).toString("hex")}@vami.org`,
        display_name: `Mock ${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        avatar_url: `https://avatar.vami.org/${provider}/mock.png`,
      };
    } else {
      // Manual production OAuth token-exchange flows
      if (provider === "google") {
        const client_id = process.env.GOOGLE_CLIENT_ID;
        const client_secret = process.env.GOOGLE_CLIENT_SECRET;
        if (!client_id || !client_secret) {
          throw new Error("Google OAuth credentials are not configured");
        }

        // Exchange code for Google token
        const tokenResponse = await fetch(
          "https://oauth2.googleapis.com/token",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              code,
              client_id,
              client_secret,
              redirect_uri: `${env.WEB_URL}/auth/oauth/google`,
              grant_type: "authorization_code",
            }),
          },
        );
        const tokenData = await tokenResponse.json();
        if (tokenData.error) {
          throw new Error(
            `Google token exchange failed: ${tokenData.error_description || tokenData.error}`,
          );
        }

        // Fetch User profile from Google UserInfo endpoint
        const userinfoResponse = await fetch(
          "https://www.googleapis.com/oauth2/v2/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
          },
        );
        const googleProfile = await userinfoResponse.json();
        if (googleProfile.error) {
          throw new Error(
            `Google userinfo fetch failed: ${googleProfile.error.message}`,
          );
        }

        oauthUser = {
          id: googleProfile.id,
          email: googleProfile.email,
          display_name: googleProfile.name,
          avatar_url: googleProfile.picture,
        };
      } else if (provider === "github") {
        const client_id = process.env.GITHUB_CLIENT_ID;
        const client_secret = process.env.GITHUB_CLIENT_SECRET;
        if (!client_id || !client_secret) {
          throw new Error("GitHub OAuth credentials are not configured");
        }

        // Exchange code for GitHub token
        const tokenResponse = await fetch(
          "https://github.com/login/oauth/access_token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              code,
              client_id,
              client_secret,
            }),
          },
        );
        const tokenData = await tokenResponse.json();
        if (tokenData.error) {
          throw new Error(
            `GitHub token exchange failed: ${tokenData.error_description || tokenData.error}`,
          );
        }

        // Fetch user info from GitHub API
        const userResponse = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
            "User-Agent": "VAMI-Backend",
          },
        });
        const githubProfile = await userResponse.json();
        if (!githubProfile.id) {
          throw new Error("GitHub profile fetch failed");
        }

        // Fetch verified emails
        const emailResponse = await fetch(
          "https://api.github.com/user/emails",
          {
            headers: {
              Authorization: `Bearer ${tokenData.access_token}`,
              "User-Agent": "VAMI-Backend",
            },
          },
        );
        const emails = await emailResponse.json();
        const primaryEmail = Array.isArray(emails)
          ? emails.find((e) => e.primary && e.verified)?.email ||
            emails[0]?.email
          : githubProfile.email;

        if (!primaryEmail) {
          throw new Error("No verified email address found in GitHub profile");
        }

        oauthUser = {
          id: String(githubProfile.id),
          email: primaryEmail,
          display_name: githubProfile.name || githubProfile.login,
          avatar_url: githubProfile.avatar_url,
        };
      }
    }

    if (!oauthUser) {
      throw new Error("OAuth profile resolution failed");
    }

    const user = await authService.oauthLogin(
      provider,
      oauthUser.id,
      oauthUser.email,
      oauthUser.display_name,
      oauthUser.avatar_url,
    );

    const { accessToken, refreshToken } = await authService.issueTokenPair(
      user,
      userAgent,
      ipAddress,
    );

    // Set cookie
    res.cookie(COOKIE_NAME, refreshToken, getCookieOptions());

    return res.status(200).json({
      success: true,
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        display_name: user.display_name,
        is_creator: user.is_creator,
        creator_tier: user.creator_tier,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ success: false, error: error.errors[0].message });
    }
    console.error("Error in oauth controller:", error.message);
    return res.status(400).json({
      success: false,
      error: error.message || "OAuth authentication failed",
    });
  }
}

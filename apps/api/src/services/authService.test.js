import { jest } from "@jest/globals";
import jwt from "jsonwebtoken";

// Mock the repository module before importing anything
jest.unstable_mockModule("./authRepository.js", () => {
  return {
    findUserByEmail: jest.fn(),
    findUserById: jest.fn(),
    createUser: jest.fn(),
    isUsernameTaken: jest.fn(),
    createSession: jest.fn(),
    findSessionByHash: jest.fn(),
    revokeSessionByHash: jest.fn(),
    createEmailVerification: jest.fn(),
    findEmailVerificationByHash: jest.fn(),
    deleteEmailVerification: jest.fn(),
    findOauthProvider: jest.fn(),
    createOauthProvider: jest.fn(),
  };
});

// Import dynamically after mock registration
const authRepo = await import("./authRepository.js");
const authService = await import("./authService.js");
const { default: env } = await import("../config/env.js");

describe("authService Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("generateMagicLinkToken", () => {
    it("should generate a 64-character token and save it to the database", async () => {
      authRepo.createEmailVerification.mockResolvedValue({ id: "1" });

      const email = "test@vami.org";
      const token = await authService.generateMagicLinkToken(email);

      expect(token).toHaveLength(64);
      expect(authRepo.createEmailVerification).toHaveBeenCalledTimes(1);
    });
  });

  describe("verifyMagicLinkToken", () => {
    it("should successfully verify a valid token and return an existing user", async () => {
      const email = "existing@vami.org";
      const verification = {
        id: "v1",
        email,
        expires_at: new Date(Date.now() + 5000).toISOString(),
      };
      const user = { id: "u1", email, username: "existing" };

      authRepo.findEmailVerificationByHash.mockResolvedValue(verification);
      authRepo.findUserByEmail.mockResolvedValue(user);
      authRepo.deleteEmailVerification.mockResolvedValue(undefined);

      const result = await authService.verifyMagicLinkToken("some_token");

      expect(result).toEqual(user);
      expect(authRepo.findEmailVerificationByHash).toHaveBeenCalledTimes(1);
      expect(authRepo.findUserByEmail).toHaveBeenCalledWith(email);
      expect(authRepo.deleteEmailVerification).toHaveBeenCalledWith("v1");
    });

    it("should create a new user with generated unique username if user is logging in for the first time", async () => {
      const email = "new_user@vami.org";
      const verification = {
        id: "v1",
        email,
        expires_at: new Date(Date.now() + 5000).toISOString(),
      };
      const user = { id: "u2", email, username: "new_user" };

      authRepo.findEmailVerificationByHash.mockResolvedValue(verification);
      authRepo.findUserByEmail.mockResolvedValue(null);
      authRepo.isUsernameTaken.mockResolvedValue(false);
      authRepo.createUser.mockResolvedValue(user);
      authRepo.deleteEmailVerification.mockResolvedValue(undefined);

      const result = await authService.verifyMagicLinkToken("some_token");

      expect(result).toEqual(user);
      expect(authRepo.createUser).toHaveBeenCalledWith(
        email,
        "new_user",
        null,
        null,
      );
    });

    it("should handle username collisions by appending random suffixes", async () => {
      const email = "collision@vami.org";
      const verification = {
        id: "v1",
        email,
        expires_at: new Date(Date.now() + 5000).toISOString(),
      };
      const user = { id: "u2", email, username: "collision_random" };

      authRepo.findEmailVerificationByHash.mockResolvedValue(verification);
      authRepo.findUserByEmail.mockResolvedValue(null);

      authRepo.isUsernameTaken
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false);

      authRepo.createUser.mockResolvedValue(user);
      authRepo.deleteEmailVerification.mockResolvedValue(undefined);

      const result = await authService.verifyMagicLinkToken("some_token");

      expect(result).toEqual(user);
      expect(authRepo.isUsernameTaken).toHaveBeenCalledTimes(3);
    });

    it("should throw an error if the token is not found in the database", async () => {
      authRepo.findEmailVerificationByHash.mockResolvedValue(null);

      await expect(
        authService.verifyMagicLinkToken("invalid_token"),
      ).rejects.toThrow("Invalid or expired verification token");
    });

    it("should delete token and throw error if the token is expired", async () => {
      const email = "expired@vami.org";
      const verification = {
        id: "v1",
        email,
        expires_at: new Date(Date.now() - 5000).toISOString(),
      };

      authRepo.findEmailVerificationByHash.mockResolvedValue(verification);
      authRepo.deleteEmailVerification.mockResolvedValue(undefined);

      await expect(
        authService.verifyMagicLinkToken("expired_token"),
      ).rejects.toThrow("Verification token has expired");
      expect(authRepo.deleteEmailVerification).toHaveBeenCalledWith("v1");
    });
  });

  describe("issueTokenPair", () => {
    it("should issue access and refresh tokens and save hashed refresh token session in database", async () => {
      const user = { id: "u1", email: "test@vami.org" };
      authRepo.createSession.mockResolvedValue({ id: "s1" });

      const result = await authService.issueTokenPair(
        user,
        "UserAgent",
        "127.0.0.1",
      );

      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
      expect(authRepo.createSession).toHaveBeenCalledTimes(1);
    });
  });

  describe("refreshAccessToken", () => {
    it("should verify refresh token, revoke old session, and issue a new token pair", async () => {
      const user = { id: "u1", email: "test@vami.org" };
      const refreshToken = jwt.sign(
        { jti: "token_jti" },
        env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1h" },
      );
      const session = {
        id: "s1",
        user_id: "u1",
        expires_at: new Date(Date.now() + 50000).toISOString(),
      };

      authRepo.findSessionByHash.mockResolvedValue(session);
      authRepo.revokeSessionByHash.mockResolvedValue(undefined);
      authRepo.findUserById.mockResolvedValue(user);
      authRepo.createSession.mockResolvedValue({ id: "s2" });

      const result = await authService.refreshAccessToken(
        refreshToken,
        "UserAgent",
        "127.0.0.1",
      );

      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
      expect(authRepo.findSessionByHash).toHaveBeenCalledTimes(1);
      expect(authRepo.revokeSessionByHash).toHaveBeenCalledTimes(1);
      expect(authRepo.findUserById).toHaveBeenCalledWith("u1");
    });

    it("should throw error if signature is invalid", async () => {
      await expect(
        authService.refreshAccessToken(
          "invalid_signature_token",
          "UserAgent",
          "127.0.0.1",
        ),
      ).rejects.toThrow("Invalid refresh token signature");
    });

    it("should throw error if session is not active (revoked or missing)", async () => {
      const refreshToken = jwt.sign(
        { jti: "token_jti" },
        env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1h" },
      );
      authRepo.findSessionByHash.mockResolvedValue(null);

      await expect(
        authService.refreshAccessToken(refreshToken, "UserAgent", "127.0.0.1"),
      ).rejects.toThrow("Session not found or revoked");
    });

    it("should throw error if session is expired", async () => {
      const refreshToken = jwt.sign(
        { jti: "token_jti" },
        env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1h" },
      );
      const session = {
        id: "s1",
        user_id: "u1",
        expires_at: new Date(Date.now() - 5000).toISOString(),
      };
      authRepo.findSessionByHash.mockResolvedValue(session);

      await expect(
        authService.refreshAccessToken(refreshToken, "UserAgent", "127.0.0.1"),
      ).rejects.toThrow("Session has expired");
    });
  });

  describe("revokeSession", () => {
    it("should decode/verify token and revoke the database session", async () => {
      const refreshToken = jwt.sign(
        { jti: "token_jti" },
        env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1h" },
      );
      authRepo.revokeSessionByHash.mockResolvedValue(undefined);

      await authService.revokeSession(refreshToken);

      expect(authRepo.revokeSessionByHash).toHaveBeenCalledTimes(1);
    });

    it("should fallback to decoding the token and revoke session if verify fails but token is valid jwt structure", async () => {
      const tokenWithWrongSecret = jwt.sign(
        { jti: "decoded_jti" },
        "wrong_secret",
        { expiresIn: "1h" },
      );
      authRepo.revokeSessionByHash.mockResolvedValue(undefined);

      await authService.revokeSession(tokenWithWrongSecret);

      expect(authRepo.revokeSessionByHash).toHaveBeenCalledTimes(1);
    });
  });

  describe("oauthLogin", () => {
    it("should login user if OAuth provider is already linked", async () => {
      const user = {
        id: "u1",
        email: "oauth@vami.org",
        username: "oauth_user",
      };
      authRepo.findOauthProvider.mockResolvedValue({ id: "o1", user_id: "u1" });
      authRepo.findUserById.mockResolvedValue(user);

      const result = await authService.oauthLogin(
        "google",
        "g123",
        "oauth@vami.org",
        "OAuth User",
        null,
      );

      expect(result).toEqual(user);
      expect(authRepo.findOauthProvider).toHaveBeenCalledWith("google", "g123");
      expect(authRepo.findUserById).toHaveBeenCalledWith("u1");
    });

    it("should create user and link OAuth provider if user is new", async () => {
      const user = {
        id: "u1",
        email: "new_oauth@vami.org",
        username: "new_oauth",
      };
      authRepo.findOauthProvider.mockResolvedValue(null);
      authRepo.findUserByEmail.mockResolvedValue(null);
      authRepo.isUsernameTaken.mockResolvedValue(false);
      authRepo.createUser.mockResolvedValue(user);
      authRepo.createOauthProvider.mockResolvedValue({ id: "o2" });

      const result = await authService.oauthLogin(
        "github",
        "gh123",
        "new_oauth@vami.org",
        "GitHub User",
        "https://avatar.png",
      );

      expect(result).toEqual(user);
      expect(authRepo.createUser).toHaveBeenCalledWith(
        "new_oauth@vami.org",
        "new_oauth",
        "GitHub User",
        "https://avatar.png",
      );
      expect(authRepo.createOauthProvider).toHaveBeenCalledWith(
        "u1",
        "github",
        "gh123",
      );
    });
  });
});

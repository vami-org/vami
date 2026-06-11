import { jest } from "@jest/globals";
import request from "supertest";

// Mock the email service to avoid sending actual SMTP emails in integration tests
jest.unstable_mockModule("../services/emailService.js", () => ({
  sendMagicLinkEmail: jest.fn().mockResolvedValue({ messageId: "mock-id" }),
}));

// Dynamically import app, db and redisClient AFTER the mocks are registered
const { default: app } = await import("../config/app.js");
const { default: db } = await import("../config/db.js");
const { default: redisClient } = await import("../config/redis.js");
const { sendMagicLinkEmail } = await import("../services/emailService.js");

describe("authRoutes Integration Tests", () => {
  beforeAll(async () => {
    // Clean database tables before testing
    await db.query(
      "TRUNCATE TABLE users, user_sessions, email_verifications, oauth_providers CASCADE",
    );
  });

  afterAll(async () => {
    // Truncate tables and close open connection handles to let Jest terminate cleanly
    await db.query(
      "TRUNCATE TABLE users, user_sessions, email_verifications, oauth_providers CASCADE",
    );
    await db.pool.end();
    if (redisClient.isOpen) {
      await redisClient.quit();
    }
  });

  describe("POST /auth/magic-link", () => {
    it("should return 200 and send magic link email for valid emails", async () => {
      const res = await request(app)
        .post("/auth/magic-link")
        .send({ email: "integration@vami.org" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain("Magic link sent");
      expect(sendMagicLinkEmail).toHaveBeenCalledTimes(1);
    });

    it("should return 400 for invalid email formats", async () => {
      const res = await request(app)
        .post("/auth/magic-link")
        .send({ email: "not-an-email" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBeDefined();
    });
  });

  describe("POST /auth/verify-magic-link", () => {
    it("should verify token, create user, return access token and set refresh cookie", async () => {
      // 1. Manually insert a verification token to verify against
      const token = "integration_test_verification_token_12345";
      const tokenHash =
        "475bea52ed19ae8fb357ef3d6a79884cc20b5922829570b459989919cf6238c2"; // SHA256 of token
      const expiresAt = new Date(Date.now() + 50000);
      await db.query(
        "INSERT INTO email_verifications (email, token_hash, expires_at) VALUES ($1, $2, $3)",
        ["verify@vami.org", tokenHash, expiresAt],
      );

      // 2. Perform request
      const res = await request(app)
        .post("/auth/verify-magic-link")
        .send({ token });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.user.email).toBe("verify@vami.org");
      expect(res.body.user.username).toBeDefined();

      // Check cookie is set
      const cookies = res.headers["set-cookie"];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toContain("refresh_token=");
      expect(cookies[0]).toContain("HttpOnly");
    });

    it("should return 401 for invalid tokens", async () => {
      const res = await request(app)
        .post("/auth/verify-magic-link")
        .send({ token: "non_existent_token" });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /auth/refresh", () => {
    it("should rotate and return a new access token when provided a valid refresh token cookie", async () => {
      // 1. Create a user
      await db.query(
        "INSERT INTO users (email, username) VALUES ($1, $2) RETURNING id",
        ["refresh@vami.org", "refresh_user"],
      );

      // 2. Log in using verify-magic-link logic to get a valid token cookie
      const token = "refresh_token_generation_magic_key";
      const tokenHash =
        "a9df6195f810c1635d695299c0de27fa2d01ff12d68f771d1416b828f34694c5"; // SHA256 of token
      await db.query(
        "INSERT INTO email_verifications (email, token_hash, expires_at) VALUES ($1, $2, $3)",
        ["refresh@vami.org", tokenHash, new Date(Date.now() + 50000)],
      );

      const loginRes = await request(app)
        .post("/auth/verify-magic-link")
        .send({ token });

      const cookie = loginRes.headers["set-cookie"];

      // 3. Make refresh call
      const res = await request(app)
        .post("/auth/refresh")
        .set("Cookie", cookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.accessToken).toBeDefined();
    });

    it("should return 401 when refresh token is missing", async () => {
      const res = await request(app).post("/auth/refresh");
      expect(res.status).toBe(401);
    });
  });

  describe("POST /auth/oauth", () => {
    it("should authenticate mock oauth user login and set cookie", async () => {
      const res = await request(app)
        .post("/auth/oauth")
        .send({ provider: "google", code: "mock_google_oauth_code" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.user.email).toContain("google_user_");
      expect(res.headers["set-cookie"]).toBeDefined();
    });
  });

  describe("GET /auth/me", () => {
    it("should return 200 and user profile when provided a valid access token", async () => {
      // 1. Generate an OAuth login to get access token
      const oauthRes = await request(app)
        .post("/auth/oauth")
        .send({ provider: "github", code: "mock_github_oauth_code" });

      const accessToken = oauthRes.body.accessToken;

      // 2. Fetch profile
      const res = await request(app)
        .get("/auth/me")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toContain("github_user_");
    });

    it("should return 401 when authorization header is missing", async () => {
      const res = await request(app).get("/auth/me");
      expect(res.status).toBe(401);
    });
  });

  describe("DELETE /auth/logout", () => {
    it("should clear refresh token cookie and invalidate session", async () => {
      const oauthRes = await request(app)
        .post("/auth/oauth")
        .send({ provider: "github", code: "mock_logout_code" });

      const cookie = oauthRes.headers["set-cookie"];

      const res = await request(app)
        .delete("/auth/logout")
        .set("Cookie", cookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Check cookie was cleared (max-age set to 0 or expires in the past)
      const clearedCookies = res.headers["set-cookie"];
      expect(clearedCookies[0]).toMatch(/Max-Age=0|1970/);
    });
  });
});

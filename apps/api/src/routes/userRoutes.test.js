import request from "supertest";
import jwt from "jsonwebtoken";

// Dynamically import configurations and shared clients
const { default: app } = await import("../config/app.js");
const { default: db } = await import("../config/db.js");
const { default: redisClient } = await import("../config/redis.js");
const { default: env } = await import("../config/env.js");

describe("userRoutes Integration Tests", () => {
  let testUser;
  let anotherUser;
  let testUserToken;
  let anotherUserToken;

  beforeAll(async () => {
    // Clean database tables before testing
    await db.query(
      "TRUNCATE TABLE users, follow_relationships, user_sessions CASCADE",
    );

    // Create primary test user
    const userRes = await db.query(
      `INSERT INTO users (email, username, display_name, is_private)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      ["user1@vami.org", "user1", "User One", false],
    );
    testUser = userRes.rows[0];
    testUserToken = jwt.sign({ sub: testUser.id }, env.JWT_SECRET, {
      expiresIn: "15m",
    });

    // Create secondary test user (private account)
    const user2Res = await db.query(
      `INSERT INTO users (email, username, display_name, is_private)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      ["user2@vami.org", "user2", "User Two", true],
    );
    anotherUser = user2Res.rows[0];
    anotherUserToken = jwt.sign({ sub: anotherUser.id }, env.JWT_SECRET, {
      expiresIn: "15m",
    });
  });

  afterAll(async () => {
    await db.query(
      "TRUNCATE TABLE users, follow_relationships, user_sessions CASCADE",
    );
    await db.pool.end();
    if (redisClient.isOpen) {
      await redisClient.quit();
    }
  });

  describe("PATCH /v1/users/me", () => {
    it("should allow authenticated users to update their profile settings", async () => {
      const res = await request(app)
        .patch("/v1/users/me")
        .set("Authorization", `Bearer ${testUserToken}`)
        .send({
          displayName: "Updated One",
          bio: "Just a bio",
          websiteUrl: "https://vami.org",
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.display_name).toBe("Updated One");
      expect(res.body.user.bio).toBe("Just a bio");
    });

    it("should return 401 Unauthorized if token is missing", async () => {
      const res = await request(app)
        .patch("/v1/users/me")
        .send({ displayName: "No Token" });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /v1/users/:username", () => {
    it("should return public profile details of a user", async () => {
      const res = await request(app)
        .get(`/v1/users/${testUser.username}`)
        .set("Authorization", `Bearer ${anotherUserToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.profile.username).toBe(testUser.username);
      expect(res.body.profile.is_content_hidden).toBe(false);
    });

    it("should return 404 if user is not found", async () => {
      const res = await request(app).get("/v1/users/nonexistent_username");

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST & DELETE follows", () => {
    it("should allow a user to follow and request approvals for private profiles", async () => {
      // 1. Send follow request to user2 (private)
      const followRes = await request(app)
        .post(`/v1/follows/${anotherUser.id}`)
        .set("Authorization", `Bearer ${testUserToken}`);

      expect(followRes.status).toBe(200);
      expect(followRes.body.success).toBe(true);
      expect(followRes.body.status).toBe("pending");

      // 2. Fetch pending requests list for user2
      const requestsRes = await request(app)
        .get("/v1/follows/requests")
        .set("Authorization", `Bearer ${anotherUserToken}`);

      expect(requestsRes.status).toBe(200);
      expect(requestsRes.body.success).toBe(true);
      expect(requestsRes.body.requests).toHaveLength(1);
      expect(requestsRes.body.requests[0].id).toBe(testUser.id);

      // 3. Approve request
      const approveRes = await request(app)
        .put(`/v1/follows/requests/${testUser.id}/accept`)
        .set("Authorization", `Bearer ${anotherUserToken}`);

      expect(approveRes.status).toBe(200);
      expect(approveRes.body.success).toBe(true);

      // 3a. Retrieve following list for user1
      const followingRes = await request(app)
        .get("/v1/follows/following")
        .set("Authorization", `Bearer ${testUserToken}`);
      expect(followingRes.status).toBe(200);
      expect(followingRes.body.following).toHaveLength(1);
      expect(followingRes.body.following[0].id).toBe(anotherUser.id);

      // 3b. Retrieve followers list for user2
      const followersRes = await request(app)
        .get("/v1/follows/followers")
        .set("Authorization", `Bearer ${anotherUserToken}`);
      expect(followersRes.status).toBe(200);
      expect(followersRes.body.followers).toHaveLength(1);
      expect(followersRes.body.followers[0].id).toBe(testUser.id);

      // 4. Verify user1 is now following user2
      const profileRes = await request(app)
        .get(`/v1/users/${anotherUser.username}`)
        .set("Authorization", `Bearer ${testUserToken}`);

      expect(profileRes.status).toBe(200);
      expect(profileRes.body.profile.follow_status).toBe("accepted");
      expect(profileRes.body.profile.is_content_hidden).toBe(false);

      // 5. Unfollow user2
      const unfollowRes = await request(app)
        .delete(`/v1/follows/${anotherUser.id}`)
        .set("Authorization", `Bearer ${testUserToken}`);

      expect(unfollowRes.status).toBe(200);
      expect(unfollowRes.body.success).toBe(true);

      // 6. Request follow again and reject it
      await request(app)
        .post(`/v1/follows/${anotherUser.id}`)
        .set("Authorization", `Bearer ${testUserToken}`);

      const rejectRes = await request(app)
        .delete(`/v1/follows/requests/${testUser.id}/reject`)
        .set("Authorization", `Bearer ${anotherUserToken}`);

      expect(rejectRes.status).toBe(200);
      expect(rejectRes.body.success).toBe(true);
    });
  });

  describe("POST /v1/media/upload-url", () => {
    it("should return upload credentials for authenticated users", async () => {
      const res = await request(app)
        .post("/v1/media/upload-url")
        .set("Authorization", `Bearer ${testUserToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.uploadUrl).toBeDefined();
      expect(res.body.signature).toBeDefined();
    });

    it("should return 401 Unauthorized if token is missing", async () => {
      const res = await request(app).post("/v1/media/upload-url");
      expect(res.status).toBe(401);
    });
  });

  describe("POST /v1/media/mock-upload", () => {
    it("should allow public direct mockup upload requests", async () => {
      const res = await request(app).post("/v1/media/mock-upload").send();

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.secure_url).toBeDefined();
    });
  });
});

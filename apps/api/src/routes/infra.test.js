import request from "supertest";
import { z } from "zod";
import { NotFoundError } from "../services/errors.js";
import validate from "../middlewares/validate.js";

const { default: app } = await import("../config/app.js");

// Dynamically register test routing endpoints for middleware testing
app.post(
  "/test-infra-validation",
  validate(
    z.object({
      body: z.object({
        email: z.string().email("Invalid email schema"),
      }),
    }),
  ),
  (req, res) => {
    res.status(200).json({ ok: true });
  },
);

app.get("/test-infra-notfound", (req, res, next) => {
  next(new NotFoundError("Item not found"));
});

app.get("/test-infra-error", (req, res, next) => {
  next(new Error("Unexpected database write crash"));
});

// Re-register the error handler after our test routes so Express routes errors to it
import errorHandler from "../middlewares/errorHandler.js";
app.use(errorHandler);

describe("API Infrastructure Integration Tests (Week 9)", () => {
  describe("Request ID Middleware", () => {
    it("should append X-Request-Id header to responses", async () => {
      const res = await request(app).get("/health");
      expect(res.headers["x-request-id"]).toBeDefined();
      expect(res.headers["x-request-id"]).toMatch(/^req_/);
    });

    it("should accept client-provided request identifiers", async () => {
      const res = await request(app)
        .get("/health")
        .set("X-Request-Id", "client_req_123");
      expect(res.headers["x-request-id"]).toBe("client_req_123");
    });
  });

  describe("Validation & Error Formatter Middleware", () => {
    it("should map Zod errors into ValidationError schemas", async () => {
      const res = await request(app)
        .post("/test-infra-validation")
        .send({ email: "not-an-email" });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
      expect(res.body.error.code).toBe("VALIDATION_FAILED");
      expect(res.body.error.details.email).toBe("Invalid email schema");
      expect(res.body.error.requestId).toBeDefined();
      expect(res.body.error.timestamp).toBeDefined();
    });

    it("should format custom AppErrors into standard JSON structure", async () => {
      const res = await request(app).get("/test-infra-notfound");

      expect(res.status).toBe(404);
      expect(res.body.error).toBeDefined();
      expect(res.body.error.code).toBe("NOT_FOUND");
      expect(res.body.error.message).toBe("Item not found");
      expect(res.body.error.requestId).toBeDefined();
    });

    it("should map unhandled exceptions into generic Internal Server Errors", async () => {
      const res = await request(app).get("/test-infra-error");

      expect(res.status).toBe(500);
      expect(res.body.error).toBeDefined();
      expect(res.body.error.code).toBe("INTERNAL_SERVER_ERROR");
      // In test mode, errorHandler doesn't print stacks to avoid console clutter
      expect(res.body.error.message).toBe("An internal server error occurred");
    });
  });

  describe("FAANG-Grade Health Check Endpoint", () => {
    it("should report overall system status alongside detailed Postgres/Redis probes", async () => {
      const res = await request(app).get("/health");

      expect(res.status).toBe(200);
      expect(res.body.status).toBeDefined();
      expect(res.body.timestamp).toBeDefined();
      expect(res.body.duration).toBeDefined();
      expect(res.body.services).toBeDefined();
      expect(res.body.services.database).toBeDefined();
      expect(res.body.services.redis).toBeDefined();
      expect(res.body.system).toBeDefined();
      expect(res.body.system.uptime).toBeDefined();
      expect(res.body.system.memory).toBeDefined();
    });
  });
});

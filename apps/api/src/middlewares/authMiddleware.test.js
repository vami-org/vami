import { jest } from "@jest/globals";
import jwt from "jsonwebtoken";

// Mock authRepository before imports
jest.unstable_mockModule("../services/authRepository.js", () => ({
  findUserById: jest.fn(),
}));

const authRepo = await import("../services/authRepository.js");
const { default: authMiddleware } = await import("./authMiddleware.js");
const { default: env } = await import("../config/env.js");

describe("authMiddleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 401 if Authorization header is missing", async () => {
    await authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: "Access token is missing or malformed",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if Authorization header is not Bearer style", async () => {
    req.headers.authorization = "Basic token";
    await authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if token is expired", async () => {
    const expiredToken = jwt.sign({ sub: "u1" }, env.JWT_SECRET, {
      expiresIn: "-1s",
    });
    req.headers.authorization = `Bearer ${expiredToken}`;

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: "Access token has expired",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if token signature is invalid", async () => {
    req.headers.authorization = "Bearer invalid_token_signature";

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: "Invalid access token",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if user does not exist in database", async () => {
    const validToken = jwt.sign({ sub: "non_existent" }, env.JWT_SECRET, {
      expiresIn: "10m",
    });
    req.headers.authorization = `Bearer ${validToken}`;
    authRepo.findUserById.mockResolvedValue(null);

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: "User associated with this token was not found",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next() and attach user to req if token is valid and user exists", async () => {
    const user = {
      id: "u1",
      email: "user@vami.org",
      username: "username",
      display_name: "Name",
      is_creator: false,
      creator_tier: "free",
    };
    const validToken = jwt.sign({ sub: "u1" }, env.JWT_SECRET, {
      expiresIn: "10m",
    });
    req.headers.authorization = `Bearer ${validToken}`;
    authRepo.findUserById.mockResolvedValue(user);

    await authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.user).toEqual({
      id: user.id,
      email: user.email,
      username: user.username,
      display_name: user.display_name,
      is_creator: user.is_creator,
      creator_tier: user.creator_tier,
    });
  });
});

import { jest } from "@jest/globals";

// Mock the repository modules before importing service
jest.unstable_mockModule("./userRepository.js", () => {
  return {
    findUserById: jest.fn(),
    findUserByUsername: jest.fn(),
    updateUserProfile: jest.fn(),
    deleteUserAccount: jest.fn(),
  };
});

jest.unstable_mockModule("./followRepository.js", () => {
  return {
    createFollowRequest: jest.fn(),
    deleteFollow: jest.fn(),
    updateFollowStatus: jest.fn(),
    getFollowRelationship: jest.fn(),
    getFollowersCount: jest.fn(),
    getFollowingCount: jest.fn(),
    getFollowers: jest.fn(),
    getFollowing: jest.fn(),
    getPendingFollowRequests: jest.fn(),
  };
});

// Import dynamically after mock definitions
const userRepository = await import("./userRepository.js");
const followRepository = await import("./followRepository.js");
const userService = await import("./userService.js");

describe("userService Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("updateProfile", () => {
    it("should successfully update user profile parameters if user exists", async () => {
      const mockUser = { id: "u1", email: "test@vami.org" };
      const updateData = { displayName: "New Name", bio: "New Bio" };

      userRepository.findUserById.mockResolvedValue(mockUser);
      userRepository.updateUserProfile.mockResolvedValue({
        ...mockUser,
        display_name: "New Name",
        bio: "New Bio",
      });

      const result = await userService.updateProfile("u1", updateData);

      expect(result.display_name).toBe("New Name");
      expect(userRepository.findUserById).toHaveBeenCalledWith("u1");
      expect(userRepository.updateUserProfile).toHaveBeenCalledWith(
        "u1",
        updateData,
      );
    });

    it("should throw an error if the user to update does not exist", async () => {
      userRepository.findUserById.mockResolvedValue(null);

      await expect(
        userService.updateProfile("non-existent", { displayName: "Name" }),
      ).rejects.toThrow("User profile not found");
    });
  });

  describe("getPublicProfile", () => {
    it("should return public profile details with counts for public accounts", async () => {
      const targetUser = { id: "t1", username: "target", is_private: false };

      userRepository.findUserByUsername.mockResolvedValue(targetUser);
      followRepository.getFollowersCount.mockResolvedValue(10);
      followRepository.getFollowingCount.mockResolvedValue(5);

      const result = await userService.getPublicProfile("target", "viewer1");

      expect(result.username).toBe("target");
      expect(result.followers_count).toBe(10);
      expect(result.following_count).toBe(5);
      expect(result.is_content_hidden).toBe(false);
    });

    it("should hide profile content for private profiles when not followed", async () => {
      const targetUser = { id: "t1", username: "private", is_private: true };

      userRepository.findUserByUsername.mockResolvedValue(targetUser);
      followRepository.getFollowersCount.mockResolvedValue(10);
      followRepository.getFollowingCount.mockResolvedValue(5);
      followRepository.getFollowRelationship.mockResolvedValue(null); // Not following

      const result = await userService.getPublicProfile("private", "viewer1");

      expect(result.is_content_hidden).toBe(true);
      expect(result.follow_status).toBeNull();
    });

    it("should show profile content for private profiles when follow status is accepted", async () => {
      const targetUser = { id: "t1", username: "private", is_private: true };

      userRepository.findUserByUsername.mockResolvedValue(targetUser);
      followRepository.getFollowersCount.mockResolvedValue(10);
      followRepository.getFollowingCount.mockResolvedValue(5);
      followRepository.getFollowRelationship.mockResolvedValue({
        status: "accepted",
      });

      const result = await userService.getPublicProfile("private", "viewer1");

      expect(result.is_content_hidden).toBe(false);
      expect(result.follow_status).toBe("accepted");
    });

    it("should hide profile content for private profiles when follow status is pending", async () => {
      const targetUser = { id: "t1", username: "private", is_private: true };

      userRepository.findUserByUsername.mockResolvedValue(targetUser);
      followRepository.getFollowersCount.mockResolvedValue(10);
      followRepository.getFollowingCount.mockResolvedValue(5);
      followRepository.getFollowRelationship.mockResolvedValue({
        status: "pending",
      });

      const result = await userService.getPublicProfile("private", "viewer1");

      expect(result.is_content_hidden).toBe(true);
      expect(result.follow_status).toBe("pending");
    });
  });

  describe("followUser", () => {
    it("should prevent users from following themselves", async () => {
      await expect(userService.followUser("user1", "user1")).rejects.toThrow(
        "You cannot follow yourself",
      );
    });

    it("should establish an immediate accepted relationship for public accounts", async () => {
      const targetUser = { id: "t1", is_private: false };
      userRepository.findUserById.mockResolvedValue(targetUser);
      followRepository.getFollowRelationship.mockResolvedValue(null);
      followRepository.createFollowRequest.mockResolvedValue({
        status: "accepted",
      });

      const result = await userService.followUser("user1", "t1");

      expect(result.status).toBe("accepted");
      expect(followRepository.createFollowRequest).toHaveBeenCalledWith(
        "user1",
        "t1",
        "accepted",
      );
    });

    it("should establish a pending request relationship for private accounts", async () => {
      const targetUser = { id: "t2", is_private: true };
      userRepository.findUserById.mockResolvedValue(targetUser);
      followRepository.getFollowRelationship.mockResolvedValue(null);
      followRepository.createFollowRequest.mockResolvedValue({
        status: "pending",
      });

      const result = await userService.followUser("user1", "t2");

      expect(result.status).toBe("pending");
      expect(followRepository.createFollowRequest).toHaveBeenCalledWith(
        "user1",
        "t2",
        "pending",
      );
    });
  });
});

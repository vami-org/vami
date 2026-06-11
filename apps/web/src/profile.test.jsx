import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { ProfileHero } from "./components/ProfileHero";
import { VamiAvatar } from "./components/atoms/VamiAvatar";
import { UserProfile } from "./pages/UserProfile";
import apiClient from "./services/apiClient";
import { useAuth } from "./hooks/useAuth";

// Mock the apiClient module
vi.mock("./services/apiClient", () => {
  return {
    default: {
      get: vi.fn(),
      post: vi.fn(),
      delete: vi.fn(),
    },
  };
});

// Mock react-router-dom hooks and components
vi.mock("react-router-dom", () => ({
  useParams: () => ({ username: "testuser" }),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

// Mock useAuth hook
vi.mock("./hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

describe("Profile Frontend Components Tests", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    useAuth.mockReturnValue({
      user: { id: "viewer_id" },
      isLoading: false,
    });
  });

  describe("VamiAvatar component", () => {
    it("should render initials fallback when src is missing", () => {
      render(<VamiAvatar name="Tester Jones" />);
      expect(screen.getByText("TJ")).toBeDefined();
    });

    it("should render a single initial if only one name word is provided", () => {
      render(<VamiAvatar name="Creator" />);
      expect(screen.getByText("C")).toBeDefined();
    });

    it("should render avatar image when src is valid", () => {
      render(<VamiAvatar src="https://example.com/avatar.png" name="Tester" />);
      const img = screen.getByAltText("Tester");
      expect(img).toBeDefined();
      expect(img.getAttribute("src")).toBe("https://example.com/avatar.png");
    });
  });

  describe("ProfileHero component", () => {
    const mockProfile = {
      id: "u123",
      username: "writer1",
      display_name: "Writer One",
      bio: "This is my writer bio",
      website_url: "https://writer.org",
      followers_count: 5,
      following_count: 3,
      quality_score: 1.5,
      is_private: false,
      follow_status: null,
    };

    it("should render profile stats, bio, and username", () => {
      render(
        <ProfileHero
          profile={mockProfile}
          currentUserId="viewer_user_id"
          onFollowChange={() => {}}
        />,
      );

      expect(screen.getByText("Writer One")).toBeDefined();
      expect(screen.getByText("@writer1")).toBeDefined();
      expect(screen.getByText("This is my writer bio")).toBeDefined();
      expect(screen.getByText("writer.org")).toBeDefined();
      expect(screen.getByText("5")).toBeDefined(); // followers
      expect(screen.getByText("3")).toBeDefined(); // following
    });

    it("should hide follow button when looking at own profile", () => {
      render(
        <ProfileHero
          profile={mockProfile}
          currentUserId="u123" // same as profile id
          onFollowChange={() => {}}
        />,
      );

      const followBtn = screen.queryByRole("button", { name: /follow/i });
      expect(followBtn).toBeNull();
    });

    it("should render Follow button when not following, and trigger API call", async () => {
      const handleFollowChange = vi.fn();
      apiClient.post.mockResolvedValue({
        data: { success: true, status: "accepted" },
      });

      render(
        <ProfileHero
          profile={mockProfile}
          currentUserId="viewer_user_id"
          onFollowChange={handleFollowChange}
        />,
      );

      const followBtn = screen.getByRole("button", { name: "Follow" });
      expect(followBtn).toBeDefined();

      await act(async () => {
        fireEvent.click(followBtn);
      });

      expect(handleFollowChange).toHaveBeenCalled();
      expect(apiClient.post).toHaveBeenCalledWith("/v1/follows/u123");
    });

    it("should render Unfollow button when already following, and trigger API call", async () => {
      const handleFollowChange = vi.fn();
      apiClient.delete.mockResolvedValue({ data: { success: true } });

      const followingProfile = {
        ...mockProfile,
        follow_status: "accepted",
      };

      render(
        <ProfileHero
          profile={followingProfile}
          currentUserId="viewer_user_id"
          onFollowChange={handleFollowChange}
        />,
      );

      const unfollowBtn = screen.getByRole("button", { name: "Unfollow" });
      expect(unfollowBtn).toBeDefined();

      await act(async () => {
        fireEvent.click(unfollowBtn);
      });

      expect(handleFollowChange).toHaveBeenCalled();
      expect(apiClient.delete).toHaveBeenCalledWith("/v1/follows/u123");
    });
  });

  describe("UserProfile page component", () => {
    const mockProfileData = {
      id: "u123",
      username: "testuser",
      display_name: "Test User",
      bio: "Test Bio",
      website_url: "https://test.com",
      followers_count: 10,
      following_count: 5,
      quality_score: 2.0,
      is_private: true,
      follow_status: null,
      is_content_hidden: true,
    };

    it("should delay profile fetch when auth state is loading", async () => {
      useAuth.mockReturnValue({
        user: null,
        isLoading: true,
      });

      render(<UserProfile />);

      // Should show the loading spinner because it's waiting for auth
      expect(screen.getByText("Loading profile...")).toBeDefined();
      expect(apiClient.get).not.toHaveBeenCalled();
    });

    it("should fetch profile and render lock screen for private user", async () => {
      useAuth.mockReturnValue({
        user: { id: "viewer_id" },
        isLoading: false,
      });

      apiClient.get.mockResolvedValue({
        data: {
          success: true,
          profile: mockProfileData,
        },
      });

      await act(async () => {
        render(<UserProfile />);
      });

      expect(apiClient.get).toHaveBeenCalledWith("/v1/users/testuser");

      // Lock screen text should be visible
      expect(screen.getByText("This Account is Private")).toBeDefined();
      expect(screen.queryByText("Articles Published")).toBeNull();
    });

    it("should fetch profile and render public content when private relationship is accepted", async () => {
      useAuth.mockReturnValue({
        user: { id: "viewer_id" },
        isLoading: false,
      });

      apiClient.get.mockResolvedValue({
        data: {
          success: true,
          profile: {
            ...mockProfileData,
            is_content_hidden: false,
            follow_status: "accepted",
          },
        },
      });

      await act(async () => {
        render(<UserProfile />);
      });

      expect(screen.queryByText("This Account is Private")).toBeNull();
      expect(screen.getByText("Articles Published")).toBeDefined();
    });
  });
});

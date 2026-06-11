import apiClient from "./apiClient";

export async function requestMagicLink(email) {
  const response = await apiClient.post("/auth/magic-link", { email });
  return response.data;
}

export async function verifyMagicLink(token) {
  const response = await apiClient.post("/auth/verify-magic-link", { token });
  return response.data;
}

export async function refresh() {
  const response = await apiClient.post("/auth/refresh");
  return response.data;
}

export async function logout() {
  const response = await apiClient.delete("/auth/logout");
  return response.data;
}

export async function fetchProfile() {
  const response = await apiClient.get("/auth/me");
  return response.data;
}

export async function oauthLogin(provider, code) {
  const response = await apiClient.post("/auth/oauth", { provider, code });
  return response.data;
}

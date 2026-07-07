import apiClient from "../api/apiClient";
import { tokenStorage } from "./tokenStorage";

export async function ensureAuthenticated(): Promise<void> {
  await apiClient.get("/auth/me");
}

export async function getValidAccessToken(): Promise<string> {
  try {
    await ensureAuthenticated();

    return tokenStorage.getAccessToken()!;
  } catch {
    console.warn(
      "Access token is invalid or expired. Attempting to refresh...",
    );
  }

  const token = tokenStorage.getAccessToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  return token;
}

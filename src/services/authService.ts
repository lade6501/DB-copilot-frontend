import apiClient from "../api/apiClient";

import type {
  RegisterRequest,
  LoginRequest,
  User,
} from "../types";

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export async function register(
  data: RegisterRequest
): Promise<void> {
  await apiClient.post("/auth/register", data);
}

export async function login(
  data: LoginRequest
): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(
    "/auth/login",
    data
  );

  return response.data;
}

export async function logout(
  refreshToken: string
): Promise<void> {
  await apiClient.post("/auth/logout", {
    refresh_token: refreshToken,
  });
}

export async function getCurrentUser(): Promise<User> {
  const response =
    await apiClient.get<User>("/auth/me");

  return response.data;
}
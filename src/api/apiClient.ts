import axios, { AxiosError } from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";

import { tokenStorage } from "../utils/tokenStorage";
import type { ApiErrorResponse } from "../types/index";

const apiClient: AxiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;

let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token?: string) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStorage.getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & {
          _retry?: boolean;
        })
      | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const url = originalRequest.url ?? "";

    if (url.includes("/auth/login") || url.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    const shouldRefresh =
      error.response?.status === 401 &&
      error.response?.data?.code === "TOKEN_EXPIRED";

    if (!shouldRefresh || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const tokens = tokenStorage.getTokens();

      if (!tokens) {
        throw new Error("No refresh token available");
      }

      const response = await axios.post(
        `${apiClient.defaults.baseURL}/auth/refresh`,
        {
          refresh_token: tokens.refreshToken,
        }
      );

      const { access_token, refresh_token } = response.data;

      tokenStorage.setTokens({
        accessToken: access_token,
        refreshToken: refresh_token,
      });

      processQueue(undefined, access_token);

      originalRequest.headers.Authorization = `Bearer ${access_token}`;

      return apiClient(originalRequest);
    } catch (err) {
      processQueue(err);

      tokenStorage.clearTokens();

      window.dispatchEvent(new Event("session-expired"));

      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;

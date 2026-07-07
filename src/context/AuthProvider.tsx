import {
  useEffect,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from "react";

import {
  login as loginService,
  logout as logoutService,
  getCurrentUser,
} from "../services/authService";

import { tokenStorage } from "../utils/tokenStorage";
import type { LoginRequest } from "../types";

import { AuthContext } from "./AuthContext";
import type { User } from "../types/index";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!tokenStorage.getAccessToken()) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch {
      tokenStorage.clearTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    const response = await loginService(data);

    tokenStorage.setTokens({
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
    });

    setUser(response.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      const tokens = tokenStorage.getTokens();

      if (tokens) {
        await logoutService(tokens.refreshToken);
      }
    } finally {
      tokenStorage.clearTokens();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    const handleSessionExpired = () => {
      tokenStorage.clearTokens();
      setUser(null);
      setIsLoading(false);
    };

    window.addEventListener("session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener("session-expired", handleSessionExpired);
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      refreshUser,
    }),
    [user, isLoading, login, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export const tokenStorage = {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  getTokens(): AuthTokens | null {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();

    if (!accessToken || !refreshToken) {
      return null;
    }

    return {
      accessToken,
      refreshToken,
    };
  },

  setTokens(tokens: AuthTokens): void {
    localStorage.setItem(
      ACCESS_TOKEN_KEY,
      tokens.accessToken
    );

    localStorage.setItem(
      REFRESH_TOKEN_KEY,
      tokens.refreshToken
    );
  },

  clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  hasTokens(): boolean {
    return this.getTokens() !== null;
  },

  isAuthenticated(): boolean {
    return this.hasTokens();
  },
};
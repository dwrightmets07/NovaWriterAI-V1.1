import { Capacitor } from "@capacitor/core";

const TOKEN_KEY = "novawriter_auth_token";

export const tokenStorage = {
  getToken(): string | null {
    // Only use token storage on native platforms
    if (Capacitor.isNativePlatform()) {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  },

  setToken(token: string): void {
    // Only store tokens on native platforms
    if (Capacitor.isNativePlatform()) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  removeToken(): void {
    // Only manage tokens on native platforms
    if (Capacitor.isNativePlatform()) {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  isNativePlatform(): boolean {
    return Capacitor.isNativePlatform();
  }
};

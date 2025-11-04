import { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "./queryClient";
import { getApiUrl } from "./config";
import { tokenStorage } from "./tokenStorage";

interface User {
  id: string;
  email: string;
  role?: string;
  subscriptionTier?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/me"],
    retry: false,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      // Wait for cookie to attach in Capacitor WebView (iOS timing issue fix)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const headers: Record<string, string> = {};
      
      // Add Authorization header for native platforms
      if (tokenStorage.isNativePlatform()) {
        const token = tokenStorage.getToken();
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
      }
      
      const res = await fetch(getApiUrl("/api/auth/me"), {
        headers,
        credentials: "include",
      });
      
      if (res.status === 401) {
        // Clear cached data and token on 401
        queryClient.setQueryData(["/api/auth/me"], null);
        if (tokenStorage.isNativePlatform()) {
          tokenStorage.removeToken();
        }
        return null;
      }
      
      if (!res.ok) {
        throw new Error(`${res.status}: ${res.statusText}`);
      }
      
      return await res.json();
    },
  });

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const res = await apiRequest("POST", "/api/auth/login", { email, password });
      const data = await res.json();
      
      // Store token for native platforms
      if (tokenStorage.isNativePlatform() && data.token) {
        tokenStorage.setToken(data.token);
      }
      
      return data;
    },
    onSuccess: async (data) => {
      // Immediately set cache with user data to prevent navigation race condition
      console.log('[AUTH FIX ACTIVE] Login/Register response:', data);
      const user = { 
        id: data.id, 
        email: data.email, 
        role: data.role,
        subscriptionTier: data.subscriptionTier
      };
      console.log('[AUTH FIX ACTIVE] Setting cache with user:', user);
      queryClient.setQueryData(["/api/auth/me"], user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const res = await apiRequest("POST", "/api/auth/register", { email, password });
      const data = await res.json();
      
      // Store token for native platforms
      if (tokenStorage.isNativePlatform() && data.token) {
        tokenStorage.setToken(data.token);
      }
      
      return data;
    },
    onSuccess: async (data) => {
      // Immediately set cache with user data to prevent navigation race condition
      console.log('[AUTH FIX ACTIVE] Login/Register response:', data);
      const user = { 
        id: data.id, 
        email: data.email, 
        role: data.role,
        subscriptionTier: data.subscriptionTier
      };
      console.log('[AUTH FIX ACTIVE] Setting cache with user:', user);
      queryClient.setQueryData(["/api/auth/me"], user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
      
      // Clear token for native platforms
      if (tokenStorage.isNativePlatform()) {
        tokenStorage.removeToken();
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/me"], null);
    },
  });

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  const register = async (email: string, password: string) => {
    await registerMutation.mutateAsync({ email, password });
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  return (
    <AuthContext.Provider value={{ user: user || null, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

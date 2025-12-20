import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import type { UserSafe } from "@shared/schema";
import { queryClient } from "./queryClient";

interface AuthContextType {
  user: UserSafe | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, user: UserSafe) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSafe | null>(null);
  const [token, setToken] = useState<string | null>(() => 
    localStorage.getItem("siteforgeai-token")
  );
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const storedToken = localStorage.getItem("siteforgeai-token");
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setToken(storedToken);
      } else {
        localStorage.removeItem("siteforgeai-token");
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      localStorage.removeItem("siteforgeai-token");
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = (newToken: string, userData: UserSafe) => {
    localStorage.setItem("siteforgeai-token", newToken);
    setToken(newToken);
    setUser(userData);
    setIsLoading(false);
  };

  const logout = useCallback(() => {
    localStorage.removeItem("siteforgeai-token");
    setToken(null);
    setUser(null);
    queryClient.clear();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function useRequireAuth(requiredRole?: "ADMIN" | "CLIENT") {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      setLocation("/login");
      return;
    }

    if (requiredRole && user?.role !== requiredRole) {
      if (user?.role === "ADMIN") {
        setLocation("/dashboard/admin-dashboard");
      } else {
        setLocation("/dashboard/client-dashboard");
      }
    }
  }, [isLoading, isAuthenticated, user, requiredRole, setLocation]);

  const validateSession = useCallback(async () => {
    const token = localStorage.getItem("siteforgeai-token");
    if (!token) {
      logout();
      setLocation("/login");
      return false;
    }

    try {
      const response = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        logout();
        setLocation("/login");
        return false;
      }

      return true;
    } catch {
      logout();
      setLocation("/login");
      return false;
    }
  }, [logout, setLocation]);

  return {
    user,
    isLoading,
    isAuthenticated,
    isAuthorized: !requiredRole || user?.role === requiredRole,
    validateSession,
  };
}

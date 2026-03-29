"use client";

import { createContext, useState, useEffect, type ReactNode } from "react";

export type UserData = {
  id: string;
  username: string;
  role: "USER" | "ADMIN";
};

type AuthContextType = {
  user: UserData | null;
  isLoading: boolean;
  login: (user: UserData) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/auth/me");
      if (!response.ok) {
        setUser(null);
        return;
      }

      const data = await response.json();
      if (data.user === null) {
        // Próbáljuk meg a refresh token-t
        const refreshResponse = await fetch("/auth/refresh", {
          method: "POST",
        });

        if (!refreshResponse.ok) {
          setUser(null);
          return;
        }

        const refreshData = await refreshResponse.json();
        setUser(refreshData.user || null);
      } else {
        setUser(data.user);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = (userData: UserData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

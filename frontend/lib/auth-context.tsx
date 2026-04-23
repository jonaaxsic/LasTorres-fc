"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authApi, User } from "./api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    const { data, error } = await authApi.me();
    if (data && !error) {
      setUser(data);
    } else {
      localStorage.removeItem("auth_token");
    }
    setIsLoading(false);
  };

  const login = async (username: string, password: string) => {
    const { data, error } = await authApi.login({ username, password });
    
    if (error || !data) {
      return { success: false, error: error || "Error de autenticación" };
    }

    // El backend devuelve accessToken, no access_token
    const token = data.access_token || data.accessToken;
    if (!token) {
      return { success: false, error: "Token no recibido" };
    }
    
    localStorage.setItem("auth_token", token);
    
    const { data: userData } = await authApi.me();
    if (userData) {
      setUser(userData);
      return { success: true };
    }

    return { success: false, error: "Error al obtener datos del usuario" };
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
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

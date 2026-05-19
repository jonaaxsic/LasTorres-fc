"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authApi, User } from "./api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    // El token ya no se guarda en localStorage; el backend lo maneja con cookies HttpOnly
    // Simplemente intentamos obtener el usuario desde el backend
    // El backend lee la cookie automáticamente
    const { data, error } = await authApi.me();
    
    if (data && !error) {
      setUser(data);
    }
    // Si hay error, simplemente no hay usuario (session expirada)
    setIsLoading(false);
  };

  const login = async (username: string, password: string) => {
    const { data, error } = await authApi.login({ username, password });
    
    if (error || !data) {
      return { success: false, error: error || "Error de autenticación" };
    }

    // El backend ya setea las cookies, solo necesitamos los datos del usuario
    // La respuesta ahora tiene { usuario: User }
    if (data.usuario) {
      setUser(data.usuario);
      return { success: true };
    }

    return { success: false, error: "Error al obtener datos del usuario" };
  };

  const logout = async () => {
    // Llamar al endpoint de logout para borrar las cookies
    await authApi.logout();
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
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, authApi } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Verify token is still valid
          const response = await authApi.getMe();
          setUser(response.user);
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      const { user: userData, token: tokenData } = response;
      
      localStorage.setItem("token", tokenData);
      localStorage.setItem("user", JSON.stringify(userData));
      
      setUser(userData);
      setToken(tokenData);
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || "Login failed");
    }
  };

  const register = async (email: string, password: string, name: string, role = "user") => {
    try {
      const response = await authApi.register({ email, password, name, role });
      const { user: userData, token: tokenData } = response;
      
      localStorage.setItem("token", tokenData);
      localStorage.setItem("user", JSON.stringify(userData));
      
      setUser(userData);
      setToken(tokenData);
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || "Registration failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

"use client";

import { User, authApi } from "@/lib/api";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    role?: string
  ) => Promise<void>;
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
      if (typeof window === "undefined") {
        setLoading(false);
        return;
      }

      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          // Verify token is still valid
          const response = await authApi.getMe();
          const userData = (response as any).user;

          // Convert backend id to frontend _id format
          const normalizedUser = {
            ...userData,
            _id: userData.id || userData._id,
          };

          setUser(normalizedUser);
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
      console.log("AuthContext: Starting login...");
      console.log("AuthContext: Email:", email);

      const rawResponse = await authApi.login({ email, password });
      console.log("AuthContext: API response:", rawResponse);
      console.log("AuthContext: Response type:", typeof rawResponse);

      // Some environments may return a JSON string instead of an object
      const response =
        typeof rawResponse === "string"
          ? (JSON.parse(rawResponse) as unknown)
          : rawResponse;

      console.log(
        "AuthContext: Parsed response type:",
        typeof response,
        "keys:",
        response && typeof response === "object" ? Object.keys(response) : []
      );

      // Handle different possible response structures
      let userData, tokenData;

      if (response && typeof response === "object") {
        // Check if response has user and token directly
        if ("user" in response && "token" in response) {
          userData = response.user;
          tokenData = response.token;
        }
        // Check if response is wrapped in a data property
        else if (
          "data" in response &&
          response.data &&
          "user" in response.data &&
          "token" in response.data
        ) {
          userData = response.data.user;
          tokenData = response.data.token;
        }
        // Check if response is the user data itself (fallback)
        else if ("id" in response || "_id" in response) {
          userData = response;
          tokenData = null; // Token might be in a different property
        }
      }

      console.log("AuthContext: Extracted user data:", userData);
      console.log("AuthContext: Extracted token:", tokenData);

      // Check if userData exists
      if (!userData) {
        throw new Error("No user data received from server");
      }

      // Check if token exists
      if (!tokenData) {
        throw new Error("No token received from server");
      }

      // Convert backend id to frontend _id format
      const normalizedUser = {
        ...userData,
        _id: userData.id || userData._id,
      };
      console.log("AuthContext: Normalized user:", normalizedUser);

      if (typeof window !== "undefined") {
        localStorage.setItem("token", tokenData);
        localStorage.setItem("user", JSON.stringify(normalizedUser));
        console.log("AuthContext: Stored in localStorage");
      }

      setUser(normalizedUser);
      setToken(tokenData);
      console.log("AuthContext: State updated");

      // Return the user data to ensure the state is updated
      return normalizedUser;
    } catch (error: any) {
      console.error("AuthContext: Login error:", error);
      console.error("AuthContext: Error response:", error.response);
      console.error("AuthContext: Error data:", error.response?.data);
      throw new Error(error.response?.data?.error?.message || "Login failed");
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    role = "user"
  ) => {
    try {
      const response = await authApi.register({ email, password, name, role });
      const { user: userData, token: tokenData } = response as any;

      // Convert backend id to frontend _id format
      const normalizedUser = {
        ...userData,
        _id: userData.id || userData._id,
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("token", tokenData);
        localStorage.setItem("user", JSON.stringify(normalizedUser));
      }

      setUser(normalizedUser);
      setToken(tokenData);
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error?.message || "Registration failed"
      );
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
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

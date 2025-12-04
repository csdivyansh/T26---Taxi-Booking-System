import React, { createContext, useState, useEffect, ReactNode } from "react";
import { authAPI, User, SigninData, SignupData } from "@/lib/authAPI";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signin: (data: SigninData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const userData = await authAPI.getProfile();
          setUser(userData);
        } catch (err) {
          localStorage.removeItem("authToken");
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const signin = async (data: SigninData) => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await authAPI.signin(data);
      localStorage.setItem("authToken", response.token);
      setUser(response.user);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Failed to sign in";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupData) => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await authAPI.signup(data);
      localStorage.setItem("authToken", response.token);
      setUser(response.user);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Failed to sign up";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    setError(null);
  };

  const clearError = () => setError(null);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signin,
    signup,
    logout,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

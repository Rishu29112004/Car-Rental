"use client";
import { LoginFormValue } from "@/components/screens/Login/components/login.schema";
import { signupFormValue } from "@/components/screens/Signup/signup.schema";
import { authService } from "@/components/services/auth.service";
import { clearTokens, getAccessToken, setTokens } from "@/utils/token";
import { useContext, useEffect, useState, createContext } from "react";
import { toast } from "sonner";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  bio?: string;
  imageUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  registerUser: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = async () => {
    try {
      const token = getAccessToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      const res = await authService.me();
      setUser(res.data.data);
      setIsAuthenticated(true);
    } catch {
      clearTokens();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (formData: LoginFormValue) => {
    try {
      const res = await authService.login(formData);
      const { accessToken, refreshToken, ...userData } = res.data.data;


    console.log("LOGIN FULL RESPONSE 👉", res);
    console.log("LOGIN DATA 👉", res.data);
    console.log("LOGIN USER DATA 👉", res.data.data);
    
      setTokens(accessToken, refreshToken);
      setUser(userData);
      setIsAuthenticated(true);
      toast.success("Login successful");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
      throw err;
    }
  };

  const registerUser = async (formData: signupFormValue) => {
    try {
      const res = await authService.register(formData);
      // success message show karo
      if (res.data?.status === "success") {
        console.log(res.data.message); // "User registered successfully"
      }
      return res.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
      throw error;
    }
  };

  const logout = async (callApi = true) => {
    try {
      if (callApi) await authService.logout();
    } catch {
    } finally {
      clearTokens();
      setUser(null);
      toast.success("Logoutsuccessful");
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, logout, registerUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

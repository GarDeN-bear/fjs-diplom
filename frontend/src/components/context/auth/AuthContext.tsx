import React, { createContext, useContext, useEffect, useState } from "react";
import { emptyUser, VITE_BACKEND_URL, type User } from "../../../utils/utils";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User;
  setUser: (user: User) => void;
  logout: () => void;
  login: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User>(emptyUser);

  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const url: string = `${VITE_BACKEND_URL}/api/auth/me`;
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        setUser(emptyUser);
        const error = await response.json();
        throw new Error(`Ошибка при входе": ${error.message}`);
      }

      const data = await response.json();
      setUser(data);
      console.log("Профиль:", data);
    } catch (error) {
      console.error("Auth check error:", error);
      setUser(emptyUser);
    }
  };

  const logout = async () => {
    try {
      const url: string = `${VITE_BACKEND_URL}/api/auth/logout`;
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Ошибка при выходе": ${error}`);
      }
      setUser(emptyUser);
      navigate("/");
    } catch (error) {
      throw new Error(`Ошибка при выходе": ${error}`);
    }
  };

  const login = async (user: User) => {
    try {
      const url: string = `${VITE_BACKEND_URL}/api/auth/login`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Ошибка при входе": ${error.message}`);
      }

      const data = await response.json();
      setUser(data);
      navigate("/user");
      console.log("Профиль:", data);
    } catch (error) {
      throw new Error(`Ошибка при входе": ${error}`);
    }
  };

  const value: AuthContextType = {
    user,
    setUser,
    logout,
    login,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthContextProvider");
  }

  return context;
};

import React, { createContext, useContext, useState } from "react";
import {
  emptyUser,
  VITE_BACKEND_URL,
  type AuthResponce,
  type User,
} from "../../../utils/utils";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User;
  token: string;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  login: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User>(emptyUser);
  const [token, setToken] = useState<string>("");

  const navigate = useNavigate();

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

      const data: AuthResponce = await response.json();

      const authUser: User = {
        _id: data.user._id,
        email: data.user.email,
        name: data.user.name,
        contactPhone: data.user.contactPhone,
        role: data.user.role,
      };

      setUser(authUser);
      setToken(data.token);
      navigate("/user");
      console.log("Профиль:", data);
    } catch (error) {
      throw new Error(`Ошибка при входе": ${error}`);
    }
  };

  const value: AuthContextType = {
    token,
    user,
    setUser,
    setToken,
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

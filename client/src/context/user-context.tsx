import React, { createContext, useContext, useState, ReactNode } from "react";

interface UserInfo {
  name: string;
  email: string;
  role: string;
  avatar: string;
  notifications: {
    email: boolean;
    push: boolean;
    messages: boolean;
  };
}

interface UserContextType {
  userInfo: UserInfo | null;
  updateUserInfo: (info: Partial<UserInfo>) => void;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const initialUserInfo: UserInfo = {
  name: "Admin",
  email: "admin@mtsgestion.com",
  role: "Administrateur",
  avatar: "/avatar.png",
  notifications: {
    email: true,
    push: true,
    messages: true
  }
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });

  const updateUserInfo = (info: Partial<UserInfo>) => {
    setUserInfo(prev => prev ? { ...prev, ...info } : null);
  };

  const login = (username: string, password: string) => {
    if (username === "admin" && password === "admin") {
      setIsAuthenticated(true);
      setUserInfo(initialUserInfo);
      localStorage.setItem("isAuthenticated", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserInfo(null);
    localStorage.removeItem("isAuthenticated");
  };

  return (
    <UserContext.Provider value={{ userInfo, updateUserInfo, isAuthenticated, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
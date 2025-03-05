import { createContext, useContext, useState, ReactNode } from "react";

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
  isAuthenticated: boolean;
  login: (username: string, password: string) => void;
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
  const [userInfo, setUserInfo] = useState<UserInfo | null>(() => {
    const isAuth = localStorage.getItem("isAuthenticated") === "true";
    return isAuth ? initialUserInfo : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });

  const login = (username: string, password: string) => {
    if (username === "admin" && password === "admin") {
      setIsAuthenticated(true);
      setUserInfo(initialUserInfo);
      localStorage.setItem("isAuthenticated", "true");
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserInfo(null);
    localStorage.removeItem("isAuthenticated");
  };

  const value = {
    userInfo,
    isAuthenticated,
    login,
    logout
  };

  return (
    <UserContext.Provider value={value}>
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
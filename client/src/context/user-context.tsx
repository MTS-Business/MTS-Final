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
  userInfo: UserInfo;
  updateUserInfo: (info: Partial<UserInfo>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "John Cena",
    email: "john.cena@example.com",
    role: "Administrateur",
    avatar: "/avatar.png",
    notifications: {
      email: true,
      push: true,
      messages: true
    }
  });

  const updateUserInfo = (info: Partial<UserInfo>) => {
    setUserInfo(prev => ({ ...prev, ...info }));
  };

  return (
    <UserContext.Provider value={{ userInfo, updateUserInfo }}>
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

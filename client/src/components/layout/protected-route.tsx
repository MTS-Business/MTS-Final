import { useEffect } from "react";
import { useLocation } from "wouter";
import { useUser } from "@/context/user-context";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { isAuthenticated } = useUser();

  useEffect(() => {
    if (!isAuthenticated && location !== "/login") {
      setLocation("/login");
    }
  }, [isAuthenticated, location, setLocation]);

  return isAuthenticated ? <>{children}</> : null;
}
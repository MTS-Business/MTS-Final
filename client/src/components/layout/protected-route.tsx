import { useEffect } from "react";
import { useLocation } from "wouter";
import { useUser } from "@/context/user-context";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useUser();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, setLocation]);

  return isAuthenticated ? <>{children}</> : null;
}
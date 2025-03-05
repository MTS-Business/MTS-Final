import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useUser } from "@/context/user-context";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login, isAuthenticated } = useUser();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(credentials.username, credentials.password);

    if (credentials.username === "admin" && credentials.password === "admin") {
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans votre espace de gestion",
      });
    } else {
      toast({
        title: "Erreur de connexion",
        description: "Identifiants incorrects (utilisez admin/admin)",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-[400px] p-6 space-y-6">
          <div className="space-y-2 text-center">
            <img 
              src="/logo.png" 
              alt="MTS Gestion" 
              className="w-48 mx-auto mb-4"
            />
            <p className="text-sm text-muted-foreground">
              Connectez-vous à votre espace de gestion
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Nom d'utilisateur"
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Mot de passe"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
              />
            </div>
            <Button type="submit" className="w-full">
              Se connecter
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
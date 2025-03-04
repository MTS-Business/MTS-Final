import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Camera, Mail, UserCircle, Bell, Lock, Save } from "lucide-react";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userInfo, setUserInfo] = useState({
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

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simuler le changement d'avatar avec un URL temporaire
      const tempUrl = URL.createObjectURL(file);
      setUserInfo({ ...userInfo, avatar: tempUrl });
      toast({
        title: "Photo de profil mise à jour",
        description: "Votre photo de profil a été changée avec succès."
      });
    }
  };

  const handleSaveChanges = () => {
    // Simuler la sauvegarde
    toast({
      title: "Modifications enregistrées",
      description: "Vos modifications ont été enregistrées avec succès."
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profil</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={userInfo.avatar} />
                <AvatarFallback>JC</AvatarFallback>
              </Avatar>
              <button 
                onClick={handleAvatarClick}
                className="absolute bottom-0 right-0 p-2 bg-[#0077B6] rounded-full text-white hover:bg-[#0077B6]/90 transition-colors"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nom complet</Label>
              <div className="flex gap-2">
                <Input
                  id="name"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                />
                <Button variant="outline" size="icon">
                  <UserCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  value={userInfo.email}
                  onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                />
                <Button variant="outline" size="icon">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="role">Rôle</Label>
              <Input
                id="role"
                value={userInfo.role}
                disabled
                className="bg-muted"
              />
            </div>

            <Button 
              className="w-full bg-[#0077B6] text-white hover:bg-[#0077B6]/90"
              onClick={handleSaveChanges}
            >
              <Save className="mr-2 h-4 w-4" />
              Enregistrer les modifications
            </Button>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications par email</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications par email
                  </p>
                </div>
                <Switch
                  checked={userInfo.notifications.email}
                  onCheckedChange={(checked) =>
                    setUserInfo({
                      ...userInfo,
                      notifications: { ...userInfo.notifications, email: checked }
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications push</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications sur le navigateur
                  </p>
                </div>
                <Switch
                  checked={userInfo.notifications.push}
                  onCheckedChange={(checked) =>
                    setUserInfo({
                      ...userInfo,
                      notifications: { ...userInfo.notifications, push: checked }
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Messages</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications pour les nouveaux messages
                  </p>
                </div>
                <Switch
                  checked={userInfo.notifications.messages}
                  onCheckedChange={(checked) =>
                    setUserInfo({
                      ...userInfo,
                      notifications: { ...userInfo.notifications, messages: checked }
                    })
                  }
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Sécurité</h2>
            <div className="space-y-4">
              <Button variant="outline" className="w-full">
                <Lock className="mr-2 h-4 w-4" />
                Changer le mot de passe
              </Button>
              <Button variant="outline" className="w-full">
                <Bell className="mr-2 h-4 w-4" />
                Gérer les appareils connectés
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
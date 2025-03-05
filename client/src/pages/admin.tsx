import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash, Lock } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Données de test pour le développement
const initialUsers = [
  {
    id: 1,
    name: "John Cena",
    email: "john.cena@example.com",
    role: "Administrateur",
    avatar: "/avatar.png",
    status: "active"
  },
  {
    id: 2,
    name: "Sophie Martin",
    email: "sophie.martin@example.com",
    role: "Comptable",
    avatar: "/avatar-sophie.png",
    status: "active"
  }
];

const roles = [
  { id: "admin", label: "Administrateur" },
  { id: "accountant", label: "Comptable" },
  { id: "support", label: "Support" },
  { id: "user", label: "Utilisateur" }
];

const pages = [
  { id: "dashboard", label: "Tableau de bord", path: "/" },
  { id: "inventory", label: "Inventaire", path: "/inventory" },
  { id: "services", label: "Services", path: "/services" },
  { id: "invoices", label: "Factures", path: "/invoices" },
  { id: "customers", label: "Clients", path: "/customers" },
  { id: "expenses", label: "Dépenses", path: "/expenses" },
  { id: "sales", label: "Ventes", path: "/sales" },
  { id: "messages", label: "Messages", path: "/messages" },
  { id: "profile", label: "Profil", path: "/profile" }
];

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isAccessOpen, setIsAccessOpen] = useState(false);
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });

  const { data: users = initialUsers, isLoading } = useQuery({
    queryKey: ["/api/users"],
    initialData: initialUsers, //Added to prevent initial blank table
  });

  const createUser = useMutation({
    mutationFn: async (values: typeof newUser) => {
      try {
        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error("Erreur lors de l'ajout de l'utilisateur");
        }

        // Simuler une réponse réussie
        const newUserData = {
          id: users.length + 1,
          name: values.name,
          email: values.email,
          role: roles.find(r => r.id === values.role)?.label || "Utilisateur",
          avatar: "/avatar.png",
          status: "active"
        };

        // Mettre à jour le cache avec le nouvel utilisateur
        queryClient.setQueryData(["/api/users"], (old: typeof users = []) => {
          return [...old, newUserData];
        });

        return newUserData;
      } catch (error) {
        console.error("Erreur lors de l'ajout:", error);
        throw new Error("Erreur lors de l'ajout de l'utilisateur");
      }
    },
    onSuccess: () => {
      toast({
        title: "Utilisateur créé",
        description: "Le nouvel utilisateur a été créé avec succès."
      });
      setIsOpen(false);
      setNewUser({ name: "", email: "", role: "", password: "" });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleDeleteUser = (userId: number) => {
    queryClient.setQueryData(["/api/users"], (oldUsers) =>
      oldUsers.filter((user) => user.id !== userId)
    );
    toast({
      title: "Utilisateur supprimé",
      description: "L'utilisateur a été supprimé avec succès."
    });
  };

  const handleOpenAccess = (user: any) => {
    setSelectedUser(user);
    setSelectedPages(roles.find(r => r.label === user.role)?.pages || []);
    setIsAccessOpen(true);
  };

  const handleSaveAccess = () => {
    toast({
      title: "Accès modifiés",
      description: `Les accès de ${selectedUser.name} ont été mis à jour.`
    });
    setIsAccessOpen(false);
  };

  // Divise les pages en groupes de 4
  const pageGroups = pages.reduce((acc: any[], page, index) => {
    const groupIndex = Math.floor(index / 4);
    if (!acc[groupIndex]) {
      acc[groupIndex] = [];
    }
    acc[groupIndex].push(page);
    return acc;
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Administration</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#0077B6] text-white hover:bg-[#0077B6]/90">
              <Plus className="mr-2 h-4 w-4" />
              Nouvel utilisateur
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="role">Rôle</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="password">Mot de passe temporaire</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
              </div>
              <Button
                className="w-full bg-[#0077B6] text-white hover:bg-[#0077B6]/90"
                onClick={() => createUser.mutate(newUser)}
                disabled={createUser.isPending}
              >
                {createUser.isPending ? "Création en cours..." : "Créer l'utilisateur"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isAccessOpen} onOpenChange={setIsAccessOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Gérer les accès - {selectedUser?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Card>
              <div className="p-4">
                {pageGroups.map((group, groupIndex) => (
                  <div key={groupIndex} className="flex mb-4">
                    {group.map((page) => (
                      <div key={page.id} className="flex items-center w-1/4 space-x-2">
                        <Checkbox
                          id={page.id}
                          checked={selectedPages.includes(page.path)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedPages([...selectedPages, page.path]);
                            } else {
                              setSelectedPages(selectedPages.filter(p => p !== page.path));
                            }
                          }}
                        />
                        <Label htmlFor={page.id}>{page.label}</Label>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </Card>
            <Button
              className="w-full bg-[#0077B6] text-white hover:bg-[#0077B6]/90"
              onClick={handleSaveAccess}
            >
              Enregistrer les modifications
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span>{user.name}</span>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className={`h-2 w-2 rounded-full mr-2 ${
                      user.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                    }`} />
                    {user.status === 'active' ? 'Actif' : 'Inactif'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenAccess(user)}
                    >
                      <Lock className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
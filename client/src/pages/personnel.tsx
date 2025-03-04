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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Personnel() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [personnel, setPersonnel] = useState([
    {
      id: 1,
      nom: "Martin",
      prenom: "Sophie",
      cin: "12345678",
      fonction: "Comptable",
      salaireBrut: 2000.000,
      prime: 200.000,
    },
  ]);

  const [newEmployee, setNewEmployee] = useState({
    nom: "",
    prenom: "",
    cin: "",
    fonction: "",
    salaireBrut: 0,
    prime: 0,
  });

  const handleCreate = () => {
    const newEmployeeData = {
      id: personnel.length + 1,
      ...newEmployee,
    };

    setPersonnel([...personnel, newEmployeeData]);
    setIsOpen(false);
    setNewEmployee({ nom: "", prenom: "", cin: "", fonction: "", salaireBrut: 0, prime: 0 });

    toast({
      title: "Employé ajouté",
      description: "Le nouvel employé a été ajouté avec succès."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Personnel</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#0077B6] text-white hover:bg-[#0077B6]/90">
              <Plus className="mr-2 h-4 w-4" />
              Nouvel employé
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un nouvel employé</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nom">Nom</Label>
                <Input
                  id="nom"
                  value={newEmployee.nom}
                  onChange={(e) => setNewEmployee({ ...newEmployee, nom: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="prenom">Prénom</Label>
                <Input
                  id="prenom"
                  value={newEmployee.prenom}
                  onChange={(e) => setNewEmployee({ ...newEmployee, prenom: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="cin">CIN</Label>
                <Input
                  id="cin"
                  value={newEmployee.cin}
                  onChange={(e) => setNewEmployee({ ...newEmployee, cin: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="fonction">Fonction</Label>
                <Input
                  id="fonction"
                  value={newEmployee.fonction}
                  onChange={(e) => setNewEmployee({ ...newEmployee, fonction: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="salaireBrut">Salaire Brut</Label>
                <Input
                  id="salaireBrut"
                  type="number"
                  step="0.001"
                  value={newEmployee.salaireBrut}
                  onChange={(e) => setNewEmployee({ ...newEmployee, salaireBrut: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="prime">Prime</Label>
                <Input
                  id="prime"
                  type="number"
                  step="0.001"
                  value={newEmployee.prime}
                  onChange={(e) => setNewEmployee({ ...newEmployee, prime: parseFloat(e.target.value) })}
                />
              </div>
              <Button
                className="w-full bg-[#0077B6] text-white hover:bg-[#0077B6]/90"
                onClick={handleCreate}
              >
                Ajouter l'employé
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Prénom</TableHead>
              <TableHead>CIN</TableHead>
              <TableHead>Fonction</TableHead>
              <TableHead>Salaire Brut</TableHead>
              <TableHead>Prime</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {personnel.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.nom}</TableCell>
                <TableCell>{employee.prenom}</TableCell>
                <TableCell>{employee.cin}</TableCell>
                <TableCell>{employee.fonction}</TableCell>
                <TableCell>{employee.salaireBrut.toFixed(3)}</TableCell>
                <TableCell>{employee.prime.toFixed(3)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
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
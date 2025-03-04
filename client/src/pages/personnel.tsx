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
  DialogFooter,
  DialogDescription,
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
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
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

  const handleEdit = () => {
    setPersonnel(personnel.map(emp => 
      emp.id === selectedEmployee.id ? selectedEmployee : emp
    ));
    setIsEditOpen(false);
    toast({
      title: "Employé modifié",
      description: "Les informations de l'employé ont été mises à jour avec succès."
    });
  };

  const handleDelete = () => {
    setPersonnel(personnel.filter(emp => emp.id !== selectedEmployee.id));
    setIsDeleteOpen(false);
    toast({
      title: "Employé supprimé",
      description: "L'employé a été supprimé avec succès."
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

      {/* Modal d'édition */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'employé</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-nom">Nom</Label>
              <Input
                id="edit-nom"
                value={selectedEmployee?.nom || ""}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, nom: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-prenom">Prénom</Label>
              <Input
                id="edit-prenom"
                value={selectedEmployee?.prenom || ""}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, prenom: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-cin">CIN</Label>
              <Input
                id="edit-cin"
                value={selectedEmployee?.cin || ""}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, cin: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-fonction">Fonction</Label>
              <Input
                id="edit-fonction"
                value={selectedEmployee?.fonction || ""}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, fonction: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-salaireBrut">Salaire Brut</Label>
              <Input
                id="edit-salaireBrut"
                type="number"
                step="0.001"
                value={selectedEmployee?.salaireBrut || 0}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, salaireBrut: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="edit-prime">Prime</Label>
              <Input
                id="edit-prime"
                type="number"
                step="0.001"
                value={selectedEmployee?.prime || 0}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, prime: parseFloat(e.target.value) })}
              />
            </div>
            <Button
              className="w-full bg-[#0077B6] text-white hover:bg-[#0077B6]/90"
              onClick={handleEdit}
            >
              Enregistrer les modifications
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmation de suppression */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cet employé ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        setSelectedEmployee(employee);
                        setIsEditOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        setSelectedEmployee(employee);
                        setIsDeleteOpen(true);
                      }}
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
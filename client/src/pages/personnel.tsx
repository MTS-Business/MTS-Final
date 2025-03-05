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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { personnelSchema, type Personnel } from "@/shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface PersonnelResponse extends Personnel {
  id: number;
}

export default function Personnel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const { data: personnel = [], isLoading } = useQuery<PersonnelResponse[]>({
    queryKey: ["/api/personnel"],
  });

  const form = useForm<Personnel>({
    resolver: zodResolver(personnelSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      cin: "",
      fonction: "",
      salaireBrut: 0,
      prime: 0,
      dateEmbauche: new Date(),
    },
  });

  const createPersonnel = useMutation({
    mutationFn: async (values: Personnel) => {
      try {
        const response = await fetch("/api/personnel", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...values,
            dateEmbauche: values.dateEmbauche.toISOString(),
            salaireBrut: Number(values.salaireBrut),
            prime: Number(values.prime),
          }),
        });

        if (!response.ok) {
          throw new Error("Erreur lors de l'ajout de l'employé");
        }

        // Si la réponse n'est pas du JSON, on retourne un succès simple
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          return { success: true };
        }

        return response.json();
      } catch (error) {
        console.error("Erreur lors de l'ajout:", error);
        throw new Error("Erreur lors de l'ajout de l'employé");
      }
    },
    onSuccess: () => {
      // Invalider le cache et recharger les données
      queryClient.invalidateQueries({ queryKey: ["/api/personnel"] });
      toast({
        title: "Employé ajouté",
        description: "Le nouvel employé a été ajouté avec succès."
      });
      setIsOpen(false);
      form.reset();
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Personnel</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <Button 
            onClick={() => setIsOpen(true)}
            className="bg-[#0077B6] text-white hover:bg-[#0077B6]/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouvel employé
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un nouvel employé</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => createPersonnel.mutate(data))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="nom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="prenom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CIN</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fonction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fonction</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="salaireBrut"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salaire Brut</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.001"
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="prime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prime</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.001"
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="dateEmbauche"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date d'embauche</FormLabel>
                      <FormControl>
                        <Input 
                          type="date"
                          value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                          onChange={(e) => field.onChange(new Date(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit"
                  className="w-full bg-[#0077B6] text-white hover:bg-[#0077B6]/90"
                  disabled={createPersonnel.isPending}
                >
                  {createPersonnel.isPending ? "Ajout en cours..." : "Ajouter l'employé"}
                </Button>
              </form>
            </Form>
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
              <TableHead>Date d'embauche</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(personnel) && personnel.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.nom}</TableCell>
                <TableCell>{employee.prenom}</TableCell>
                <TableCell>{employee.cin}</TableCell>
                <TableCell>{employee.fonction}</TableCell>
                <TableCell>{Number(employee.salaireBrut).toFixed(3)} DT</TableCell>
                <TableCell>{Number(employee.prime).toFixed(3)} DT</TableCell>
                <TableCell>
                  {format(new Date(employee.dateEmbauche), "dd MMM yyyy", { locale: fr })}
                </TableCell>
              </TableRow>
            ))}
            {(!Array.isArray(personnel) || personnel.length === 0) && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Aucun employé enregistré
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
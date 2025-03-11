import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText } from "lucide-react";
import CustomerForm from "@/components/forms/customer-form";

const getCategoryLabel = (category: string) => {
  const categories = {
    entreprise: "Entreprise",
    installateur: "Installateur",
    particulier: "Particulier",
    association: "Association",
    industrie: "Industrie",
    agricole: "Agricole",
    etatique: "Étatique",
  };
  return categories[category as keyof typeof categories] || category;
};

export default function Customers() {
  const [open, setOpen] = useState(false);
  const { data: customers, isLoading } = useQuery({
    queryKey: ["/api/customers"],
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Clients</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#0077B6] text-white hover:bg-[#0077B6]/90">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <CustomerForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Référence</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Adresse</TableHead>
              <TableHead>Matricule Fiscale</TableHead>
              <TableHead>Documents</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers?.map((customer: any) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.reference}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {getCategoryLabel(customer.category)}
                  </Badge>
                </TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.address}</TableCell>
                <TableCell>{customer.fiscalNumber}</TableCell>
                <TableCell>
                  {customer.documents?.length > 0 ? (
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4" />
                      <span className="ml-2">{customer.documents.length} fichier(s)</span>
                    </Button>
                  ) : (
                    "-"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
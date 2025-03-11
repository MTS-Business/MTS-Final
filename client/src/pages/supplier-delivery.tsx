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
import { Truck, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface SupplierDelivery {
  id: number;
  number: string;
  date: string;
  supplier: string;
  address: string;
  status: string;
}

export default function SupplierDelivery() {
  const { data: deliveries = [] } = useQuery<SupplierDelivery[]>({
    queryKey: ["/api/supplier-delivery"],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Bons de livraison fournisseur</h1>
        <Button className="bg-[#0077B6] text-white hover:bg-[#0077B6]/90">
          <Plus className="mr-2 h-4 w-4" />
          Nouveau bon de livraison
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Numéro</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Fournisseur</TableHead>
              <TableHead>Adresse</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deliveries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Aucun bon de livraison trouvé
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

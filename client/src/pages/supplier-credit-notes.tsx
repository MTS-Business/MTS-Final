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
import { FileMinus, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface SupplierCreditNote {
  id: number;
  number: string;
  date: string;
  supplier: string;
  amount: number;
  status: string;
}

export default function SupplierCreditNotes() {
  const { data: creditNotes = [] } = useQuery<SupplierCreditNote[]>({
    queryKey: ["/api/supplier-credit-notes"],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Factures d'avoir fournisseur</h1>
        <Button className="bg-[#0077B6] text-white hover:bg-[#0077B6]/90">
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle facture d'avoir
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Numéro</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Fournisseur</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {creditNotes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Aucune facture d'avoir trouvée
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

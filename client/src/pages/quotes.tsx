import { useState } from "react";
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
} from "@/components/ui/dialog";
import { FileText, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import QuoteForm from "@/components/forms/quote-form";

export default function Quotes() {
  const [open, setOpen] = useState(false);
  const { data: quotes = [] } = useQuery({
    queryKey: ["/api/quotes"],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Devis</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <Button 
            className="bg-[#0077B6] text-white hover:bg-[#0077B6]/90"
            onClick={() => setOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouveau devis
          </Button>
          <DialogContent className="max-w-4xl">
            <QuoteForm 
              onSuccess={() => setOpen(false)}
              vat={19}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Numéro</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Validité</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Aucun devis trouvé
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
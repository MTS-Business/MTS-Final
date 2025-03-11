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
import { FileMinus, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import CreditNoteForm from "@/components/forms/credit-note-form";

export default function CreditNotes() {
  const [open, setOpen] = useState(false);
  const { data: creditNotes = [] } = useQuery({
    queryKey: ["/api/credit-notes"],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Avoirs</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <Button 
            className="bg-[#0077B6] text-white hover:bg-[#0077B6]/90"
            onClick={() => setOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouvel avoir
          </Button>
          <DialogContent className="max-w-4xl">
            <CreditNoteForm 
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
              <TableHead>Statut</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {creditNotes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Aucun avoir trouvé
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
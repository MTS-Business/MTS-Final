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
import { Plus, FileText, Download } from "lucide-react";
import { format } from "date-fns";
import ExpenseForm from "@/components/forms/expense-form";
import { fr } from "date-fns/locale";

export default function Expenses() {
  const [open, setOpen] = useState(false);
  const { data: expenses, isLoading } = useQuery({
    queryKey: ["/api/expenses"],
  });

  // Fonction pour télécharger la facture
  const handleDownloadInvoice = async (invoiceUrl: string) => {
    try {
      const response = await fetch(invoiceUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `facture-${new Date().getTime()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    }
  };

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
        <h1 className="text-3xl font-bold">Dépenses</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle dépense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <ExpenseForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead className="text-right">Prix HT</TableHead>
              <TableHead className="text-right">TVA</TableHead>
              <TableHead className="text-right">Prix TTC</TableHead>
              <TableHead className="text-center">Facture</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses?.map((expense: any) => (
              <TableRow key={expense.id}>
                <TableCell>
                  {format(new Date(expense.date), "dd MMM yyyy", { locale: fr })}
                </TableCell>
                <TableCell className="font-medium">
                  {expense.description}
                </TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell className="text-right">
                  {Number(expense.priceHT).toFixed(3)} DT
                </TableCell>
                <TableCell className="text-right">
                  {expense.taxRate}%
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {Number(expense.priceTTC).toFixed(3)} DT
                </TableCell>
                <TableCell className="text-center">
                  {expense.invoiceUrl ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownloadInvoice(expense.invoiceUrl)}
                      title="Télécharger la facture"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  ) : (
                    <FileText className="h-4 w-4 text-muted-foreground mx-auto" />
                  )}
                </TableCell>
              </TableRow>
            ))}
            {(!expenses || expenses.length === 0) && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Aucune dépense enregistrée
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
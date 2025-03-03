import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Plus, Edit } from "lucide-react";
import { format } from "date-fns";
import InvoiceForm from "@/components/forms/invoice-form";
import { useState } from "react";
import { Label } from "@/components/ui/label";

export default function Invoices() {
  const [open, setOpen] = useState(false);
  const [stampDuty, setStampDuty] = useState("1");
  const [vat, setVat] = useState("19");
  const { data: invoices, isLoading } = useQuery({
    queryKey: ["/api/invoices"],
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "paid":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Factures</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="stampDuty" className="whitespace-nowrap">Timbre fiscal:</Label>
            <Input
              id="stampDuty"
              type="number"
              value={stampDuty}
              onChange={(e) => setStampDuty(e.target.value)}
              className="w-20"
            />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="vat" className="whitespace-nowrap">TVA (%):</Label>
            <Input
              id="vat"
              type="number"
              value={vat}
              onChange={(e) => setVat(e.target.value)}
              className="w-20"
            />
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle Facture
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <InvoiceForm 
                onSuccess={() => setOpen(false)} 
                stampDuty={Number(stampDuty)}
                vat={Number(vat)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Actions</TableHead>
              <TableHead>Facture #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices?.map((invoice: any) => (
              <TableRow key={invoice.id}>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell className="font-medium">FAC-{invoice.id}</TableCell>
                <TableCell>
                  {format(new Date(invoice.date), "dd/MM/yyyy")}
                </TableCell>
                <TableCell>{invoice.customerId}</TableCell>
                <TableCell>
                  <div
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      getStatusColor(invoice.status)
                    }`}
                  >
                    {invoice.status === "paid" ? "Payée" :
                     invoice.status === "pending" ? "En attente" : "Annulée"}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  ${Number(invoice.total).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
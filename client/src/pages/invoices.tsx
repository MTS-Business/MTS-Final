import { useState } from "react";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Eye, Printer } from "lucide-react";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import InvoiceForm from "@/components/forms/invoice-form";
import InvoicePreview from "@/components/invoice-preview";

// Définition des types
interface Document {
  id: number;
  customerId: number;
  date: string;
  total: number;
}

export default function Invoices() {
  const [open, setOpen] = useState(false);
  const [transformOpen, setTransformOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [stampDuty, setStampDuty] = useState("1");
  const [vat, setVat] = useState("19");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [selectedDocuments, setSelectedDocuments] = useState<{
    quotes: number[];
    creditNotes: number[];
    deliveryNotes: number[];
  }>({
    quotes: [],
    creditNotes: [],
    deliveryNotes: [],
  });

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ["/api/invoices"],
  });

  const { data: customers = [] } = useQuery({
    queryKey: ["/api/customers"],
  });

  const { data: quotes = [] } = useQuery({
    queryKey: ["/api/quotes"],
  });

  const { data: creditNotes = [] } = useQuery({
    queryKey: ["/api/credit-notes"],
  });

  const { data: deliveryNotes = [] } = useQuery({
    queryKey: ["/api/delivery-notes"],
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

  const handlePreview = async (invoice: any) => {
    const customer = customers.find((c: any) => c.id === invoice.customerId);
    const res = await fetch(`/api/invoices/${invoice.id}`);
    const data = await res.json();

    setSelectedInvoice({
      invoice: data,
      customer,
      items: data.items
    });
    setPreviewOpen(true);
  };

  const handleEdit = async (invoice: any) => {
    const res = await fetch(`/api/invoices/${invoice.id}`);
    const data = await res.json();
    const customer = customers.find((c: any) => c.id === invoice.customerId);

    setSelectedInvoice({
      ...data,
      customer,
      items: data.items
    });
    setOpen(true);
  };

  const handlePrint = async (invoice: any) => {
    await handlePreview(invoice);
    setTimeout(() => {
      window.print();
    }, 1000);
  };

  const handleOpenNewInvoice = () => {
    setSelectedInvoice(null);
    setOpen(true);
  };

  const handleTransformSubmit = () => {
    // TODO: Implement transformation logic
    console.log("Transform", {
      customerId: selectedCustomerId,
      selectedDocuments,
    });
    setTransformOpen(false);
  };

  const toggleDocument = (type: keyof typeof selectedDocuments, id: number) => {
    setSelectedDocuments(prev => ({
      ...prev,
      [type]: prev[type].includes(id)
        ? prev[type].filter(x => x !== id)
        : [...prev[type], id]
    }));
  };

  const filteredQuotes = quotes.filter((q: Document) => q.customerId === Number(selectedCustomerId));
  const filteredCreditNotes = creditNotes.filter((cn: Document) => cn.customerId === Number(selectedCustomerId));
  const filteredDeliveryNotes = deliveryNotes.filter((dn: Document) => dn.customerId === Number(selectedCustomerId));

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
          <Dialog open={transformOpen} onOpenChange={setTransformOpen}>
            <Button 
              onClick={() => setTransformOpen(true)} 
              variant="outline"
              className="mr-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <path d="M12 3H3v18h9M21 12l-3-3-3 3M18 9v12" />
              </svg>
              Transformer
            </Button>
            <DialogContent className="fixed top-0 right-0 h-screen max-w-xl rounded-l-lg overflow-auto bg-background">
              <div className="h-full flex flex-col">
                <h2 className="text-2xl font-bold mb-4">Transformer en Facture</h2>
                <div className="mb-4">
                  <Label>Client</Label>
                  <Select
                    value={selectedCustomerId}
                    onValueChange={setSelectedCustomerId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un client" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer: any) => (
                        <SelectItem
                          key={customer.id}
                          value={customer.id.toString()}
                        >
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 overflow-auto">
                  {selectedCustomerId && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12"></TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Numéro</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredQuotes.map((quote: Document) => (
                          <TableRow key={`quote-${quote.id}`}>
                            <TableCell>
                              <Checkbox
                                checked={selectedDocuments.quotes.includes(quote.id)}
                                onCheckedChange={() => toggleDocument('quotes', quote.id)}
                              />
                            </TableCell>
                            <TableCell>Devis</TableCell>
                            <TableCell>DEV-{quote.id}</TableCell>
                            <TableCell>{format(new Date(quote.date), "dd/MM/yyyy")}</TableCell>
                            <TableCell className="text-right">{Number(quote.total).toFixed(2)} €</TableCell>
                          </TableRow>
                        ))}
                        {filteredCreditNotes.map((note: Document) => (
                          <TableRow key={`credit-${note.id}`}>
                            <TableCell>
                              <Checkbox
                                checked={selectedDocuments.creditNotes.includes(note.id)}
                                onCheckedChange={() => toggleDocument('creditNotes', note.id)}
                              />
                            </TableCell>
                            <TableCell>Avoir</TableCell>
                            <TableCell>AV-{note.id}</TableCell>
                            <TableCell>{format(new Date(note.date), "dd/MM/yyyy")}</TableCell>
                            <TableCell className="text-right">{Number(note.total).toFixed(2)} €</TableCell>
                          </TableRow>
                        ))}
                        {filteredDeliveryNotes.map((note: Document) => (
                          <TableRow key={`delivery-${note.id}`}>
                            <TableCell>
                              <Checkbox
                                checked={selectedDocuments.deliveryNotes.includes(note.id)}
                                onCheckedChange={() => toggleDocument('deliveryNotes', note.id)}
                              />
                            </TableCell>
                            <TableCell>Bon de livraison</TableCell>
                            <TableCell>BL-{note.id}</TableCell>
                            <TableCell>{format(new Date(note.date), "dd/MM/yyyy")}</TableCell>
                            <TableCell className="text-right">{Number(note.total).toFixed(2)} €</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setTransformOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleTransformSubmit}>
                    Transformer en facture
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={open} onOpenChange={setOpen}>
            <Button onClick={handleOpenNewInvoice} className="bg-[#0077B6] text-white hover:bg-[#0077B6]/90">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Facture
            </Button>
            <DialogContent className="max-w-4xl">
              <InvoiceForm
                onSuccess={() => setOpen(false)}
                stampDuty={Number(stampDuty)}
                vat={Number(vat)}
                editingInvoice={selectedInvoice}
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
            {invoices.map((invoice: any) => (
              <TableRow key={invoice.id}>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-[#0077B6]" onClick={() => handlePreview(invoice)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-[#0077B6]" onClick={() => handleEdit(invoice)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-[#0077B6]" onClick={() => handlePrint(invoice)}>
                      <Printer className="h-4 w-4" />
                    </Button>
                  </div>
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
                  {Number(invoice.total).toFixed(2)} €
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {selectedInvoice && (
        <InvoicePreview
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          invoice={selectedInvoice.invoice}
          customer={selectedInvoice.customer}
          items={selectedInvoice.items}
          onValidate={() => setPreviewOpen(false)}
          onCancel={() => setPreviewOpen(false)}
        />
      )}
    </div>
  );
}
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface InvoicePreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: any;
  customer: any;
  items: any[];
  onValidate: () => void;
  onCancel: () => void;
}

export default function InvoicePreview({
  open,
  onOpenChange,
  invoice,
  customer,
  items,
  onValidate,
  onCancel
}: InvoicePreviewProps) {
  const subtotal = items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const vatAmount = subtotal * 0.19; // 19% TVA
  const total = subtotal + vatAmount + 1; // +1 pour le timbre fiscal

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="print-content">
          <div className="p-6 space-y-6">
            <div className="bg-black text-white p-4 text-center">
              <h1 className="text-2xl font-bold">FACTURE</h1>
            </div>

            <div className="space-y-4">
              <div>
                <p><strong>Date :</strong> {invoice?.date ? format(new Date(invoice.date), "dd/MM/yyyy") : ''}</p>
                <p><strong>Facture N° :</strong> FAC-{invoice?.id}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">ÉMETTEUR :</h3>
                <p>Votre Entreprise<br />
                contact@entreprise.com<br />
                Adresse de l'entreprise</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">DESTINATAIRE :</h3>
                <p>{customer?.name}<br />
                {customer?.email}<br />
                {customer?.address}</p>
              </div>

              <div className="max-h-[40vh] overflow-y-auto border rounded-lg print:max-h-none print:overflow-visible">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 bg-white print:relative">
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">Description</th>
                      <th className="border p-2 text-left">Prix Unitaire</th>
                      <th className="border p-2 text-left">Quantité</th>
                      <th className="border p-2 text-left">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items?.map((item, index) => (
                      <tr key={index}>
                        <td className="border p-2">{item.name}</td>
                        <td className="border p-2">{Number(item.price).toFixed(2)}€</td>
                        <td className="border p-2">{item.quantity}</td>
                        <td className="border p-2">{(item.price * item.quantity).toFixed(2)}€</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-2">
                <h3 className="text-right">Total HT : {subtotal.toFixed(2)}€</h3>
                <h3 className="text-right">TVA (19%) : {vatAmount.toFixed(2)}€</h3>
                <h3 className="text-right font-bold">Total TTC : {total.toFixed(2)}€</h3>
              </div>

              <div>
                <h3 className="text-lg font-semibold">RÈGLEMENT :</h3>
                <p><strong>Type de paiement :</strong> {invoice?.paymentType}</p>
                {invoice?.paymentType === "virement" && (
                  <>
                    <p><strong>Banque :</strong> Nom de la banque</p>
                    <p><strong>IBAN :</strong> FR76 XXXX XXXX XXXX XXXX</p>
                    <p><strong>BIC :</strong> XXXXXXXX</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 print-hidden mt-4">
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            Imprimer
          </Button>
          <Button onClick={onValidate}>
            Valider
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
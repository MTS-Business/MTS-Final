import { type Invoice, type InvoiceItem, type Customer } from "@shared/schema";

export async function generateInvoicePdf(
  invoice: Invoice,
  items: InvoiceItem[],
  customer: Customer
): Promise<Blob> {
  // For now, return a simple blob with invoice data
  // In a real implementation, this would use a PDF generation library
  const data = {
    invoice,
    items,
    customer,
    generatedAt: new Date().toISOString()
  };
  
  return new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  });
}

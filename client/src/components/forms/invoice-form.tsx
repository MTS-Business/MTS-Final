import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertInvoiceSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import InvoicePreview from "@/components/invoice-preview";

interface InvoiceFormProps {
  onSuccess?: () => void;
  stampDuty: number;
  vat: number;
}

interface SelectedProduct {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface SelectedService {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function InvoiceForm({ onSuccess, stampDuty, vat }: InvoiceFormProps) {
  const { toast } = useToast();
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [temporaryQuantities, setTemporaryQuantities] = useState<Record<number, number>>({});
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  const form = useForm({
    resolver: zodResolver(insertInvoiceSchema),
    defaultValues: {
      customerId: undefined,
      date: new Date().toISOString(),
      total: 0,
      status: "pending",
      paymentType: "espece",
    },
  });

  const { data: customers } = useQuery({
    queryKey: ["/api/customers"],
  });

  const { data: products } = useQuery({
    queryKey: ["/api/products"],
  });

  const { data: services } = useQuery({
    queryKey: ["/api/services"],
  });

  const calculateSubTotal = () => {
    const productsTotal = selectedProducts.reduce((total, product) => {
      return total + (product.price * product.quantity);
    }, 0);
    const servicesTotal = selectedServices.reduce((total, service) => {
      return total + (service.price * service.quantity);
    }, 0);
    return productsTotal + servicesTotal;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubTotal();
    const vatAmount = subtotal * (vat / 100);
    return subtotal + vatAmount + stampDuty;
  };

  useEffect(() => {
    const total = calculateTotal();
    form.setValue("total", total);
  }, [selectedProducts, selectedServices, vat, stampDuty]);

  const handleProductSelection = (productId: number, checked: boolean) => {
    if (checked) {
      setSelectedProductIds([...selectedProductIds, productId]);
      setTemporaryQuantities({ ...temporaryQuantities, [productId]: 1 });
    } else {
      setSelectedProductIds(selectedProductIds.filter(id => id !== productId));
      const newQuantities = { ...temporaryQuantities };
      delete newQuantities[productId];
      setTemporaryQuantities(newQuantities);
    }
  };

  const handleServiceSelection = (serviceId: number, checked: boolean) => {
    if (checked) {
      setSelectedServiceIds([...selectedServiceIds, serviceId]);
      setTemporaryQuantities({ ...temporaryQuantities, [serviceId]: 1 });
    } else {
      setSelectedServiceIds(selectedServiceIds.filter(id => id !== serviceId));
      const newQuantities = { ...temporaryQuantities };
      delete newQuantities[serviceId];
      setTemporaryQuantities(newQuantities);
    }
  };

  const handleQuantityChange = (itemId: number, quantity: number) => {
    setTemporaryQuantities({
      ...temporaryQuantities,
      [itemId]: quantity
    });
  };

  const handleProductDialogConfirm = () => {
    const newSelectedProducts = selectedProductIds
      .map(id => {
        const product = products?.find((p: any) => p.id === id);
        if (!product) return null;
        return {
          id: product.id,
          name: product.name,
          price: Number(product.price),
          quantity: temporaryQuantities[product.id] || 1
        };
      })
      .filter((p): p is SelectedProduct => p !== null);

    setSelectedProducts([...selectedProducts, ...newSelectedProducts]);
    setIsProductDialogOpen(false);
    setSelectedProductIds([]);
    setTemporaryQuantities({});
  };

  const handleServiceDialogConfirm = () => {
    const newSelectedServices = selectedServiceIds
      .map(id => {
        const service = services?.find((s: any) => s.id === id);
        if (!service) return null;
        return {
          id: service.id,
          name: service.name,
          price: Number(service.price),
          quantity: temporaryQuantities[service.id] || 1
        };
      })
      .filter((s): s is SelectedService => s !== null);

    setSelectedServices([...selectedServices, ...newSelectedServices]);
    setIsServiceDialogOpen(false);
    setSelectedServiceIds([]);
    setTemporaryQuantities({});
  };

  const removeProduct = (productId: number) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const removeService = (serviceId: number) => {
    setSelectedServices(selectedServices.filter(s => s.id !== serviceId));
  };

  const createInvoice = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.text();
        console.error('Failed to create invoice:', error);
        throw new Error("Failed to create invoice");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      toast({
        title: "Facture créée",
        description: "La facture a été créée avec succès",
      });
      onSuccess?.();
      form.reset();
      setSelectedProducts([]);
      setSelectedServices([]);
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la facture",
        variant: "destructive"
      });
    }
  });

  const onSubmit = async (data: any) => {
    if (selectedProducts.length === 0 && selectedServices.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner au moins un produit ou un service",
        variant: "destructive"
      });
      return;
    }

    const customer = customers?.find((c: any) => c.id === Number(data.customerId));

    setPreviewData({
      invoice: {
        ...data,
        total: calculateTotal(),
      },
      customer,
      items: [
        ...selectedProducts,
        ...selectedServices
      ],
    });
    setShowPreview(true);
  };

  const handleValidateInvoice = () => {
    if (!previewData) return;

    const formData = form.getValues();

    const invoiceData = {
      invoice: {
        customerId: Number(formData.customerId),
        date: formData.date,
        status: formData.status,
        paymentType: formData.paymentType,
        total: calculateTotal(),
      },
      items: [
        ...selectedProducts.map(product => ({
          productId: product.id,
          quantity: product.quantity,
          price: product.price,
          serviceId: null,
          name: product.name,
        })),
        ...selectedServices.map(service => ({
          serviceId: service.id,
          quantity: service.quantity,
          price: service.price,
          productId: null,
          name: service.name,
        }))
      ]
    };

    console.log('Creating invoice with data:', invoiceData);
    createInvoice.mutate(invoiceData);
  };

  return (
    <div className="space-y-4 max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Nouvelle Facture</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="customerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un client" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {customers?.map((customer: any) => (
                      <SelectItem
                        key={customer.id}
                        value={customer.id.toString()}
                      >
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormLabel>Produits</FormLabel>
            <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
              <DialogTrigger asChild>
                <Button type="button" className="w-full">
                  Sélectionner des produits
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Sélectionner les produits</DialogTitle>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12"></TableHead>
                        <TableHead>Nom</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Prix</TableHead>
                        <TableHead className="text-right">Stock</TableHead>
                        <TableHead className="text-right w-32">Quantité</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products?.map((product: any) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedProductIds.includes(product.id)}
                              onCheckedChange={(checked) =>
                                handleProductSelection(product.id, checked as boolean)
                              }
                              disabled={selectedProducts.some(p => p.id === product.id)}
                            />
                          </TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.description}</TableCell>
                          <TableCell className="text-right">
                            {Number(product.price).toFixed(2)} €
                          </TableCell>
                          <TableCell className="text-right">
                            {product.quantity}
                          </TableCell>
                          <TableCell>
                            {selectedProductIds.includes(product.id) && (
                              <Input
                                type="number"
                                min="1"
                                max={product.quantity}
                                value={temporaryQuantities[product.id] || 1}
                                onChange={(e) => handleQuantityChange(product.id, Number(e.target.value))}
                                className="w-24"
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsProductDialogOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="button"
                    onClick={handleProductDialogConfirm}
                    disabled={selectedProductIds.length === 0}
                  >
                    Valider
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-2">
            <FormLabel>Services</FormLabel>
            <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
              <DialogTrigger asChild>
                <Button type="button" className="w-full">
                  Sélectionner des services
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Sélectionner les services</DialogTitle>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12"></TableHead>
                        <TableHead>Nom</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Prix</TableHead>
                        <TableHead className="text-right w-32">Quantité</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {services?.map((service: any) => (
                        <TableRow key={service.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedServiceIds.includes(service.id)}
                              onCheckedChange={(checked) =>
                                handleServiceSelection(service.id, checked as boolean)
                              }
                              disabled={selectedServices.some(s => s.id === service.id)}
                            />
                          </TableCell>
                          <TableCell>{service.name}</TableCell>
                          <TableCell>{service.description}</TableCell>
                          <TableCell className="text-right">
                            {Number(service.price).toFixed(2)} €
                          </TableCell>
                          <TableCell>
                            {selectedServiceIds.includes(service.id) && (
                              <Input
                                type="number"
                                min="1"
                                value={temporaryQuantities[service.id] || 1}
                                onChange={(e) => handleQuantityChange(service.id, Number(e.target.value))}
                                className="w-24"
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsServiceDialogOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="button"
                    onClick={handleServiceDialogConfirm}
                    disabled={selectedServiceIds.length === 0}
                  >
                    Valider
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-2 max-h-[30vh] overflow-y-auto border rounded-lg p-4">
            {selectedProducts.length > 0 && (
              <>
                <div className="font-medium mb-2">Produits sélectionnés:</div>
                {selectedProducts.map(product => (
                  <div key={product.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex-1">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {product.quantity} x {Number(product.price).toFixed(2)} €
                      </div>
                    </div>
                    <div className="text-right font-medium">
                      {(product.price * product.quantity).toFixed(2)} €
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeProduct(product.id)}
                      className="ml-2"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </>
            )}

            {selectedServices.length > 0 && (
              <>
                <div className="font-medium mb-2">Services sélectionnés:</div>
                {selectedServices.map(service => (
                  <div key={service.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex-1">
                      <div className="font-medium">{service.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {service.quantity} x {Number(service.price).toFixed(2)} €
                      </div>
                    </div>
                    <div className="text-right font-medium">
                      {(service.price * service.quantity).toFixed(2)} €
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeService(service.id)}
                      className="ml-2"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between text-sm">
              <span>Sous-total:</span>
              <span>{calculateSubTotal().toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>TVA ({vat}%):</span>
              <span>{(calculateSubTotal() * (vat / 100)).toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Timbre fiscal:</span>
              <span>{stampDuty.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>{calculateTotal().toFixed(2)} €</span>
            </div>
          </div>

          <FormField
            control={form.control}
            name="paymentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de paiement</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type de paiement" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="virement">Virement</SelectItem>
                    <SelectItem value="espece">Espèce</SelectItem>
                    <SelectItem value="cheque">Chèque</SelectItem>
                    <SelectItem value="traite">Traite</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Statut</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le statut" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="paid">Payée</SelectItem>
                    <SelectItem value="cancelled">Annulée</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Créer la facture
          </Button>
        </form>
      </Form>

      {previewData && (
        <InvoicePreview
          open={showPreview}
          onOpenChange={setShowPreview}
          invoice={previewData.invoice}
          customer={previewData.customer}
          items={previewData.items}
          onValidate={handleValidateInvoice}
          onCancel={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
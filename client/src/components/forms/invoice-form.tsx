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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";

interface InvoiceFormProps {
  onSuccess?: () => void;
}

interface SelectedProduct {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function InvoiceForm({ onSuccess }: InvoiceFormProps) {
  const { toast } = useToast();
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);

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

  const calculateTotal = () => {
    return selectedProducts.reduce((total, product) => {
      return total + (product.price * product.quantity);
    }, 0);
  };

  useEffect(() => {
    const total = calculateTotal();
    form.setValue("total", total);
  }, [selectedProducts]);

  const addProduct = (productId: string) => {
    const product = products?.find((p: any) => p.id.toString() === productId);
    if (product && !selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        quantity: 1
      }]);
    }
  };

  const updateProductQuantity = (productId: number, quantity: number) => {
    setSelectedProducts(selectedProducts.map(product => {
      if (product.id === productId) {
        return { ...product, quantity };
      }
      return product;
    }));
  };

  const removeProduct = (productId: number) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const createInvoice = useMutation({
    mutationFn: async (data: any) => {
      const invoiceData = {
        invoice: {
          ...data,
          total: calculateTotal(),
        },
        items: selectedProducts.map(product => ({
          productId: product.id,
          quantity: product.quantity,
          price: product.price
        }))
      };

      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoiceData),
      });
      if (!res.ok) throw new Error("Failed to create invoice");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      toast({
        title: "Facture créée",
        description: "La facture a été créée avec succès",
      });
      onSuccess?.();
    },
  });

  const onSubmit = (data: any) => {
    if (selectedProducts.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner au moins un produit",
        variant: "destructive"
      });
      return;
    }
    createInvoice.mutate(data);
  };

  return (
    <div className="space-y-4">
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
                  value={field.value?.toString()}
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
            <Select onValueChange={addProduct}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Ajouter un produit" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {products?.map((product: any) => (
                  <SelectItem
                    key={product.id}
                    value={product.id.toString()}
                    disabled={selectedProducts.some(p => p.id === product.id)}
                  >
                    {product.name} - {Number(product.price).toFixed(2)} €
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="space-y-2">
              {selectedProducts.map(product => (
                <div key={product.id} className="flex items-center gap-2 p-2 border rounded">
                  <div className="flex-1">{product.name}</div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="1"
                      className="w-20"
                      value={product.quantity}
                      onChange={(e) => updateProductQuantity(product.id, Number(e.target.value))}
                    />
                    <div className="w-24 text-right">
                      {(product.price * product.quantity).toFixed(2)} €
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeProduct(product.id)}
                    >
                      ×
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-right font-bold">
            Total: {calculateTotal().toFixed(2)} €
          </div>

          <FormField
            control={form.control}
            name="paymentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de paiement</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
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
                  value={field.value}
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
    </div>
  );
}
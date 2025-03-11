import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertInvoiceSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DeliveryNoteFormProps {
  onSuccess?: () => void;
}

export default function DeliveryNoteForm({ onSuccess }: DeliveryNoteFormProps) {
  const { toast } = useToast();
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [temporaryQuantities, setTemporaryQuantities] = useState<Record<number, number>>({});
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [shippingNotes, setShippingNotes] = useState("");

  const form = useForm({
    resolver: zodResolver(insertInvoiceSchema),
    defaultValues: {
      customerId: undefined,
      date: new Date().toISOString(),
      status: "pending",
      address: "",
    },
  });

  const { data: customers } = useQuery({
    queryKey: ["/api/customers"],
  });

  const { data: products } = useQuery({
    queryKey: ["/api/products"],
  });

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
          quantity: temporaryQuantities[product.id] || 1
        };
      })
      .filter((p): p is any => p !== null);

    setSelectedProducts([...selectedProducts, ...newSelectedProducts]);
    setIsProductDialogOpen(false);
    setSelectedProductIds([]);
    setTemporaryQuantities({});
  };

  const removeProduct = (productId: number) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const createDeliveryNote = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/delivery-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create delivery note");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/delivery-notes"] });
      toast({
        title: "Bon de livraison créé",
        description: "Le bon de livraison a été créé avec succès",
      });
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du bon de livraison",
        variant: "destructive",
      });
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

    const deliveryNoteData = {
      deliveryNote: {
        customerId: Number(data.customerId),
        date: data.date,
        status: data.status,
        address: data.address,
        shippingNotes,
      },
      items: selectedProducts.map(product => ({
        productId: product.id,
        quantity: product.quantity,
        name: product.name,
      }))
    };

    createDeliveryNote.mutate(deliveryNoteData);
  };

  return (
    <div className="space-y-4 max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Nouveau Bon de Livraison</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
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

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse de livraison</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <Button
              type="button"
              onClick={() => setIsProductDialogOpen(true)}
              className="w-full"
            >
              Sélectionner des produits
            </Button>
          </div>

          <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
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

          <div className="space-y-2 max-h-[30vh] overflow-y-auto border rounded-lg p-4">
            {selectedProducts.length > 0 && (
              <>
                <div className="font-medium mb-2">Produits sélectionnés:</div>
                {selectedProducts.map(product => (
                  <div key={product.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex-1">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Quantité: {product.quantity}
                      </div>
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
          </div>

          <div>
            <FormLabel>Notes de livraison</FormLabel>
            <Textarea
              value={shippingNotes}
              onChange={(e) => setShippingNotes(e.target.value)}
              placeholder="Instructions spéciales pour la livraison..."
              className="mt-2"
            />
            <FormDescription>
              Optionnel - Ajoutez des instructions spéciales pour la livraison
            </FormDescription>
          </div>

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
                    <SelectItem value="delivered">Livré</SelectItem>
                    <SelectItem value="cancelled">Annulé</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Créer le bon de livraison
          </Button>
        </form>
      </Form>
    </div>
  );
}
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expenseSchema, type Expense } from "@/shared/schema";
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
import { Label } from "@/components/ui/label";

interface ExpenseFormProps {
  onSuccess?: () => void;
}

const expenseCategories = [
  "Fournitures",
  "Équipement",
  "Loyer",
  "Services",
  "Salaires",
  "Marketing",
  "Autre",
];

export default function ExpenseForm({ onSuccess }: ExpenseFormProps) {
  const { toast } = useToast();
  const form = useForm<Expense>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      description: "",
      category: "Autre",
      priceHT: 0,
      taxRate: 19,
      priceTTC: 0,
      date: new Date(),
    },
  });

  const calculatePrices = (priceHT: number, taxRate: number) => {
    const priceTTC = priceHT * (1 + taxRate / 100);
    form.setValue("priceTTC", Number(priceTTC.toFixed(3)));
  };

  const createExpense = useMutation({
    mutationFn: async (values: Expense) => {
      const formData = new FormData();

      // Ajouter tous les champs sauf invoiceFile
      Object.entries(values).forEach(([key, value]) => {
        if (key !== 'invoiceFile') {
          formData.append(key, key === 'date' ? value.toISOString() : String(value));
        }
      });

      // Ajouter le fichier s'il existe
      const invoiceFile = form.getValues('invoiceFile');
      if (invoiceFile?.[0]) {
        formData.append('invoiceFile', invoiceFile[0]);
      }

      const response = await fetch("/api/expenses", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout de la dépense");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/expenses"] });
      toast({
        title: "Dépense créée",
        description: "La dépense a été ajoutée avec succès",
      });
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>Ajouter une nouvelle dépense</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => createExpense.mutate(data))} className="space-y-4">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="priceHT"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix HT</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.001"
                      {...field}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        field.onChange(value);
                        calculatePrices(value, form.getValues("taxRate"));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="taxRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Taux TVA (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="1"
                      {...field}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        field.onChange(value);
                        calculatePrices(form.getValues("priceHT"), value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="priceTTC"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix TTC</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.001"
                    {...field}
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Catégorie</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
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
                  <Input 
                    type="date"
                    value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      field.onChange(new Date(e.target.value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <Label htmlFor="invoiceFile">Facture (Optionnel)</Label>
            <Input
              id="invoiceFile"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                form.setValue("invoiceFile", e.target.files);
              }}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-[#0077B6] text-white hover:bg-[#0077B6]/90"
            disabled={createExpense.isPending}
          >
            {createExpense.isPending ? "Ajout en cours..." : "Ajouter la dépense"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
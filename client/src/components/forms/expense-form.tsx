import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertExpenseSchema } from "@shared/schema";
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
  const form = useForm({
    resolver: zodResolver(insertExpenseSchema),
    defaultValues: {
      description: "",
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      category: "Autre",
      invoiceFile: undefined,
      taxRate: 19, // TVA par défaut en Tunisie
      priceHT: 0,
      priceTTC: 0
    },
  });

  const createExpense = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await fetch("/api/expenses", {
        method: "POST",
        body: data,
      });
      if (!res.ok) throw new Error("Failed to create expense");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/expenses"] });
      toast({
        title: "Dépense créée",
        description: "La dépense a été ajoutée avec succès",
      });
      onSuccess?.();
    },
  });

  const calculatePrices = (priceHT: number, taxRate: number) => {
    const priceTTC = priceHT * (1 + taxRate / 100);
    form.setValue("priceTTC", Number(priceTTC.toFixed(3)));
  };

  const onSubmit = (data: any) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'invoiceFile' && data[key]?.length > 0) {
        formData.append('invoiceFile', data[key][0]);
      } else {
        formData.append(key, data[key]);
      }
    });
    createExpense.mutate(formData);
  };

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>Ajouter une nouvelle dépense</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        field.onChange(Number(e.target.value));
                        calculatePrices(Number(e.target.value), form.getValues("taxRate"));
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
                        field.onChange(Number(e.target.value));
                        calculatePrices(form.getValues("priceHT"), Number(e.target.value));
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
                  <Input type="date" {...field} />
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
            className="w-full"
            disabled={createExpense.isPending}
          >
            {createExpense.isPending ? "Ajout en cours..." : "Ajouter la dépense"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
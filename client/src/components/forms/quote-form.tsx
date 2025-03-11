import { useMutation } from "@tanstack/react-query";
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface QuoteFormProps {
  onSuccess?: () => void;
  vat: number;
}

export default function QuoteForm({ onSuccess, vat: defaultVat }: QuoteFormProps) {
  const { toast } = useToast();
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [temporaryQuantities, setTemporaryQuantities] = useState<Record<number, number>>({});
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);
  const [useVat, setUseVat] = useState(true);
  const [customVat, setCustomVat] = useState(defaultVat);
  const [discount, setDiscount] = useState(0);
  const [validityDays, setValidityDays] = useState(30); // Spécifique aux devis

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

  // ... Reste du code similaire à InvoiceForm ...

  return (
    <div className="space-y-4 max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Nouveau Devis</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form className="space-y-4">
          {/* Même structure de formulaire que InvoiceForm avec l'ajout du champ validité */}
          <FormField
            control={form.control}
            name="validityDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Validité (jours)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    value={validityDays}
                    onChange={(e) => setValidityDays(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}

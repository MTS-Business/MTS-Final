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

interface DeliveryNoteFormProps {
  onSuccess?: () => void;
}

export default function DeliveryNoteForm({ onSuccess }: DeliveryNoteFormProps) {
  const { toast } = useToast();
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [temporaryQuantities, setTemporaryQuantities] = useState<Record<number, number>>({});
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);

  const form = useForm({
    resolver: zodResolver(insertInvoiceSchema),
    defaultValues: {
      customerId: undefined,
      date: new Date().toISOString(),
      status: "pending",
    },
  });

  // ... Reste du code similaire à InvoiceForm mais sans les services et calculs de prix ...

  return (
    <div className="space-y-4 max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Nouveau Bon de Livraison</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form className="space-y-4">
          {/* Même structure de formulaire que InvoiceForm mais sans les champs de prix */}
        </form>
      </Form>
    </div>
  );
}

import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCustomerSchema } from "@shared/schema";
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
import { useToast } from "@/hooks/use-toast";
import {
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CustomerFormProps {
  onSuccess?: () => void;
}

const customerCategories = [
  { value: "entreprise", label: "Entreprise" },
  { value: "installateur", label: "Installateur" },
  { value: "particulier", label: "Particulier" },
  { value: "association", label: "Association" },
  { value: "industrie", label: "Industrie" },
  { value: "agricole", label: "Agricole" },
  { value: "etatique", label: "Étatique" },
];

export default function CustomerForm({ onSuccess }: CustomerFormProps) {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(insertCustomerSchema),
    defaultValues: {
      reference: "",
      name: "",
      email: "",
      phone: "",
      address: "",
      fiscalNumber: "",
      category: "",
      documents: null,
    },
  });

  const createCustomer = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await fetch("/api/customers", {
        method: "POST",
        body: data,
      });
      if (!res.ok) throw new Error("Failed to create customer");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      toast({
        title: "Client créé",
        description: "Le client a été ajouté avec succès",
      });
      onSuccess?.();
    },
  });

  const onSubmit = (data: any) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'documents' && data[key]) {
        Array.from(data[key]).forEach((file: File) => {
          formData.append('documents', file);
        });
      } else {
        formData.append(key, data[key]);
      }
    });

    createCustomer.mutate(formData);
  };

  return (
    <div className="space-y-4 max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Ajouter un nouveau client</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Référence</FormLabel>
                  <FormControl>
                    <Input {...field} disabled placeholder="Généré automatiquement" />
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {customerCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fiscalNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Matricule Fiscale</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Ce champ est optionnel
                  </FormDescription>
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
                <FormLabel>Adresse</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="documents"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>Documents (RNE ou Patent)</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => onChange(e.target.files)}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Ce champ est optionnel. Vous pouvez télécharger plusieurs fichiers si nécessaire.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Ajouter le client
          </Button>
        </form>
      </Form>
    </div>
  );
}
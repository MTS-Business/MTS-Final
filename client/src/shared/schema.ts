import { z } from "zod";

export const expenseSchema = z.object({
  description: z.string().min(1, "La description est requise"),
  category: z.string(),
  priceHT: z.number().min(0, "Le prix HT doit être positif"),
  taxRate: z.number().min(0, "Le taux de TVA doit être positif"),
  priceTTC: z.number().min(0, "Le prix TTC doit être positif"),
  date: z.date(),
});

export type Expense = z.infer<typeof expenseSchema>;

export const personnelSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  prenom: z.string().min(1, "Le prénom est requis"),
  cin: z.string().min(8, "Le CIN doit contenir au moins 8 caractères"),
  fonction: z.string().min(1, "La fonction est requise"),
  salaireBrut: z.number().min(0, "Le salaire brut doit être positif"),
  prime: z.number().min(0, "La prime doit être positive"),
  dateEmbauche: z.date(),
  competences: z.array(z.string()).optional(),
  projetsAssignes: z.array(z.number()).optional(),
});

export type Personnel = z.infer<typeof personnelSchema>;
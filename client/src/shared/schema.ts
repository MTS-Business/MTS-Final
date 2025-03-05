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
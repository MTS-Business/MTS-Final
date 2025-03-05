import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";

export const expenseSchema = z.object({
  description: z.string().min(1, "La description est requise"),
  category: z.string(),
  priceHT: z.number().min(0, "Le prix HT doit être positif"),
  taxRate: z.number().min(0, "Le taux de TVA doit être positif"),
  priceTTC: z.number().min(0, "Le prix TTC doit être positif"),
  date: z.date(),
  invoiceFile: z.any().optional(),
});

export type Expense = z.infer<typeof expenseSchema>;

export const insertExpenseSchema = expenseSchema.omit({ 
  id: true,
  createdAt: true,
  updatedAt: true 
});
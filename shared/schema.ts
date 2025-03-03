import { pgTable, text, serial, integer, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  fiscalNumber: text("fiscal_number"),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: numeric("price").notNull(),
  quantity: integer("quantity").notNull(),
});

export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull(),
  date: timestamp("date").notNull(),
  total: numeric("total").notNull(),
  status: text("status").notNull(), // paid, pending, cancelled
  paymentType: text("payment_type").notNull(), // virement, espece, cheque, traite
});

export const invoiceItems = pgTable("invoice_items", {
  id: serial("id").primaryKey(),
  invoiceId: integer("invoice_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: numeric("price").notNull(),
});

export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  description: text("description").notNull(),
  amount: numeric("amount").notNull(),
  date: timestamp("date").notNull(),
  category: text("category").notNull(),
});

// Schémas de validation modifiés pour gérer les types numériques
export const insertCustomerSchema = createInsertSchema(customers, {
  fiscalNumber: z.string().optional(),
});

export const insertProductSchema = createInsertSchema(products, {
  price: z.number(),
  quantity: z.number(),
});

export const insertInvoiceSchema = createInsertSchema(invoices, {
  total: z.number(),
  paymentType: z.enum(["virement", "espece", "cheque", "traite"]),
});

export const insertInvoiceItemSchema = createInsertSchema(invoiceItems);
export const insertExpenseSchema = createInsertSchema(expenses, {
  amount: z.number(),
});

export type Customer = typeof customers.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Invoice = typeof invoices.$inferSelect;
export type InvoiceItem = typeof invoiceItems.$inferSelect;
export type Expense = typeof expenses.$inferSelect;

export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type InsertInvoiceItem = z.infer<typeof insertInvoiceItemSchema>;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;
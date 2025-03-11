import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertCustomerSchema, insertProductSchema, insertServiceSchema, insertInvoiceSchema, insertInvoiceItemSchema, insertExpenseSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

const upload = multer({
  dest: 'uploads/',
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé'));
    }
  }
});

function generateCustomerReference() {
  const prefix = "CLI";
  const timestamp = new Date().getTime().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
}

export async function registerRoutes(app: Express) {
  if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
  }

  // Customers
  app.get("/api/customers", async (_req, res) => {
    const customers = await storage.getCustomers();
    res.json(customers);
  });

  app.post("/api/customers", upload.array('documents'), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      const documentPaths = files ? files.map(file => file.path) : [];

      const customerData = {
        ...req.body,
        reference: generateCustomerReference(),
        documents: documentPaths
      };

      const validatedData = insertCustomerSchema.parse(customerData);
      const customer = await storage.createCustomer(validatedData);
      res.json(customer);
    } catch (error) {
      console.error('Error creating customer:', error);
      res.status(400).json({ error: String(error) });
    }
  });

  // Products
  app.get("/api/products", async (_req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.post("/api/products", async (req, res) => {
    const data = insertProductSchema.parse(req.body);
    const product = await storage.createProduct(data);
    res.json(product);
  });

  // Services
  app.get("/api/services", async (_req, res) => {
    const services = await storage.getServices();
    res.json(services);
  });

  app.post("/api/services", async (req, res) => {
    const data = insertServiceSchema.parse(req.body);
    const service = await storage.createService(data);
    res.json(service);
  });

  // Invoices
  app.get("/api/invoices", async (_req, res) => {
    const invoices = await storage.getInvoices();
    res.json(invoices);
  });

  app.get("/api/invoices/:id", async (req, res) => {
    const invoice = await storage.getInvoice(Number(req.params.id));
    if (!invoice) {
      res.status(404).json({ message: "Invoice not found" });
      return;
    }
    const items = await storage.getInvoiceItems(invoice.id);
    res.json({ ...invoice, items });
  });

  app.post("/api/invoices", async (req, res) => {
    try {
      const { invoice, items } = req.body;

      if (!invoice || !items || !Array.isArray(items)) {
        res.status(400).json({ error: "Invalid invoice data format" });
        return;
      }

      const validatedInvoice = insertInvoiceSchema.parse({
        ...invoice,
        customerId: Number(invoice.customerId),
        total: Number(invoice.total),
      });

      const validatedItems = items.map((item: any) =>
        insertInvoiceItemSchema.parse({
          ...item,
          price: Number(item.price),
          quantity: Number(item.quantity),
          productId: item.productId ? Number(item.productId) : null,
          serviceId: item.serviceId ? Number(item.serviceId) : null,
        })
      );

      const newInvoice = await storage.createInvoice(validatedInvoice, validatedItems);
      res.json(newInvoice);
    } catch (error) {
      console.error('Error creating invoice:', error);
      res.status(400).json({ error: String(error) });
    }
  });

  // Expenses
  app.get("/api/expenses", async (_req, res) => {
    const expenses = await storage.getExpenses();
    res.json(expenses);
  });

  app.post("/api/expenses", async (req, res) => {
    const data = insertExpenseSchema.parse(req.body);
    const expense = await storage.createExpense(data);
    res.json(expense);
  });

  const httpServer = createServer(app);
  return httpServer;
}
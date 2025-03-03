import {
  type Customer, type InsertCustomer,
  type Product, type InsertProduct,
  type Invoice, type InsertInvoice,
  type InvoiceItem, type InsertInvoiceItem,
  type Expense, type InsertExpense
} from "@shared/schema";

export interface IStorage {
  // Customers
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: number): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProductQuantity(id: number, quantity: number): Promise<Product>;
  
  // Invoices
  getInvoices(): Promise<Invoice[]>;
  getInvoice(id: number): Promise<Invoice | undefined>;
  createInvoice(invoice: InsertInvoice, items: InsertInvoiceItem[]): Promise<Invoice>;
  
  // Invoice Items
  getInvoiceItems(invoiceId: number): Promise<InvoiceItem[]>;
  
  // Expenses
  getExpenses(): Promise<Expense[]>;
  createExpense(expense: InsertExpense): Promise<Expense>;
}

export class MemStorage implements IStorage {
  private customers: Map<number, Customer>;
  private products: Map<number, Product>;
  private invoices: Map<number, Invoice>;
  private invoiceItems: Map<number, InvoiceItem>;
  private expenses: Map<number, Expense>;
  private currentIds: {[key: string]: number};

  constructor() {
    this.customers = new Map();
    this.products = new Map();
    this.invoices = new Map();
    this.invoiceItems = new Map();
    this.expenses = new Map();
    this.currentIds = {
      customer: 1,
      product: 1,
      invoice: 1,
      invoiceItem: 1,
      expense: 1
    };
  }

  async getCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values());
  }

  async getCustomer(id: number): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = this.currentIds.customer++;
    const customer = { ...insertCustomer, id };
    this.customers.set(id, customer);
    return customer;
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentIds.product++;
    const product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  async updateProductQuantity(id: number, quantity: number): Promise<Product> {
    const product = await this.getProduct(id);
    if (!product) throw new Error("Product not found");
    const updated = { ...product, quantity };
    this.products.set(id, updated);
    return updated;
  }

  async getInvoices(): Promise<Invoice[]> {
    return Array.from(this.invoices.values());
  }

  async getInvoice(id: number): Promise<Invoice | undefined> {
    return this.invoices.get(id);
  }

  async createInvoice(insertInvoice: InsertInvoice, items: InsertInvoiceItem[]): Promise<Invoice> {
    const id = this.currentIds.invoice++;
    const invoice = { ...insertInvoice, id };
    this.invoices.set(id, invoice);

    // Create invoice items
    for (const item of items) {
      const itemId = this.currentIds.invoiceItem++;
      const invoiceItem = { ...item, id: itemId, invoiceId: id };
      this.invoiceItems.set(itemId, invoiceItem);

      // Update product quantity
      const product = await this.getProduct(item.productId);
      if (product) {
        await this.updateProductQuantity(product.id, product.quantity - item.quantity);
      }
    }

    return invoice;
  }

  async getInvoiceItems(invoiceId: number): Promise<InvoiceItem[]> {
    return Array.from(this.invoiceItems.values()).filter(item => item.invoiceId === invoiceId);
  }

  async getExpenses(): Promise<Expense[]> {
    return Array.from(this.expenses.values());
  }

  async createExpense(insertExpense: InsertExpense): Promise<Expense> {
    const id = this.currentIds.expense++;
    const expense = { ...insertExpense, id };
    this.expenses.set(id, expense);
    return expense;
  }
}

export const storage = new MemStorage();

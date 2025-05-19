import {
  type Customer, type InsertCustomer,
  type Product, type InsertProduct,
  type Service, type InsertService,
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

  // Services
  getServices(): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;

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
  private services: Map<number, Service>;
  private invoices: Map<number, Invoice>;
  private invoiceItems: Map<number, InvoiceItem>;
  private expenses: Map<number, Expense>;
  private currentIds: {[key: string]: number};

  constructor() {
    this.customers = new Map();
    this.products = new Map();
    this.services = new Map();
    this.invoices = new Map();
    this.invoiceItems = new Map();
    this.expenses = new Map();
    this.currentIds = {
      customer: 4, // Start after initial data
      product: 4,
      service: 4,
      invoice: 1,
      invoiceItem: 1,
      expense: 1
    };

    // Add initial customers
    this.customers.set(1, {
      id: 1,
      name: "Société ABC",
      category: "entreprise",
      email: "contact@abc.com",
      phone: "0123456789",
      address: "123 Rue Principale, 75001 Paris",
      fiscalNumber: "FR123456789",
      documents: []
    });
    this.customers.set(2, {
      id: 2,
      name: "Enterprise XYZ",
      category: "entreprise",
      email: "info@xyz.com",
      phone: "0987654321",
      address: "456 Avenue des Affaires, 69001 Lyon",
      fiscalNumber: "FR987654321",
      documents: []
    });
    this.customers.set(3, {
      id: 3,
      name: "Compagnie 123",
      category: "entreprise",
      email: "contact@123.com",
      phone: "0567891234",
      address: "789 Boulevard du Commerce, 31000 Toulouse",
      fiscalNumber: "FR567891234",
      documents: []
    });

    // Add initial products
    this.products.set(1, {
      id: 1,
      name: "Ordinateur portable Pro",
      description: "Ordinateur portable haute performance pour professionnels",
      price: "1299.99",
      quantity: 10
    });
    this.products.set(2, {
      id: 2,
      name: "Écran 27 pouces 4K",
      description: "Écran professionnel haute résolution",
      price: "499.99",
      quantity: 15
    });
    this.products.set(3, {
      id: 3,
      name: "Clavier mécanique",
      description: "Clavier mécanique rétroéclairé",
      price: "129.99",
      quantity: 20
    });

    // Add initial services
    this.services.set(1, {
      id: 1,
      name: "Installation Windows",
      description: "Installation et configuration complète de Windows",
      price: "99.99"
    });
    this.services.set(2, {
      id: 2,
      name: "Formation bureautique",
      description: "Formation sur les outils de bureautique (4h)",
      price: "299.99"
    });
    this.services.set(3, {
      id: 3,
      name: "Maintenance annuelle",
      description: "Contrat de maintenance informatique annuel",
      price: "599.99"
    });

    // Add initial invoice
    const initialInvoice: Invoice = {
      id: 1,
      customerId: 1,
      date: new Date().toISOString(),
      total: "2099.97",
      status: "pending",
      paymentType: "virement"
    };
    this.invoices.set(1, initialInvoice);

    // Add initial invoice items
    this.invoiceItems.set(1, {
      id: 1,
      invoiceId: 1,
      productId: 1,
      serviceId: null,
      quantity: 1,
      price: "1299.99"
    });
    this.invoiceItems.set(2, {
      id: 2,
      invoiceId: 1,
      productId: null,
      serviceId: 1,
      quantity: 1,
      price: "99.99"
    });

    // Update current IDs
    this.currentIds.invoice = 2;
    this.currentIds.invoiceItem = 3;
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
    const product = { ...insertProduct, id, price: String(insertProduct.price) };
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

  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }

  async getService(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async createService(insertService: InsertService): Promise<Service> {
    const id = this.currentIds.service++;
    const service = { ...insertService, id, price: String(insertService.price) };
    this.services.set(id, service);
    return service;
  }

  async getInvoices(): Promise<Invoice[]> {
    return Array.from(this.invoices.values());
  }

  async getInvoice(id: number): Promise<Invoice | undefined> {
    return this.invoices.get(id);
  }

  async createInvoice(insertInvoice: InsertInvoice, items: InsertInvoiceItem[]): Promise<Invoice> {
    const id = this.currentIds.invoice++;
    const invoice = { ...insertInvoice, id, total: String(insertInvoice.total) };
    this.invoices.set(id, invoice);

    // Create invoice items
    for (const item of items) {
      const itemId = this.currentIds.invoiceItem++;
      const invoiceItem = { 
        ...item, 
        id: itemId, 
        invoiceId: id,
        price: String(item.price)
      };
      this.invoiceItems.set(itemId, invoiceItem);

      // Update product quantity if it's a product
      if (item.productId) {
        const product = await this.getProduct(item.productId);
        if (product) {
          await this.updateProductQuantity(product.id, product.quantity - item.quantity);
        }
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
    const expense = { ...insertExpense, id, amount: String(insertExpense.amount) };
    this.expenses.set(id, expense);
    return expense;
  }
}

export const storage = new MemStorage();
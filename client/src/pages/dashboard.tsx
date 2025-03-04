import { useQuery } from "@tanstack/react-query";
import { DashboardCard } from "@/components/layout/dashboard-card";
import { Card } from "@/components/ui/card";
import { Package, Users, Receipt, DollarSign, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const data = [
  { name: "Jan", income: 4000, expense: 2400 },
  { name: "Fév", income: 3000, expense: 1398 },
  { name: "Mar", income: 2000, expense: 9800 },
  { name: "Avr", income: 2780, expense: 3908 },
  { name: "Mai", income: 1890, expense: 4800 },
  { name: "Jun", income: 2390, expense: 3800 },
];

const recentTransactions = [
  { name: "Ordinateur portable Pro", amount: 1299.99, date: "2024-03-04", type: "expense" },
  { name: "Installation Windows", amount: 99.99, date: "2024-03-03", type: "income" },
  { name: "Formation bureautique", amount: 299.99, date: "2024-03-02", type: "income" },
  { name: "Maintenance annuelle", amount: 599.99, date: "2024-03-01", type: "income" },
];

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Customer {
  id: number;
  name: string;
}

interface Invoice {
  id: number;
  total: number;
}

interface Expense {
  id: number;
  amount: number;
}

export default function Dashboard() {
  const { data: products } = useQuery<Product[]>({ queryKey: ["/api/products"] });
  const { data: customers } = useQuery<Customer[]>({ queryKey: ["/api/customers"] });
  const { data: invoices } = useQuery<Invoice[]>({ queryKey: ["/api/invoices"] });
  const { data: expenses } = useQuery<Expense[]>({ queryKey: ["/api/expenses"] });

  const totalProducts = products?.length || 0;
  const totalCustomers = customers?.length || 0;
  const totalSales = invoices?.reduce((acc, inv) => acc + Number(inv.total), 0) || 0;
  const totalExpenses = expenses?.reduce((acc, exp) => acc + Number(exp.amount), 0) || 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Tableau de bord</h1>
        <div className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('fr-FR', { 
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Solde total"
          value={`${(totalSales - totalExpenses).toFixed(2)} €`}
          icon={<Wallet className="h-4 w-4 text-primary" />}
          percentage={{ value: 4.5, trend: "up" }}
          subtext="vs mois dernier"
        />
        <DashboardCard
          title="Ventes mensuelles"
          value={`${totalSales.toFixed(2)} €`}
          icon={<Receipt className="h-4 w-4 text-primary" />}
          percentage={{ value: 2.9, trend: "down" }}
          subtext="vs mois dernier"
        />
        <DashboardCard
          title="Clients"
          value={totalCustomers}
          icon={<Users className="h-4 w-4 text-primary" />}
          percentage={{ value: 12, trend: "up" }}
          subtext="nouveaux clients"
        />
        <DashboardCard
          title="Produits"
          value={totalProducts}
          icon={<Package className="h-4 w-4 text-primary" />}
          percentage={{ value: 3, trend: "down" }}
          subtext="en stock"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-5 p-6">
          <h2 className="text-lg font-semibold mb-6 text-foreground">Statistiques financières</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5863F8" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#5863F8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="expense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16BAC5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#16BAC5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#16BAC5" opacity={0.1} />
                <XAxis dataKey="name" stroke="#171D1C" />
                <YAxis stroke="#171D1C" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #16BAC5'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#5863F8" 
                  fillOpacity={1} 
                  fill="url(#income)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="expense" 
                  stroke="#16BAC5" 
                  fillOpacity={1} 
                  fill="url(#expense)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="col-span-2 p-6">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Transactions récentes</h2>
          <div className="space-y-4">
            {recentTransactions.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{transaction.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(transaction.date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <span className={cn(
                  "font-medium",
                  transaction.type === "income" ? "text-success" : "text-destructive"
                )}>
                  {transaction.type === "income" ? "+" : "-"}
                  {transaction.amount.toFixed(2)} €
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
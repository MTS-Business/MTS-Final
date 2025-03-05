import { useQuery } from "@tanstack/react-query";
import { DashboardCard } from "@/components/layout/dashboard-card";
import { Card } from "@/components/ui/card";
import { Package, Users, Receipt, DollarSign, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Product {
  id: number;
  name: string;
  price: number;
}

interface Customer {
  id: number;
  name: string;
  email: string;
}

interface Invoice {
  id: number;
  reference: string;
  total: number;
  date: string;
}

interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
}

interface Task {
  id: number;
  status: string;
}

export default function Dashboard() {
  // Récupérer les données en temps réel avec les types corrects
  const { data: products = [] } = useQuery<Product[]>({ 
    queryKey: ["/api/products"],
  });

  const { data: customers = [] } = useQuery<Customer[]>({ 
    queryKey: ["/api/customers"],
  });

  const { data: invoices = [] } = useQuery<Invoice[]>({ 
    queryKey: ["/api/invoices"],
  });

  const { data: expenses = [] } = useQuery<Expense[]>({ 
    queryKey: ["/api/expenses"],
  });

  const { data: tasks = [] } = useQuery<Task[]>({ 
    queryKey: ["/api/tasks"],
  });

  // Calculer les statistiques avec des valeurs par défaut sûres
  const totalProducts = products.length;
  const totalCustomers = customers.length;
  const totalSales = invoices.reduce((acc, inv) => acc + Number(inv.total), 0);
  const totalExpenses = expenses.reduce((acc, exp) => acc + Number(exp.amount), 0);

  // Calculer les tendances mensuelles
  const getMonthlyData = () => {
    const monthlyData = new Map();

    // Traiter les ventes
    invoices.forEach((invoice) => {
      const date = new Date(invoice.date);
      const monthKey = date.toLocaleString('fr-FR', { month: 'short' });
      const currentTotal = monthlyData.get(monthKey)?.income || 0;
      monthlyData.set(monthKey, { 
        ...monthlyData.get(monthKey),
        income: currentTotal + Number(invoice.total)
      });
    });

    // Traiter les dépenses
    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      const monthKey = date.toLocaleString('fr-FR', { month: 'short' });
      const currentTotal = monthlyData.get(monthKey)?.expense || 0;
      monthlyData.set(monthKey, {
        ...monthlyData.get(monthKey),
        expense: currentTotal + Number(expense.amount)
      });
    });

    return Array.from(monthlyData, ([name, data]) => ({
      name,
      income: data.income || 0,
      expense: data.expense || 0
    }));
  };

  const monthlyData = getMonthlyData();

  // Obtenir les transactions récentes avec typage strict
  const getRecentTransactions = () => {
    const allTransactions = [
      ...invoices.map(invoice => ({
        name: `Facture ${invoice.reference}`,
        amount: Number(invoice.total),
        date: invoice.date,
        type: "income" as const
      })),
      ...expenses.map(expense => ({
        name: expense.description,
        amount: Number(expense.amount),
        date: expense.date,
        type: "expense" as const
      }))
    ];

    return allTransactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  };

  const recentTransactions = getRecentTransactions();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-foreground">Tableau de bord</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Solde total"
          value={`${(totalSales - totalExpenses).toFixed(3)} DT`}
          icon={<Wallet className="h-4 w-4 text-primary" />}
          percentage={{ 
            value: totalSales > 0 ? Math.round(((totalSales - totalExpenses) / totalSales) * 100) : 0, 
            trend: totalSales > totalExpenses ? "up" : "down" 
          }}
          subtext="Solde actuel"
        />
        <DashboardCard
          title="Ventes mensuelles"
          value={`${totalSales.toFixed(3)} DT`}
          icon={<Receipt className="h-4 w-4 text-primary" />}
          percentage={{ 
            value: invoices.length > 0 ? Math.round(invoices.length / 30) : 0, 
            trend: "up" 
          }}
          subtext="Moyenne par jour"
        />
        <DashboardCard
          title="Clients"
          value={totalCustomers}
          icon={<Users className="h-4 w-4 text-primary" />}
          percentage={{ 
            value: customers.length > 0 ? Math.round((customers.length / 10) * 10) : 0, 
            trend: "up" 
          }}
          subtext="clients actifs"
        />
        <DashboardCard
          title="Projets"
          value={tasks.length}
          icon={<Package className="h-4 w-4 text-primary" />}
          percentage={{ 
            value: tasks.length > 0 
              ? Math.round((tasks.filter(t => t.status === "done").length / tasks.length) * 100)
              : 0,
            trend: "up" 
          }}
          subtext="projets en cours"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-5 p-6">
          <h2 className="text-lg font-semibold mb-6 text-foreground">Statistiques financières</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
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
                  {transaction.amount.toFixed(3)} DT
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
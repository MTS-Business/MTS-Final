import { useQuery } from "@tanstack/react-query";
import { DashboardCard } from "@/components/layout/dashboard-card";
import { Card } from "@/components/ui/card";
import { Package, Users, Receipt, DollarSign } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const { data: products } = useQuery({ 
    queryKey: ["/api/products"]
  });
  const { data: customers } = useQuery({ 
    queryKey: ["/api/customers"]
  });
  const { data: invoices } = useQuery({ 
    queryKey: ["/api/invoices"]
  });
  const { data: expenses } = useQuery({ 
    queryKey: ["/api/expenses"]
  });

  const totalProducts = products?.length || 0;
  const totalCustomers = customers?.length || 0;
  const totalSales = invoices?.reduce((acc, inv) => acc + Number(inv.total), 0) || 0;
  const totalExpenses = expenses?.reduce((acc, exp) => acc + Number(exp.amount), 0) || 0;

  const salesData = [
    { name: "Jan", amount: 4000 },
    { name: "Feb", amount: 3000 },
    { name: "Mar", amount: 2000 },
    { name: "Apr", amount: 2780 },
    { name: "May", amount: 1890 },
    { name: "Jun", amount: 2390 },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Products"
          value={totalProducts}
          icon={<Package className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="Total Customers"
          value={totalCustomers}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="Total Sales"
          value={`$${totalSales.toFixed(2)}`}
          icon={<Receipt className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="Total Expenses"
          value={`$${totalExpenses.toFixed(2)}`}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Monthly Sales</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

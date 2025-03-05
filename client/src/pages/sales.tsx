import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Données de démonstration
const recentInvoices = [
  { 
    id: 1, 
    customerName: "Société ABC", 
    date: "2024-03-05", 
    amount: 1500.000,
    status: "paid",
    items: ["Installation Windows", "Configuration réseau"]
  },
  { 
    id: 2, 
    customerName: "Enterprise XYZ", 
    date: "2024-03-04", 
    amount: 2500.000,
    status: "pending",
    items: ["Maintenance annuelle", "Support technique"]
  },
  { 
    id: 3, 
    customerName: "Startup 123", 
    date: "2024-03-03", 
    amount: 800.000,
    status: "cancelled",
    items: ["Formation Excel"]
  },
];

const salesData = [
  { month: "Jan", total: 4500 },
  { month: "Fév", total: 3800 },
  { month: "Mar", total: 5200 },
  { month: "Avr", total: 4800 },
  { month: "Mai", total: 6000 },
  { month: "Jun", total: 5500 },
];

const topProducts = [
  { name: "Installation Windows", sales: 12, revenue: 1200 },
  { name: "Configuration réseau", sales: 8, revenue: 1600 },
  { name: "Formation Excel", sales: 15, revenue: 1800 },
  { name: "Maintenance annuelle", sales: 6, revenue: 3600 },
];

const customerSales = [
  { name: "Société ABC", revenue: 4500 },
  { name: "Enterprise XYZ", revenue: 3800 },
  { name: "Startup 123", revenue: 2200 },
  { name: "Tech Corp", revenue: 1900 },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "paid":
      return "Payée";
    case "pending":
      return "En attente";
    case "cancelled":
      return "Annulée";
    default:
      return status;
  }
};

export default function Sales() {
  const { data: invoices } = useQuery({
    queryKey: ["/api/invoices"],
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analyse des ventes</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Tendance des ventes</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Ventes par client</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={customerSales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Produits les plus vendus</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead className="text-right">Ventes</TableHead>
                <TableHead className="text-right">Revenus</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topProducts.map((product) => (
                <TableRow key={product.name}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell className="text-right">{product.sales}</TableCell>
                  <TableCell className="text-right">{product.revenue.toFixed(3)} DT</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Factures récentes</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.customerName}</TableCell>
                  <TableCell>{invoice.amount.toFixed(3)} DT</TableCell>
                  <TableCell>
                    {new Date(invoice.date).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={cn(
                      "font-medium",
                      getStatusColor(invoice.status)
                    )}>
                      {getStatusText(invoice.status)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Sales() {
  const { data: invoices } = useQuery({
    queryKey: ["/api/invoices"],
  });

  // Group sales by month
  const salesByMonth = invoices?.reduce((acc: any, invoice: any) => {
    const month = new Date(invoice.date).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + Number(invoice.total);
    return acc;
  }, {}) || {};

  const chartData = Object.entries(salesByMonth).map(([month, total]) => ({
    month,
    total,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Sales Analysis</h1>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Sales Trend</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Top Products</h2>
          {/* Add top products table/chart here */}
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Sales by Customer</h2>
          {/* Add sales by customer table/chart here */}
        </Card>
      </div>
    </div>
  );
}

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { DashboardCard } from "@/components/layout/dashboard-card";

export default function Comptabilite() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Comptabilité</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Chiffre d'affaires"
          value="150,000.000 DT"
          icon={<DollarSign className="h-4 w-4 text-primary" />}
          percentage={{ value: 12.5, trend: "up" }}
          subtext="vs mois dernier"
        />
        <DashboardCard
          title="Dépenses"
          value="45,000.000 DT"
          icon={<TrendingDown className="h-4 w-4 text-primary" />}
          percentage={{ value: 5.2, trend: "down" }}
          subtext="vs mois dernier"
        />
        <DashboardCard
          title="Bénéfice"
          value="105,000.000 DT"
          icon={<TrendingUp className="h-4 w-4 text-primary" />}
          percentage={{ value: 8.3, trend: "up" }}
          subtext="vs mois dernier"
        />
        <DashboardCard
          title="TVA"
          value="28,500.000 DT"
          icon={<Calculator className="h-4 w-4 text-primary" />}
          percentage={{ value: 2.1, trend: "up" }}
          subtext="vs mois dernier"
        />
      </div>

      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Journal comptable</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Débit</TableHead>
                <TableHead>Crédit</TableHead>
                <TableHead>Solde</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>2024-03-04</TableCell>
                <TableCell>Vente de services</TableCell>
                <TableCell>Revenus</TableCell>
                <TableCell>1,500.000</TableCell>
                <TableCell>0.000</TableCell>
                <TableCell>1,500.000</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2024-03-04</TableCell>
                <TableCell>Achat fournitures</TableCell>
                <TableCell>Dépenses</TableCell>
                <TableCell>0.000</TableCell>
                <TableCell>500.000</TableCell>
                <TableCell>1,000.000</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

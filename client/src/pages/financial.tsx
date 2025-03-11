import { DashboardCard } from "@/components/layout/dashboard-card";
import { Card } from "@/components/ui/card";
import { 
  DollarSign, 
  ArrowUpCircle,
  ArrowDownCircle,
  TrendingUp,
  BankIcon,
  Wallet
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function Financial() {
  const { data: financialData } = useQuery({
    queryKey: ["/api/financial"],
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gestion financière</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Chiffre d'affaires"
          value="120,000 DT"
          icon={<DollarSign className="h-4 w-4 text-primary" />}
          percentage={{ value: 12, trend: "up" }}
          subtext="Ce mois"
        />
        <DashboardCard
          title="Recettes"
          value="85,000 DT"
          icon={<ArrowUpCircle className="h-4 w-4 text-primary" />}
          percentage={{ value: 8, trend: "up" }}
          subtext="Ce mois"
        />
        <DashboardCard
          title="Dépenses"
          value="35,000 DT"
          icon={<ArrowDownCircle className="h-4 w-4 text-primary" />}
          percentage={{ value: 5, trend: "down" }}
          subtext="Ce mois"
        />
        <DashboardCard
          title="Bénéfice net"
          value="50,000 DT"
          icon={<TrendingUp className="h-4 w-4 text-primary" />}
          percentage={{ value: 15, trend: "up" }}
          subtext="Ce mois"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Comptes bancaires</h2>
          {/* Liste des comptes bancaires */}
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Trésorerie</h2>
          {/* État de la trésorerie */}
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Créances clients</h2>
          {/* Liste des créances */}
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Dettes fournisseurs</h2>
          {/* Liste des dettes */}
        </Card>
      </div>
    </div>
  );
}

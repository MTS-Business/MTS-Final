import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, TrendingDown, Mail } from "lucide-react";
import { DashboardCard } from "@/components/layout/dashboard-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Comptabilite() {
  const { toast } = useToast();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleSendToAccountant = () => {
    // Simulation d'envoi
    setIsConfirmOpen(false);
    toast({
      title: "Documents envoyés",
      description: "Les factures et dépenses ont été envoyées au comptable avec succès."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Comptabilité</h1>
        <Button 
          onClick={() => setIsConfirmOpen(true)}
          className="bg-[#0077B6] text-white hover:bg-[#0077B6]/90"
        >
          <Mail className="mr-2 h-4 w-4" />
          Envoi Comptable
        </Button>
      </div>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Envoyer au comptable</DialogTitle>
            <DialogDescription>
              Voulez-vous envoyer toutes les factures et dépenses de la période actuelle au comptable ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
              Annuler
            </Button>
            <Button 
              className="bg-[#0077B6] text-white hover:bg-[#0077B6]/90"
              onClick={handleSendToAccountant}
            >
              Confirmer l'envoi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
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
import { Input } from "@/components/ui/input";
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
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range"
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { addDays } from "date-fns";

// Données de test
const factures = [
  { id: 1, numero: "F2024-001", date: "2024-03-01", montant: 1500.000, client: "Société ABC" },
  { id: 2, numero: "F2024-002", date: "2024-03-02", montant: 2500.000, client: "Entreprise XYZ" },
];

const depenses = [
  { id: 1, numero: "D2024-001", date: "2024-03-01", montant: 500.000, fournisseur: "Fournitures Bureau" },
  { id: 2, numero: "D2024-002", date: "2024-03-03", montant: 800.000, fournisseur: "Services IT" },
];

export default function Comptabilite() {
  const { toast } = useToast();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedFactures, setSelectedFactures] = useState<number[]>([]);
  const [selectedDepenses, setSelectedDepenses] = useState<number[]>([]);
  const [accountantEmail, setAccountantEmail] = useState("");
  const [date, setDate] = useState({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  const handleSendToAccountant = () => {
    setIsConfirmOpen(false);
    toast({
      title: "Documents envoyés",
      description: `${selectedFactures.length} factures et ${selectedDepenses.length} dépenses ont été envoyées au comptable (${accountantEmail}).`
    });
    setAccountantEmail("");
    setSelectedFactures([]);
    setSelectedDepenses([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
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
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Envoyer au comptable</DialogTitle>
            <DialogDescription>
              Sélectionnez la période et les documents à envoyer au comptable
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="accountant-email" className="text-red-500">Email du comptable *</Label>
                <Input
                  id="accountant-email"
                  type="email"
                  placeholder="comptable@example.com"
                  value={accountantEmail}
                  onChange={(e) => setAccountantEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Période</Label>
                <DatePickerWithRange 
                  date={date}
                  setDate={setDate}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Factures</h3>
                <Card className="p-4">
                  <div className="space-y-2">
                    {factures.map((facture) => (
                      <div key={facture.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={selectedFactures.includes(facture.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedFactures([...selectedFactures, facture.id]);
                              } else {
                                setSelectedFactures(selectedFactures.filter(id => id !== facture.id));
                              }
                            }}
                          />
                          <span>
                            {facture.numero} - {facture.client} - {facture.montant.toFixed(3)} DT
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(facture.date).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Dépenses</h3>
                <Card className="p-4">
                  <div className="space-y-2">
                    {depenses.map((depense) => (
                      <div key={depense.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={selectedDepenses.includes(depense.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedDepenses([...selectedDepenses, depense.id]);
                              } else {
                                setSelectedDepenses(selectedDepenses.filter(id => id !== depense.id));
                              }
                            }}
                          />
                          <span>
                            {depense.numero} - {depense.fournisseur} - {depense.montant.toFixed(3)} DT
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(depense.date).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
              Annuler
            </Button>
            <Button 
              className="bg-[#0077B6] text-white hover:bg-[#0077B6]/90"
              onClick={handleSendToAccountant}
              disabled={!accountantEmail || (selectedFactures.length === 0 && selectedDepenses.length === 0)}
            >
              Envoyer les documents sélectionnés
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
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Données de test
const initialCompanyInfo = {
  nom: "MTS Gestion",
  adresse: "123 Rue Principale, Tunis",
  telephone: "+216 71 123 456",
  email: "contact@mtsgestion.com",
  matriculeFiscale: "1234567/A/M/000",
  registreCommerce: "B123456789",
  comptesBancaires: [
    {
      banque: "Banque XYZ",
      rib: "TN59 1234 5678 9012 3456 7890",
      devise: "TND"
    }
  ],
  siteWeb: "www.mtsgestion.com",
  description: "Leader dans la gestion des systèmes d'information et services informatiques"
};

export default function CompanyInfo() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState(false);
  const [bankAccounts, setBankAccounts] = useState([{ banque: "", rib: "", devise: "" }]);

  const { data: companyInfo = initialCompanyInfo } = useQuery({
    queryKey: ["/api/company-info"],
    initialData: initialCompanyInfo,
  });

  const [formData, setFormData] = useState(companyInfo);

  const updateCompanyInfo = useMutation({
    mutationFn: async (values: typeof formData) => {
      try {
        const response = await fetch("/api/company-info", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la mise à jour des informations");
        }

        // Mettre à jour le cache avec les nouvelles données
        queryClient.setQueryData(["/api/company-info"], values);

        return values;
      } catch (error) {
        console.error("Erreur lors de la mise à jour:", error);
        throw new Error("Erreur lors de la mise à jour des informations");
      }
    },
    onSuccess: () => {
      toast({
        title: "Mise à jour réussie",
        description: "Les informations de la société ont été mises à jour avec succès."
      });
      setEditMode(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addBankAccount = () => {
    setBankAccounts([...bankAccounts, { banque: "", rib: "", devise: "" }]);
  };

  const removeBankAccount = (index: number) => {
    setBankAccounts(bankAccounts.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Informations de la société</h1>
        <Button
          onClick={() => {
            if (editMode) {
              updateCompanyInfo.mutate(formData);
            } else {
              setEditMode(true);
            }
          }}
          className="bg-[#0077B6] text-white hover:bg-[#0077B6]/90"
        >
          {editMode ? "Enregistrer" : "Modifier"}
        </Button>
      </div>

      <Card className="p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Label htmlFor="nom">Nom de la société</Label>
            <Input
              id="nom"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              disabled={!editMode}
            />
          </div>
          <div>
            <Label htmlFor="matriculeFiscale">Matricule fiscale</Label>
            <Input
              id="matriculeFiscale"
              value={formData.matriculeFiscale}
              onChange={(e) => setFormData({ ...formData, matriculeFiscale: e.target.value })}
              disabled={!editMode}
            />
          </div>
          <div>
            <Label htmlFor="registreCommerce">Registre de commerce</Label>
            <Input
              id="registreCommerce"
              value={formData.registreCommerce}
              onChange={(e) => setFormData({ ...formData, registreCommerce: e.target.value })}
              disabled={!editMode}
            />
          </div>
          <div>
            <Label htmlFor="telephone">Téléphone</Label>
            <Input
              id="telephone"
              value={formData.telephone}
              onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              disabled={!editMode}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!editMode}
            />
          </div>
          <div>
            <Label htmlFor="siteWeb">Site web</Label>
            <Input
              id="siteWeb"
              value={formData.siteWeb}
              onChange={(e) => setFormData({ ...formData, siteWeb: e.target.value })}
              disabled={!editMode}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="adresse">Adresse</Label>
            <Textarea
              id="adresse"
              value={formData.adresse}
              onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
              disabled={!editMode}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={!editMode}
              className="h-32"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Comptes bancaires</h2>
        <div className="space-y-4">
          {formData.comptesBancaires.map((compte, index) => (
            <div key={index} className="grid gap-4 md:grid-cols-3 items-start">
              <div>
                <Label>Banque</Label>
                <Input
                  value={compte.banque}
                  onChange={(e) => {
                    const newComptes = [...formData.comptesBancaires];
                    newComptes[index].banque = e.target.value;
                    setFormData({ ...formData, comptesBancaires: newComptes });
                  }}
                  disabled={!editMode}
                />
              </div>
              <div>
                <Label>RIB</Label>
                <Input
                  value={compte.rib}
                  onChange={(e) => {
                    const newComptes = [...formData.comptesBancaires];
                    newComptes[index].rib = e.target.value;
                    setFormData({ ...formData, comptesBancaires: newComptes });
                  }}
                  disabled={!editMode}
                />
              </div>
              <div>
                <Label>Devise</Label>
                <Input
                  value={compte.devise}
                  onChange={(e) => {
                    const newComptes = [...formData.comptesBancaires];
                    newComptes[index].devise = e.target.value;
                    setFormData({ ...formData, comptesBancaires: newComptes });
                  }}
                  disabled={!editMode}
                />
              </div>
            </div>
          ))}
          {editMode && (
            <Button
              variant="outline"
              onClick={() => {
                const newComptes = [...formData.comptesBancaires, { banque: "", rib: "", devise: "" }];
                setFormData({ ...formData, comptesBancaires: newComptes });
              }}
            >
              Ajouter un compte bancaire
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

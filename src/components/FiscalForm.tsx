import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Minus, FileText } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { RomaneioFiscal } from "@/types/romaneio";
import { storage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

interface FiscalFormProps {
  onRomaneioCreated: (romaneio: RomaneioFiscal) => void;
}

export const FiscalForm = ({ onRomaneioCreated }: FiscalFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fazenda: "",
    numeroRomaneio: "",
    quantidadeDeclarada: "",
    destino: "",
    fiscal: ""
  });
  const [parcelas, setParcelas] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);

  const addParcela = () => {
    setParcelas([...parcelas, ""]);
  };

  const removeParcela = (index: number) => {
    if (parcelas.length > 1) {
      setParcelas(parcelas.filter((_, i) => i !== index));
    }
  };

  const updateParcela = (index: number, value: string) => {
    const newParcelas = [...parcelas];
    newParcelas[index] = value;
    setParcelas(newParcelas);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const romaneio: RomaneioFiscal = {
        id: uuidv4(),
        fazenda: formData.fazenda,
        numeroRomaneio: formData.numeroRomaneio,
        parcelas: parcelas.filter(p => p.trim() !== ""),
        quantidadeDeclarada: parseFloat(formData.quantidadeDeclarada),
        destino: formData.destino,
        dataHoraCriacao: new Date().toISOString(),
        fiscal: formData.fiscal || undefined
      };

      // Salva no storage local
      storage.addRomaneioFiscal(romaneio);
      
      // Chama callback
      onRomaneioCreated(romaneio);

      // Reset form
      setFormData({
        fazenda: "",
        numeroRomaneio: "",
        quantidadeDeclarada: "",
        destino: "",
        fiscal: ""
      });
      setParcelas([""]);

      toast({
        title: "Romaneio criado!",
        description: "QR Code gerado com sucesso. Entregue ao motorista.",
        variant: "default"
      });

    } catch (error) {
      console.error("Erro ao criar romaneio:", error);
      toast({
        title: "Erro",
        description: "Falha ao criar romaneio. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-[var(--gradient-card)] border-border shadow-[var(--shadow-medium)]">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Criar Romaneio</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fazenda">Fazenda *</Label>
            <Input
              id="fazenda"
              value={formData.fazenda}
              onChange={(e) => setFormData({ ...formData, fazenda: e.target.value })}
              placeholder="Nome da fazenda"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="numeroRomaneio">Número do Romaneio *</Label>
            <Input
              id="numeroRomaneio"
              value={formData.numeroRomaneio}
              onChange={(e) => setFormData({ ...formData, numeroRomaneio: e.target.value })}
              placeholder="Ex: 12345"
              required
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label>Parcelas *</Label>
          <div className="space-y-2 mt-1">
            {parcelas.map((parcela, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={parcela}
                  onChange={(e) => updateParcela(index, e.target.value)}
                  placeholder={`Parcela ${index + 1} (ex: P01)`}
                  required
                />
                {parcelas.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeParcela(index)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addParcela}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Parcela
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="quantidade">Quantidade Declarada (kg) *</Label>
            <Input
              id="quantidade"
              type="number"
              step="0.1"
              value={formData.quantidadeDeclarada}
              onChange={(e) => setFormData({ ...formData, quantidadeDeclarada: e.target.value })}
              placeholder="25000.0"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="destino">Destino *</Label>
            <Input
              id="destino"
              value={formData.destino}
              onChange={(e) => setFormData({ ...formData, destino: e.target.value })}
              placeholder="Usina X"
              required
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="fiscal">Nome do Fiscal</Label>
          <Input
            id="fiscal"
            value={formData.fiscal}
            onChange={(e) => setFormData({ ...formData, fiscal: e.target.value })}
            placeholder="Seu nome (opcional)"
            className="mt-1"
          />
        </div>

        <Button
          type="submit"
          variant="hero"
          size="lg"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Gerando..." : "Gerar QR Code do Romaneio"}
        </Button>
      </form>
    </Card>
  );
};
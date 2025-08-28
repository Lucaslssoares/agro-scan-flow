import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Truck, User } from "lucide-react";
import { RomaneioFiscal, RomaneioCompleto } from "@/types/romaneio";
import { storage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

interface MotoristaFormProps {
  romaneioFiscal: RomaneioFiscal;
  onRomaneioCompleto: (romaneio: RomaneioCompleto) => void;
}

export const MotoristaForm = ({ romaneioFiscal, onRomaneioCompleto }: MotoristaFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    motorista: "",
    cpfMotorista: "",
    placaVeiculo: "",
    transportadora: ""
  });
  const [loading, setLoading] = useState(false);

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };

  const formatPlaca = (value: string) => {
    const cleaned = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    if (cleaned.length <= 7) {
      return cleaned.replace(/([A-Z]{3})(\d{4})/, '$1-$2');
    }
    return value;
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setFormData({ ...formData, cpfMotorista: formatted });
  };

  const handlePlacaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPlaca(e.target.value);
    setFormData({ ...formData, placaVeiculo: formatted });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const romaneioCompleto: RomaneioCompleto = {
        ...romaneioFiscal,
        motorista: formData.motorista,
        cpfMotorista: formData.cpfMotorista,
        placaVeiculo: formData.placaVeiculo,
        transportadora: formData.transportadora,
        dataHoraChegada: new Date().toISOString(),
        status: 'completo'
      };

      // Salva no storage local
      storage.updateRomaneioCompleto(romaneioCompleto);
      
      // Chama callback
      onRomaneioCompleto(romaneioCompleto);

      toast({
        title: "Dados completados!",
        description: "Romaneio pronto para entrega na balança.",
        variant: "default"
      });

    } catch (error) {
      console.error("Erro ao completar romaneio:", error);
      toast({
        title: "Erro",
        description: "Falha ao completar romaneio. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Dados do Fiscal */}
      <Card className="p-6 bg-[var(--gradient-card)] border-border shadow-[var(--shadow-medium)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-success/10 rounded-lg">
            <User className="w-5 h-5 text-success" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Dados do Romaneio</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-muted-foreground">Fazenda:</span>
            <p className="text-foreground">{romaneioFiscal.fazenda}</p>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Romaneio:</span>
            <p className="text-foreground">{romaneioFiscal.numeroRomaneio}</p>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Parcelas:</span>
            <p className="text-foreground">{romaneioFiscal.parcelas.join(', ')}</p>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Quantidade:</span>
            <p className="text-foreground">{romaneioFiscal.quantidadeDeclarada.toLocaleString()} kg</p>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Destino:</span>
            <p className="text-foreground">{romaneioFiscal.destino}</p>
          </div>
          {romaneioFiscal.fiscal && (
            <div>
              <span className="font-medium text-muted-foreground">Fiscal:</span>
              <p className="text-foreground">{romaneioFiscal.fiscal}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Formulário do Motorista */}
      <Card className="p-6 bg-[var(--gradient-card)] border-border shadow-[var(--shadow-medium)]">
        <div className="flex items-center gap-3 mb-6">
          <Truck className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Complete seus dados</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="motorista">Nome do Motorista *</Label>
              <Input
                id="motorista"
                value={formData.motorista}
                onChange={(e) => setFormData({ ...formData, motorista: e.target.value })}
                placeholder="João da Silva"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                value={formData.cpfMotorista}
                onChange={handleCPFChange}
                placeholder="123.456.789-00"
                maxLength={14}
                required
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="placa">Placa do Veículo *</Label>
              <Input
                id="placa"
                value={formData.placaVeiculo}
                onChange={handlePlacaChange}
                placeholder="ABC-1234"
                maxLength={8}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="transportadora">Transportadora *</Label>
              <Input
                id="transportadora"
                value={formData.transportadora}
                onChange={(e) => setFormData({ ...formData, transportadora: e.target.value })}
                placeholder="Transporte BR"
                required
                className="mt-1"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="hero"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Processando..." : "Finalizar Romaneio"}
          </Button>
        </form>
      </Card>
    </div>
  );
};
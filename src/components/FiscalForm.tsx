import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, X } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { RomaneioFiscal } from "@/types/romaneio";
import { storage } from "@/lib/storage";
import { apontamentoStorage } from "@/lib/apontamentoStorage";
import { fazendasMock, parcelasMock } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

interface FiscalFormProps {
  onRomaneioCreated: (romaneio: RomaneioFiscal) => void;
}

export const FiscalForm = ({ onRomaneioCreated }: FiscalFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fazenda: "",
    numeroRomaneio: "",
    parcelas: [] as string[],
    quantidadeDeclarada: "",
    destino: "",
    fiscal: "Fiscal de Campo" // Nome padrão
  });
  const [novaParcela, setNovaParcela] = useState("");
  const [consolidacao, setConsolidacao] = useState<any>(null);
  const [useConsolidacao, setUseConsolidacao] = useState(false);
  const [loading, setLoading] = useState(false);

  const addParcela = () => {
    if (novaParcela && !formData.parcelas.includes(novaParcela)) {
      setFormData({
        ...formData,
        parcelas: [...formData.parcelas, novaParcela]
      });
      setNovaParcela("");
      
      // Se usar consolidação, busca dados automaticamente
      if (useConsolidacao && formData.fazenda) {
        buscarConsolidacao(formData.fazenda, novaParcela);
      }
    }
  };

  const removeParcela = (parcela: string) => {
    setFormData({
      ...formData,
      parcelas: formData.parcelas.filter(p => p !== parcela)
    });
  };

  const buscarConsolidacao = (fazenda: string, parcela: string) => {
    const hoje = new Date().toISOString().split('T')[0];
    const consolidacaoData = apontamentoStorage.consolidarParcela(fazenda, parcela, hoje);
    
    if (consolidacaoData.totalCaixas > 0) {
      setConsolidacao(consolidacaoData);
      // Converte caixas para kg (assumindo 25kg por caixa)
      const pesoEstimado = consolidacaoData.totalCaixas * 25;
      setFormData(prev => ({
        ...prev,
        quantidadeDeclarada: pesoEstimado.toString()
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const romaneio: RomaneioFiscal = {
        id: uuidv4(),
        fazenda: formData.fazenda,
        numeroRomaneio: formData.numeroRomaneio,
        parcelas: formData.parcelas,
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
        parcelas: [],
        quantidadeDeclarada: "",
        destino: "",
        fiscal: "Fiscal de Campo"
      });
      setNovaParcela("");
      setConsolidacao(null);

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
            <Select value={formData.fazenda} onValueChange={(value) => {
              setFormData({ ...formData, fazenda: value });
              setConsolidacao(null);
            }}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione a fazenda" />
              </SelectTrigger>
              <SelectContent>
                {fazendasMock.map(f => (
                  <SelectItem key={f} value={f}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Label>Parcelas *</Label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={useConsolidacao}
                onChange={(e) => setUseConsolidacao(e.target.checked)}
                className="rounded"
              />
              Usar dados de apontamento
            </label>
          </div>
          <div className="flex gap-2">
            <Select value={novaParcela} onValueChange={setNovaParcela}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Selecione a parcela" />
              </SelectTrigger>
              <SelectContent>
                {parcelasMock.map(p => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="button" onClick={addParcela} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {formData.parcelas.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.parcelas.map((parcela) => (
                <Badge key={parcela} variant="secondary" className="px-3 py-1">
                  {parcela}
                  <button
                    type="button"
                    onClick={() => removeParcela(parcela)}
                    className="ml-2 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {consolidacao && (
            <Card className="p-4 bg-success/5 border-success/20">
              <h4 className="font-medium text-success mb-2">Dados de Apontamento Encontrados</h4>
              <p className="text-sm text-muted-foreground mb-2">
                {consolidacao.totalCaixas} caixas cortadas ({consolidacao.totalCaixas * 25} kg estimados)
              </p>
              <div className="text-xs space-y-1">
                {consolidacao.colaboradores.map((col: any) => (
                  <div key={col.id} className="flex justify-between">
                    <span>{col.nome}</span>
                    <span>{col.caixas} caixas</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
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
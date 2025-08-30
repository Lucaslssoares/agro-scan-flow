import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Check } from "lucide-react";
import { Apontamento } from "@/types/apontamento";
import { apontamentoStorage } from "@/lib/apontamentoStorage";
import { fazendasMock, parcelasMock } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

export const ApontamentoForm = () => {
  const { toast } = useToast();
  const [fazenda, setFazenda] = useState("");
  const [parcela, setParcela] = useState("");
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [colaboradores, setColaboradores] = useState<any[]>([]);
  const [apontamentos, setApontamentos] = useState<{[key: string]: number}>({});

  const carregarColaboradores = () => {
    if (fazenda) {
      const cols = apontamentoStorage.getColaboradores(fazenda);
      setColaboradores(cols);
      setApontamentos({});
    }
  };

  const salvarApontamento = async (colaboradorId: string, quantidade: number) => {
    if (!fazenda || !parcela || !data || quantidade <= 0) return;

    const colaborador = colaboradores.find(c => c.id === colaboradorId);
    if (!colaborador) return;

    const apontamento: Apontamento = {
      id: uuidv4(),
      colaboradorId,
      colaboradorNome: colaborador.nome,
      fazenda,
      parcela,
      quantidadeCaixas: quantidade,
      data,
      fiscalNome: "Fiscal de Campo", // Mock
      dataHoraCriacao: new Date().toISOString()
    };

    apontamentoStorage.saveApontamento(apontamento);
    
    toast({
      title: "Apontamento salvo!",
      description: `${quantidade} caixas registradas para ${colaborador.nome}`,
      variant: "default"
    });

    // Remove da lista temporariamente para mostrar que foi salvo
    setApontamentos(prev => {
      const newState = { ...prev };
      delete newState[colaboradorId];
      return newState;
    });
  };

  const handleQuantidadeChange = (colaboradorId: string, value: string) => {
    const quantidade = parseInt(value) || 0;
    setApontamentos(prev => ({
      ...prev,
      [colaboradorId]: quantidade
    }));
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-[var(--gradient-card)] border-border shadow-[var(--shadow-medium)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Apontamento de Produção</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <Label htmlFor="fazenda">Fazenda</Label>
            <Select value={fazenda} onValueChange={setFazenda}>
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
            <Label htmlFor="parcela">Parcela</Label>
            <Select value={parcela} onValueChange={setParcela}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione a parcela" />
              </SelectTrigger>
              <SelectContent>
                {parcelasMock.map(p => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="data">Data</Label>
            <Input
              id="data"
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <Button 
          onClick={carregarColaboradores}
          disabled={!fazenda}
          className="mb-6"
        >
          <Plus className="w-4 h-4 mr-2" />
          Carregar Colaboradores
        </Button>
      </Card>

      {colaboradores.length > 0 && (
        <Card className="p-6 bg-[var(--gradient-card)] border-border shadow-[var(--shadow-medium)]">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Colaboradores - {fazenda}
          </h3>
          
          <div className="space-y-3">
            {colaboradores.map(colaborador => (
              <div key={colaborador.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{colaborador.nome}</p>
                  <p className="text-sm text-muted-foreground">{colaborador.cpf}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Caixas"
                    min="0"
                    className="w-20"
                    value={apontamentos[colaborador.id] || ""}
                    onChange={(e) => handleQuantidadeChange(colaborador.id, e.target.value)}
                  />
                  <Badge variant="secondary">caixas</Badge>
                  
                  <Button
                    size="sm"
                    variant="field"
                    onClick={() => salvarApontamento(colaborador.id, apontamentos[colaborador.id] || 0)}
                    disabled={!apontamentos[colaborador.id] || apontamentos[colaborador.id] <= 0}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
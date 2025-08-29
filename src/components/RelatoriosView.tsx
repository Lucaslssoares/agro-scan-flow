import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Users, MapPin } from "lucide-react";
import { apontamentoStorage } from "@/lib/apontamentoStorage";
import { fazendasMock } from "@/lib/mockData";

export const RelatoriosView = () => {
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [fazendaSelecionada, setFazendaSelecionada] = useState("");
  const [colaboradorSelecionado, setColaboradorSelecionado] = useState("");
  const [relatorioFazenda, setRelatorioFazenda] = useState<any>(null);
  const [relatorioColaborador, setRelatorioColaborador] = useState<any>(null);

  const colaboradores = apontamentoStorage.getColaboradores();

  const gerarRelatorioFazenda = () => {
    if (!fazendaSelecionada || !dataInicio || !dataFim) return;
    
    const relatorio = apontamentoStorage.getRelatorioFazenda(fazendaSelecionada, dataInicio, dataFim);
    setRelatorioFazenda(relatorio);
  };

  const gerarRelatorioColaborador = () => {
    if (!colaboradorSelecionado || !dataInicio || !dataFim) return;
    
    const relatorio = apontamentoStorage.getRelatorioColaborador(colaboradorSelecionado, dataInicio, dataFim);
    setRelatorioColaborador(relatorio);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-[var(--gradient-card)] border-border shadow-[var(--shadow-medium)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-success/10 rounded-lg">
            <BarChart3 className="w-6 h-6 text-success" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Relatórios de Produção</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label htmlFor="data-inicio">Data Início</Label>
            <Input
              id="data-inicio"
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="data-fim">Data Fim</Label>
            <Input
              id="data-fim"
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <Tabs defaultValue="fazenda" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="fazenda">Por Fazenda</TabsTrigger>
            <TabsTrigger value="colaborador">Por Colaborador</TabsTrigger>
          </TabsList>
          
          <TabsContent value="fazenda" className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label>Fazenda</Label>
                <Select value={fazendaSelecionada} onValueChange={setFazendaSelecionada}>
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
              <div className="flex items-end">
                <Button onClick={gerarRelatorioFazenda} variant="field">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Gerar Relatório
                </Button>
              </div>
            </div>

            {relatorioFazenda && (
              <Card className="p-4 bg-background/50">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">{relatorioFazenda.fazenda}</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-success/10 rounded-lg">
                    <p className="text-2xl font-bold text-success">{relatorioFazenda.totalCaixas}</p>
                    <p className="text-sm text-muted-foreground">Total de Caixas</p>
                  </div>
                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{relatorioFazenda.parcelas.length}</p>
                    <p className="text-sm text-muted-foreground">Parcelas Produzindo</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Produção por Parcela:</h4>
                  {relatorioFazenda.parcelas.map((parcela: any) => (
                    <div key={parcela.parcela} className="flex justify-between items-center p-2 bg-muted/30 rounded">
                      <span>{parcela.parcela}</span>
                      <Badge variant="secondary">{parcela.caixas} caixas</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="colaborador" className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label>Colaborador</Label>
                <Select value={colaboradorSelecionado} onValueChange={setColaboradorSelecionado}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione o colaborador" />
                  </SelectTrigger>
                  <SelectContent>
                    {colaboradores.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={gerarRelatorioColaborador} variant="field">
                  <Users className="w-4 h-4 mr-2" />
                  Gerar Relatório
                </Button>
              </div>
            </div>

            {relatorioColaborador && (
              <Card className="p-4 bg-background/50">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">{relatorioColaborador.colaborador?.nome}</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-success/10 rounded-lg">
                    <p className="text-2xl font-bold text-success">{relatorioColaborador.totalCaixas}</p>
                    <p className="text-sm text-muted-foreground">Total de Caixas</p>
                  </div>
                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{relatorioColaborador.diasTrabalhados}</p>
                    <p className="text-sm text-muted-foreground">Dias Trabalhados</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Apontamentos:</h4>
                  {relatorioColaborador.apontamentos.map((apt: any) => (
                    <div key={apt.id} className="flex justify-between items-center p-2 bg-muted/30 rounded">
                      <div>
                        <span className="font-medium">{apt.parcela}</span>
                        <span className="text-sm text-muted-foreground ml-2">({apt.data})</span>
                      </div>
                      <Badge variant="secondary">{apt.quantidadeCaixas} caixas</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};
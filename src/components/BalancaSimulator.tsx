import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QRScannerComponent } from "@/components/QRScanner";
import { Scale, AlertTriangle, CheckCircle, QrCode } from "lucide-react";
import { RomaneioCompleto } from "@/types/romaneio";
import { BalancaData } from "@/types/apontamento";
import { apontamentoStorage } from "@/lib/apontamentoStorage";
import { storage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

export const BalancaSimulator = () => {
  const { toast } = useToast();
  const [showScanner, setShowScanner] = useState(false);
  const [romaneio, setRomaneio] = useState<RomaneioCompleto | null>(null);
  const [pesoBruto, setPesoBruto] = useState("");
  const [tara, setTara] = useState("");
  const [operador, setOperador] = useState("Operador da Balança");
  const [balancaData, setBalancaData] = useState<BalancaData | null>(null);

  const pesoLiquido = pesoBruto && tara ? parseFloat(pesoBruto) - parseFloat(tara) : 0;
  const pesoDeclarado = romaneio ? romaneio.quantidadeDeclarada : 0;
  const percentualDivergencia = pesoDeclarado > 0 ? Math.abs((pesoLiquido - pesoDeclarado) / pesoDeclarado) * 100 : 0;
  const status = percentualDivergencia <= 5 ? 'valido' : 'divergencia'; // 5% de tolerância

  const handleScanSuccess = (romaneioScaneado: any) => {
    if ('motorista' in romaneioScaneado) {
      setRomaneio(romaneioScaneado);
      setShowScanner(false);
      
      // Verifica se já existe pesagem para este romaneio
      const pesagemExistente = apontamentoStorage.getBalancaByRomaneio(romaneioScaneado.id);
      if (pesagemExistente) {
        setBalancaData(pesagemExistente);
        setPesoBruto(pesagemExistente.pesoBruto.toString());
        setTara(pesagemExistente.tara.toString());
      }
      
      toast({
        title: "Romaneio carregado!",
        description: `${romaneioScaneado.numeroRomaneio} - ${romaneioScaneado.motorista}`,
        variant: "default"
      });
    } else {
      toast({
        title: "Erro",
        description: "Este QR Code não é de um romaneio completo.",
        variant: "destructive"
      });
    }
  };

  const confirmarPesagem = () => {
    if (!romaneio || !pesoBruto || !tara) return;

    const dadosBalanca: BalancaData = {
      romaneioId: romaneio.id,
      pesoBruto: parseFloat(pesoBruto),
      tara: parseFloat(tara),
      pesoLiquido,
      dataHoraPesagem: new Date().toISOString(),
      operador,
      status,
      observacoes: status === 'divergencia' ? `Divergência de ${percentualDivergencia.toFixed(1)}%` : undefined
    };

    apontamentoStorage.saveBalancaData(dadosBalanca);
    setBalancaData(dadosBalanca);
    
    // Atualiza status do romaneio
    const romaneioAtualizado: RomaneioCompleto = {
      ...romaneio,
      status: 'entregue'
    };
    storage.updateRomaneioCompleto(romaneioAtualizado);

    toast({
      title: "Pesagem confirmada!",
      description: status === 'valido' ? "Peso dentro da tolerância" : "Divergência detectada",
      variant: status === 'valido' ? "default" : "destructive"
    });
  };

  const resetar = () => {
    setRomaneio(null);
    setBalancaData(null);
    setPesoBruto("");
    setTara("");
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-[var(--gradient-card)] border-border shadow-[var(--shadow-medium)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-warning/10 rounded-lg">
            <Scale className="w-6 h-6 text-warning" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Simulador de Balança</h2>
        </div>

        {!romaneio ? (
          <div className="text-center space-y-4">
            <Button onClick={() => setShowScanner(true)} variant="hero" size="lg">
              <QrCode className="w-5 h-5 mr-2" />
              Escanear Romaneio
            </Button>
            
            {showScanner && (
              <div className="mt-6">
                <QRScannerComponent
                  onScanSuccess={handleScanSuccess}
                  onClose={() => setShowScanner(false)}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Dados do Romaneio */}
            <Card className="p-4 bg-background/50">
              <h3 className="font-semibold mb-3">Dados do Romaneio</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">Romaneio:</span>
                  <p>{romaneio.numeroRomaneio}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Fazenda:</span>
                  <p>{romaneio.fazenda}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Motorista:</span>
                  <p>{romaneio.motorista}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Placa:</span>
                  <p>{romaneio.placaVeiculo}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Quantidade Declarada:</span>
                  <p className="font-bold text-primary">{romaneio.quantidadeDeclarada.toLocaleString()} kg</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Transportadora:</span>
                  <p>{romaneio.transportadora}</p>
                </div>
              </div>
            </Card>

            {/* Pesagem */}
            <Card className="p-4 bg-background/50">
              <h3 className="font-semibold mb-4">Dados da Pesagem</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="peso-bruto">Peso Bruto (kg)</Label>
                  <Input
                    id="peso-bruto"
                    type="number"
                    step="0.01"
                    value={pesoBruto}
                    onChange={(e) => setPesoBruto(e.target.value)}
                    placeholder="26500.00"
                    className="mt-1"
                    disabled={!!balancaData}
                  />
                </div>
                
                <div>
                  <Label htmlFor="tara">Tara (kg)</Label>
                  <Input
                    id="tara"
                    type="number"
                    step="0.01"
                    value={tara}
                    onChange={(e) => setTara(e.target.value)}
                    placeholder="1500.00"
                    className="mt-1"
                    disabled={!!balancaData}
                  />
                </div>
                
                <div>
                  <Label htmlFor="operador">Operador</Label>
                  <Input
                    id="operador"
                    value={operador}
                    onChange={(e) => setOperador(e.target.value)}
                    className="mt-1"
                    disabled={!!balancaData}
                  />
                </div>
              </div>

              {pesoBruto && tara && (
                <Card className="p-4 bg-muted/30">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{pesoLiquido.toLocaleString()} kg</p>
                      <p className="text-sm text-muted-foreground">Peso Líquido</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-muted-foreground">{pesoDeclarado.toLocaleString()} kg</p>
                      <p className="text-sm text-muted-foreground">Peso Declarado</p>
                    </div>
                  </div>

                  <div className="text-center mb-4">
                    <Badge 
                      variant={status === 'valido' ? 'default' : 'destructive'}
                      className="px-4 py-2"
                    >
                      {status === 'valido' ? (
                        <><CheckCircle className="w-4 h-4 mr-2" /> Válido</>
                      ) : (
                        <><AlertTriangle className="w-4 h-4 mr-2" /> Divergência</>
                      )}
                      <span className="ml-2">({percentualDivergencia.toFixed(1)}%)</span>
                    </Badge>
                  </div>

                  {!balancaData && (
                    <Button 
                      onClick={confirmarPesagem}
                      variant={status === 'valido' ? 'hero' : 'destructive'}
                      className="w-full"
                    >
                      Confirmar Pesagem
                    </Button>
                  )}
                </Card>
              )}

              {balancaData && (
                <div className="mt-4 p-3 bg-success/10 rounded-lg text-center">
                  <CheckCircle className="w-6 h-6 text-success mx-auto mb-2" />
                  <p className="font-medium text-success">
                    Pesagem confirmada em {new Date(balancaData.dataHoraPesagem).toLocaleString()}
                  </p>
                  {balancaData.observacoes && (
                    <p className="text-sm text-muted-foreground mt-1">{balancaData.observacoes}</p>
                  )}
                </div>
              )}
            </Card>

            <div className="flex justify-center">
              <Button variant="outline" onClick={resetar}>
                Nova Pesagem
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
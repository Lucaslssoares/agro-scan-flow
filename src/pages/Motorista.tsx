import { useState } from "react";
import { Header } from "@/components/Header";
import { QRScannerComponent } from "@/components/QRScanner";
import { MotoristaForm } from "@/components/MotoristaForm";
import { QRDisplay } from "@/components/QRDisplay";
import { Button } from "@/components/ui/button";
import { ArrowLeft, QrCode } from "lucide-react";
import { RomaneioFiscal, RomaneioCompleto } from "@/types/romaneio";

const Motorista = () => {
  const [step, setStep] = useState<'scan' | 'form' | 'qr'>('scan');
  const [romaneioFiscal, setRomaneioFiscal] = useState<RomaneioFiscal | null>(null);
  const [romaneioCompleto, setRomaneioCompleto] = useState<RomaneioCompleto | null>(null);

  const handleScanSuccess = (romaneio: RomaneioFiscal | RomaneioCompleto) => {
    // Se já é um romaneio completo, apenas exibe
    if ('motorista' in romaneio) {
      setRomaneioCompleto(romaneio);
      setStep('qr');
    } else {
      // Se é um romaneio fiscal, vai para o formulário
      setRomaneioFiscal(romaneio);
      setStep('form');
    }
  };

  const handleRomaneioCompleto = (romaneio: RomaneioCompleto) => {
    setRomaneioCompleto(romaneio);
    setStep('qr');
  };

  const handleReset = () => {
    setStep('scan');
    setRomaneioFiscal(null);
    setRomaneioCompleto(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Portal do Motorista" 
        subtitle="Escanear e completar romaneio"
        icon="motorista"
      />
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {step !== 'scan' && (
          <Button
            variant="ghost"
            onClick={handleReset}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Escanear outro QR Code
          </Button>
        )}

        {step === 'scan' && (
          <div className="space-y-6">
            <QRScannerComponent
              onScanSuccess={handleScanSuccess}
              onClose={handleReset}
            />
            
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg text-sm text-muted-foreground">
                <QrCode className="w-4 h-4" />
                Escaneie o QR Code fornecido pelo fiscal
              </div>
            </div>
          </div>
        )}

        {step === 'form' && romaneioFiscal && (
          <MotoristaForm
            romaneioFiscal={romaneioFiscal}
            onRomaneioCompleto={handleRomaneioCompleto}
          />
        )}

        {step === 'qr' && romaneioCompleto && (
          <QRDisplay
            romaneio={romaneioCompleto}
            title="Romaneio Finalizado!"
            onClose={handleReset}
          />
        )}
      </main>
    </div>
  );
};

export default Motorista;
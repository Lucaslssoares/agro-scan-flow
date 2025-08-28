import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Download, Share2, CheckCircle } from "lucide-react";
import { generateQRCode } from "@/lib/qrcode";
import { RomaneioFiscal, RomaneioCompleto } from "@/types/romaneio";

interface QRDisplayProps {
  romaneio: RomaneioFiscal | RomaneioCompleto;
  title?: string;
  onClose?: () => void;
}

export const QRDisplay = ({ romaneio, title = "QR Code do Romaneio", onClose }: QRDisplayProps) => {
  const [qrCode, setQrCode] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateCode = async () => {
      try {
        const qrDataUrl = await generateQRCode(romaneio);
        setQrCode(qrDataUrl);
      } catch (error) {
        console.error("Erro ao gerar QR Code:", error);
      } finally {
        setLoading(false);
      }
    };

    generateCode();
  }, [romaneio]);

  const downloadQR = () => {
    const link = document.createElement('a');
    link.download = `romaneio_${romaneio.numeroRomaneio}_qr.png`;
    link.href = qrCode;
    link.click();
  };

  const shareQR = async () => {
    if (navigator.share && qrCode) {
      try {
        // Convert data URL to blob
        const response = await fetch(qrCode);
        const blob = await response.blob();
        const file = new File([blob], `romaneio_${romaneio.numeroRomaneio}.png`, { type: 'image/png' });
        
        await navigator.share({
          title: `Romaneio ${romaneio.numeroRomaneio}`,
          text: `QR Code do romaneio ${romaneio.numeroRomaneio} - ${romaneio.fazenda}`,
          files: [file]
        });
      } catch (error) {
        console.error("Erro ao compartilhar:", error);
      }
    }
  };

  const isCompleto = 'motorista' in romaneio;

  return (
    <Card className="p-6 bg-[var(--gradient-card)] border-border shadow-[var(--shadow-strong)]">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-3">
          <div className="p-2 bg-success/10 rounded-lg">
            <CheckCircle className="w-6 h-6 text-success" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-xl shadow-[var(--shadow-medium)] inline-block">
              <img 
                src={qrCode} 
                alt="QR Code do Romaneio" 
                className="max-w-[256px] max-h-[256px]"
              />
            </div>
            
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Romaneio:</strong> {romaneio.numeroRomaneio}</p>
              <p><strong>Fazenda:</strong> {romaneio.fazenda}</p>
              <p><strong>Destino:</strong> {romaneio.destino}</p>
              <p><strong>Quantidade:</strong> {romaneio.quantidadeDeclarada.toLocaleString()} kg</p>
              {isCompleto && (
                <>
                  <p><strong>Motorista:</strong> {(romaneio as RomaneioCompleto).motorista}</p>
                  <p><strong>Placa:</strong> {(romaneio as RomaneioCompleto).placaVeiculo}</p>
                </>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-center flex-wrap">
          <Button
            variant="field"
            onClick={downloadQR}
            disabled={loading || !qrCode}
          >
            <Download className="w-4 h-4 mr-2" />
            Baixar
          </Button>
          
          {navigator.share && (
            <Button
              variant="secondary"
              onClick={shareQR}
              disabled={loading || !qrCode}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
          )}
          
          {onClose && (
            <Button
              variant="outline"
              onClick={onClose}
            >
              Fechar
            </Button>
          )}
        </div>

        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
          {isCompleto ? (
            <p>✅ Romaneio completo - Pronto para entrega na balança</p>
          ) : (
            <p>📱 Entregue este QR Code ao motorista para complementar os dados</p>
          )}
        </div>
      </div>
    </Card>
  );
};
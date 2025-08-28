import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X } from "lucide-react";
import QrScanner from 'qr-scanner';
import { parseQRCode } from "@/lib/qrcode";
import { RomaneioFiscal, RomaneioCompleto } from "@/types/romaneio";

interface QRScannerProps {
  onScanSuccess: (romaneio: RomaneioFiscal | RomaneioCompleto) => void;
  onClose: () => void;
}

export const QRScannerComponent = ({ onScanSuccess, onClose }: QRScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [scanner, setScanner] = useState<QrScanner | null>(null);
  const [error, setError] = useState<string>("");
  const [hasCamera, setHasCamera] = useState(true);

  useEffect(() => {
    const initScanner = async () => {
      if (!videoRef.current) return;

      try {
        const qrScanner = new QrScanner(
          videoRef.current,
          (result) => {
            const romaneio = parseQRCode(result.data);
            if (romaneio) {
              onScanSuccess(romaneio);
            } else {
              setError("QR Code inválido. Certifique-se de que é um romaneio válido.");
            }
          },
          {
            highlightScanRegion: true,
            highlightCodeOutline: true,
          }
        );

        setScanner(qrScanner);
        await qrScanner.start();
      } catch (err) {
        console.error("Erro ao inicializar scanner:", err);
        setError("Erro ao acessar a câmera. Verifique as permissões.");
        setHasCamera(false);
      }
    };

    initScanner();

    return () => {
      if (scanner) {
        scanner.destroy();
      }
    };
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await QrScanner.scanImage(file);
      const romaneio = parseQRCode(result);
      if (romaneio) {
        onScanSuccess(romaneio);
      } else {
        setError("QR Code inválido no arquivo selecionado.");
      }
    } catch (err) {
      console.error("Erro ao ler arquivo:", err);
      setError("Erro ao ler o arquivo. Selecione uma imagem válida.");
    }
  };

  return (
    <Card className="p-6 bg-[var(--gradient-card)] border-border shadow-[var(--shadow-strong)]">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Camera className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Escanear QR Code</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <p className="text-destructive text-sm">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setError("")}
              className="mt-2"
            >
              Tentar novamente
            </Button>
          </div>
        )}

        {hasCamera ? (
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-64 object-cover"
                playsInline
              />
              <div className="absolute inset-0 border-2 border-dashed border-white/50 m-8 rounded-lg pointer-events-none" />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Aponte a câmera para o QR Code do romaneio
            </p>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Câmera não disponível ou sem permissão</p>
          </div>
        )}

        <div className="border-t border-border pt-4">
          <Button
            variant="field"
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            Ou envie uma imagem do QR Code
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <p>💡 Dica: Posicione o QR Code dentro da área marcada para melhor leitura</p>
        </div>
      </div>
    </Card>
  );
};
import { useState } from "react";
import { Header } from "@/components/Header";
import { FiscalForm } from "@/components/FiscalForm";
import { QRDisplay } from "@/components/QRDisplay";
import { ApontamentoForm } from "@/components/ApontamentoForm";
import { RelatoriosView } from "@/components/RelatoriosView";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { RomaneioFiscal } from "@/types/romaneio";

const Fiscal = () => {
  const [currentRomaneio, setCurrentRomaneio] = useState<RomaneioFiscal | null>(null);

  const handleRomaneioCreated = (romaneio: RomaneioFiscal) => {
    setCurrentRomaneio(romaneio);
  };

  const handleClose = () => {
    setCurrentRomaneio(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Fiscal de Campo" 
        subtitle="Criar romaneio e gerar QR Code"
        icon="fiscal"
      />
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {currentRomaneio ? (
          <div className="space-y-6">
            <Button
              variant="ghost"
              onClick={handleClose}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            
            <QRDisplay
              romaneio={currentRomaneio}
              title="QR Code Gerado com Sucesso!"
              onClose={handleClose}
            />
          </div>
        ) : (
          <Tabs defaultValue="apontamento" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="apontamento">Apontamentos</TabsTrigger>
              <TabsTrigger value="romaneio">Romaneios</TabsTrigger>
              <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
            </TabsList>
            
            <TabsContent value="apontamento" className="mt-6">
              <ApontamentoForm />
            </TabsContent>
            
            <TabsContent value="romaneio" className="mt-6">
              <FiscalForm onRomaneioCreated={handleRomaneioCreated} />
            </TabsContent>
            
            <TabsContent value="relatorios" className="mt-6">
              <RelatoriosView />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default Fiscal;
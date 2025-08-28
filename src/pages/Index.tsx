import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wheat, Truck, BarChart3, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-[var(--gradient-hero)] text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Wheat className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Controle de Romaneios
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Sistema digital para gestão de cargas agrícolas com QR Code
            </p>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Otimize o processo de fiscalização e transporte com tecnologia offline-first. 
              Desde a criação do romaneio até a entrega na balança.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link to="/fiscal">
            <Card className="p-8 hover:shadow-[var(--shadow-strong)] transition-all duration-200 cursor-pointer bg-[var(--gradient-card)] border-border">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Wheat className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Fiscal de Campo</h2>
                <p className="text-muted-foreground">
                  Crie romaneios, registre dados da carga e gere QR Codes para os motoristas
                </p>
                <Button variant="hero" size="lg" className="w-full">
                  Acessar Portal
                </Button>
              </div>
            </Card>
          </Link>

          <Link to="/motorista">
            <Card className="p-8 hover:shadow-[var(--shadow-strong)] transition-all duration-200 cursor-pointer bg-[var(--gradient-card)] border-border">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center">
                  <Truck className="w-8 h-8 text-accent" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Portal do Motorista</h2>
                <p className="text-muted-foreground">
                  Escaneie QR Codes, complete seus dados e finalize romaneios
                </p>
                <Button variant="field" size="lg" className="w-full">
                  Escanear QR Code
                </Button>
              </div>
            </Card>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-20 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Como funciona
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center bg-[var(--gradient-card)] border-border shadow-[var(--shadow-medium)]">
              <div className="w-12 h-12 bg-primary/10 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Fiscal Cria</h3>
              <p className="text-muted-foreground text-sm">
                O fiscal registra dados da fazenda, parcelas e quantidade, gerando um QR Code único
              </p>
            </Card>

            <Card className="p-6 text-center bg-[var(--gradient-card)] border-border shadow-[var(--shadow-medium)]">
              <div className="w-12 h-12 bg-accent/10 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-accent">2</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Motorista Completa</h3>
              <p className="text-muted-foreground text-sm">
                O motorista escaneia o QR e adiciona seus dados: nome, CPF, placa e transportadora
              </p>
            </Card>

            <Card className="p-6 text-center bg-[var(--gradient-card)] border-border shadow-[var(--shadow-medium)]">
              <div className="w-12 h-12 bg-success/10 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-success">3</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Pronto para Balança</h3>
              <p className="text-muted-foreground text-sm">
                QR Code final é gerado com todos os dados para apresentação na balança
              </p>
            </Card>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-foreground">Vantagens</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-success mt-2" />
                  <span className="text-foreground">Funciona offline na maior parte do tempo</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-success mt-2" />
                  <span className="text-foreground">QR Codes únicos e rastreáveis</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-success mt-2" />
                  <span className="text-foreground">Interface otimizada para dispositivos móveis</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-success mt-2" />
                  <span className="text-foreground">Processo ágil e sem papelada</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-muted/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-primary" />
                <h4 className="text-lg font-semibold text-foreground">Para quem é?</h4>
              </div>
              <p className="text-muted-foreground">
                Ideal para usinas, transportadoras, fiscais de campo e motoristas que precisam 
                de um sistema rápido e confiável para controle de cargas agrícolas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
